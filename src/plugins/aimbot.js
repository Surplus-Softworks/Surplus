import { settings, getUIRoot, inputState, aimState, resetAimState } from '@/state.js';
import { findTeam, findBullet, findWeapon, inputCommands } from '@/utils/constants.js';
import { gameManager } from '@/utils/injector.js';
import { tr } from '@/utils/obfuscatedNameTranslator.js';
import { reflect, ref_addEventListener } from '@/utils/hook.js';
import { isLayerHackActive, originalLayerValue } from '@/plugins/layerHack.js';

const KEY_STICKY_TARGET = 'KeyN';
const arrayPush = Array.prototype.push;
const isBypassLayer = (layer) => layer === 2 || layer === 3;

const state = {
    focusedEnemy: null,
    previousEnemies: {},
    currentEnemy: null,
    meleeLockEnemy: null,
    velocityBuffer: {},
};

const getLocalLayer = (player) => {
    if (isBypassLayer(player.layer)) return player.layer;
    if (isLayerHackActive && originalLayerValue !== undefined) return originalLayerValue;
    return player.layer;
};

const meetsLayerCriteria = (targetLayer, localLayer, isLocalOnBypass) => {
    if (isBypassLayer(targetLayer) || isLocalOnBypass) return true;
    return targetLayer === localLayer;
};

const queueInput = (command) => reflect.apply(arrayPush, inputState.queuedInputs, [command]);

const handleKeydown = (event) => {
    if (event.code !== KEY_STICKY_TARGET) return;
    if (state.focusedEnemy) {
        state.focusedEnemy = null;
        return;
    }
    if (settings.aimbot.stickyTarget) {
        state.focusedEnemy = state.currentEnemy;
    }
};

reflect.apply(ref_addEventListener, globalThis, ['keydown', handleKeydown]);

let aimbotDot;
let tickerAttached = false;

function getDistance(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function calcAngle(playerPos, mePos) {
    const dx = mePos.x - playerPos.x;
    const dy = mePos.y - playerPos.y;

    return Math.atan2(dy, dx);
}

function predictPosition(enemy, currentPlayer) {
    if (!enemy || !currentPlayer) return null;

    const enemyPos = enemy[tr.visualPos];
    const currentPlayerPos = currentPlayer[tr.visualPos];
    const now = performance.now();
    const enemyId = enemy.__id;

    const history = state.previousEnemies[enemyId] ?? (state.previousEnemies[enemyId] = []);
    history.push([now, { ...enemyPos }]);
    if (history.length > 20) history.shift();

    if (history.length < 20) {
        return gameManager.game[tr.camera][tr.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
    }

    const deltaTime = (now - history[0][0]) / 1000;
    const velocity = {
        x: (enemyPos.x - history[0][1].x) / deltaTime,
        y: (enemyPos.y - history[0][1].y) / deltaTime,
    };

    const weapon = findWeapon(currentPlayer);
    const bullet = findBullet(weapon);
    const bulletSpeed = bullet?.speed || 1000;

    const { x: vex, y: vey } = velocity;
    const dx = enemyPos.x - currentPlayerPos.x;
    const dy = enemyPos.y - currentPlayerPos.y;
    const vb = bulletSpeed;

    const a = vb ** 2 - vex ** 2 - vey ** 2;
    const b = -2 * (vex * dx + vey * dy);
    const c = -(dx ** 2) - dy ** 2;

    let t;

    if (Math.abs(a) < 1e-6) {
        t = -c / b;
    } else {
        const discriminant = b ** 2 - 4 * a * c;
        if (discriminant < 0) {
            return gameManager.game[tr.camera][tr.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
        }

        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);
        t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);

        if (t < 0 || t > 5) {
            return gameManager.game[tr.camera][tr.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
        }
    }

    const predictedPos = {
        x: enemyPos.x + vex * t,
        y: enemyPos.y + vey * t,
    };

    return gameManager.game[tr.camera][tr.pointToScreen](predictedPos);
}


function findTarget(players, me) {
    const meTeam = findTeam(me);
    const isLocalOnBypassLayer = isBypassLayer(me.layer);
    const localLayer = getLocalLayer(me);
    let enemy = null;
    let minDistance = Infinity;

    for (const player of players) {
        if (!player.active) continue;
        if (player[tr.netData][tr.dead]) continue;
        if (!settings.aimbot.targetKnocked && player.downed) continue;
        if (me.__id === player.__id) continue;
        if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) continue;
        if (findTeam(player) === meTeam) continue;

        const screenPos = gameManager.game[tr.camera][tr.pointToScreen]({
            x: player[tr.visualPos].x,
            y: player[tr.visualPos].y,
        });

        const distance = getDistance(
            screenPos.x,
            screenPos.y,
            gameManager.game[tr.input].mousePos._x,
            gameManager.game[tr.input].mousePos._y,
        );

        if (distance < minDistance) {
            minDistance = distance;
            enemy = player;
        }
    }

    return enemy;
}

function findClosestTarget(players, me) {
    const meTeam = findTeam(me);
    const isLocalOnBypassLayer = isBypassLayer(me.layer);
    const localLayer = getLocalLayer(me);
    let enemy = null;
    let minDistance = Infinity;

    for (const player of players) {
        if (!player.active) continue;
        if (player[tr.netData][tr.dead]) continue;
        if (!settings.aimbot.targetKnocked && player.downed) continue;
        if (me.__id === player.__id) continue;
        if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) continue;
        if (findTeam(player) === meTeam) continue;

        const mePos = me[tr.visualPos];
        const playerPos = player[tr.visualPos];
        const distance = getDistance(mePos.x, mePos.y, playerPos.x, playerPos.y);

        if (distance < minDistance) {
            minDistance = distance;
            enemy = player;
        }
    }

    return enemy;
}


function aimbotTicker() {
    try {
        aimState.lastAimPos = null;
        aimState.aimTouchMoveDir = null;

        const game = gameManager.game;
        if (!game.initialized || !(settings.aimbot.enabled || settings.meleeLock.enabled) || game[tr.uiManager].spectating) {
            if (aimbotDot) aimbotDot.style.display = 'none';
            return;
        }

        const players = game[tr.playerBarn].playerPool[tr.pool];
        const me = game[tr.activePlayer];
        const isLocalOnBypassLayer = isBypassLayer(me.layer);

        try {
            const currentWeaponIndex = game[tr.activePlayer][tr.localData][tr.curWeapIdx];
            const isMeleeEquipped = currentWeaponIndex === 2;
            const isGrenadeEquipped = currentWeaponIndex === 3;
            const isAiming = game[tr.inputBinds].isBindDown(inputCommands.Fire);
            const meleeLockActive = settings.meleeLock.enabled && (isMeleeEquipped || settings.meleeLock.autoMelee) && isAiming;

            if (meleeLockActive) {
                if (!isAiming) {
                    state.meleeLockEnemy = null;
                }

                if (!state.meleeLockEnemy || !state.meleeLockEnemy.active || state.meleeLockEnemy[tr.netData][tr.dead]) {
                    state.meleeLockEnemy = findClosestTarget(players, me);
                }

                if (state.meleeLockEnemy) {
                    const mePos = me[tr.visualPos];
                    const enemyPos = state.meleeLockEnemy[tr.visualPos];
                    const distanceToEnemy = Math.hypot(mePos.x - enemyPos.x, mePos.y - enemyPos.y);

                    if (distanceToEnemy <= 5.5) {
                        const moveAngle = calcAngle(enemyPos, mePos) + Math.PI;
                        aimState.aimTouchMoveDir = {
                            touchMoveActive: true,
                            touchMoveLen: 255,
                            x: Math.cos(moveAngle),
                            y: Math.sin(moveAngle),
                        };

                        const screenPos = game[tr.camera][tr.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
                        aimState.lastAimPos = { clientX: screenPos.x, clientY: screenPos.y };

                        if (settings.meleeLock.autoMelee && !isMeleeEquipped) {
                            queueInput('EquipMelee');
                        }

                        if (aimbotDot) aimbotDot.style.display = 'none';
                        return;
                    }

                    state.meleeLockEnemy = null;
                }
            } else {
                state.meleeLockEnemy = null;
            }

            if (!settings.aimbot.enabled || isMeleeEquipped || isGrenadeEquipped) {
                if (aimbotDot) aimbotDot.style.display = 'none';
                return;
            }

            let enemy = state.focusedEnemy?.active && !state.focusedEnemy[tr.netData][tr.dead] ? state.focusedEnemy : null;

            if (enemy) {
                const localLayer = getLocalLayer(me);
                if (!meetsLayerCriteria(enemy.layer, localLayer, isLocalOnBypassLayer)) {
                    enemy = null;
                    state.focusedEnemy = null;
                } else if (aimbotDot) {
                    aimbotDot.style.backgroundColor = 'rgb(190, 12, 185)';
                }
            }

            if (!enemy) {
                if (aimbotDot) aimbotDot.style.backgroundColor = 'red';
                state.focusedEnemy = null;
                enemy = findTarget(players, me);
                state.currentEnemy = enemy;
            }

            if (enemy) {
                const mePos = me[tr.visualPos];
                const enemyPos = enemy[tr.visualPos];
                const distanceToEnemy = Math.hypot(mePos.x - enemyPos.x, mePos.y - enemyPos.y);

                if (enemy !== state.currentEnemy && !state.focusedEnemy) {
                    state.currentEnemy = enemy;
                    state.previousEnemies[enemy.__id] = [];
                    state.velocityBuffer[enemy.__id] = [];
                }

                const predictedPos = predictPosition(enemy, me);
                if (!predictedPos) {
                    if (aimbotDot) aimbotDot.style.display = 'none';
                    return;
                }

                if (settings.aimbot.enabled || (settings.meleeLock.enabled && distanceToEnemy <= 8)) {
                    aimState.lastAimPos = { clientX: predictedPos.x, clientY: predictedPos.y };
                    if (
                        aimbotDot &&
                        (aimbotDot.style.left !== `${predictedPos.x}px` || aimbotDot.style.top !== `${predictedPos.y}px`)
                    ) {
                        aimbotDot.style.left = `${predictedPos.x}px`;
                        aimbotDot.style.top = `${predictedPos.y}px`;
                        aimbotDot.style.display = 'block';
                    }
                } else if (aimbotDot) {
                    aimbotDot.style.display = 'none';
                }
            } else {
                aimState.lastAimPos = null;
                if (aimbotDot) aimbotDot.style.display = 'none';
            }
        } catch (error) {
            if (aimbotDot) aimbotDot.style.display = 'none';
            resetAimState();
            state.meleeLockEnemy = null;
            state.focusedEnemy = null;
            state.currentEnemy = null;
        }
    } catch (error) {
        resetAimState();
    }
}


const ensureOverlay = () => {
    const uiRoot = getUIRoot();
    if (!uiRoot) {
        return false;
    }
    if (!aimbotDot) {
        aimbotDot = document.createElement('div');
        aimbotDot.classList.add('aimbot-dot');
        uiRoot.appendChild(aimbotDot);
    }
    return true;
};

export default function() {
    const startTicker = () => {
        if (ensureOverlay()) {
            if (!tickerAttached) {
                gameManager.pixi._ticker.add(aimbotTicker);
                tickerAttached = true;
            }
        } else {
            requestAnimationFrame(startTicker);
        }
    };

    startTicker();
}
