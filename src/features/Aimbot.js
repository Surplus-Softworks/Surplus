import { settings, getUIRoot, inputState, aimState } from '@/state.js';
import { findTeam, findBullet, findWeapon, inputCommands } from '@/utils/constants.js';
import { gameManager } from '@/state.js';
import { translations } from '@/utils/obfuscatedNameTranslator.js';
import { ref_addEventListener } from '@/utils/hook.js';
import { isLayerSpoofActive, originalLayerValue } from '@/features/LayerSpoofer.js';
import { manageAimState, getCurrentAimPosition } from '@/utils/aimController.js';
import { outerDocument, outer } from '@/utils/outer.js';

const KEY_STICKY_TARGET = 'KeyN';
const arrayPush = Array.prototype.push;
const isBypassLayer = (layer) => layer === 2 || layer === 3;

const state = {
    focusedEnemy_: null,
    previousEnemies_: {},
    currentEnemy_: null,
    meleeLockEnemy_: null,
    velocityBuffer_: {},
    lastTargetScreenPos_: null,
};

const AIM_SMOOTH_DISTANCE_PX = 6;
const AIM_SMOOTH_ANGLE = Math.PI / 90;
const MELEE_ENGAGE_DISTANCE = 5.5;

const computeAimAngle = (point) => {
    if (!point) return 0;
    const centerX = outer.innerWidth / 2;
    const centerY = outer.innerHeight / 2;
    return Math.atan2(point.y - centerY, point.x - centerX);
};

const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

const shouldSmoothAim = (currentPos, nextPos) => {
    if (!nextPos) return false;
    if (!currentPos) return true;

    const distance = Math.hypot(nextPos.x - currentPos.x, nextPos.y - currentPos.y);
    if (distance > AIM_SMOOTH_DISTANCE_PX) return true;

    const angleDiff = Math.abs(normalizeAngle(computeAimAngle(nextPos) - computeAimAngle(currentPos)));
    return angleDiff > AIM_SMOOTH_ANGLE;
};

const getLocalLayer = (player) => {
    if (isBypassLayer(player.layer)) return player.layer;
    if (isLayerSpoofActive && originalLayerValue !== undefined) return originalLayerValue;
    return player.layer;
};

const meetsLayerCriteria = (targetLayer, localLayer, isLocalOnBypass) => {
    if (isBypassLayer(targetLayer) || isLocalOnBypass) return true;
    return targetLayer === localLayer;
};

const queueInput = (command) => inputState.queuedInputs_.push(command)

const handleKeydown = (event) => {
    if (event.code !== KEY_STICKY_TARGET) return;
    if (state.focusedEnemy_) {
        state.focusedEnemy_ = null;
        return;
    }
    if (settings.aimbot_.stickyTarget_) {
        state.focusedEnemy_ = state.currentEnemy_;
    }
};

Reflect.apply(ref_addEventListener, outer, ['keydown', handleKeydown]);

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

    const enemyPos = enemy[translations.visualPos];
    const currentPlayerPos = currentPlayer[translations.visualPos];
    const now = performance.now();
    const enemyId = enemy.__id;

    const history = state.previousEnemies_[enemyId] ?? (state.previousEnemies_[enemyId] = []);
    history.push([now, { ...enemyPos }]);
    if (history.length > 20) history.shift();

    if (history.length < 20) {
        return gameManager.game[translations.camera][translations.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
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
            return gameManager.game[translations.camera][translations.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
        }

        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);
        t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);

        if (t < 0 || t > 5) {
            return gameManager.game[translations.camera][translations.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
        }
    }

    const predictedPos = {
        x: enemyPos.x + vex * t,
        y: enemyPos.y + vey * t,
    };

    return gameManager.game[translations.camera][translations.pointToScreen](predictedPos);
}


function findTarget(players, me) {
    const meTeam = findTeam(me);
    const isLocalOnBypassLayer = isBypassLayer(me.layer);
    const localLayer = getLocalLayer(me);
    let enemy = null;
    let minDistance = Infinity;

    for (const player of players) {
        if (!player.active) continue;
        if (player[translations.netData][translations.dead]) continue;
        if (!settings.aimbot_.targetKnocked_ && player.downed) continue;
        if (me.__id === player.__id) continue;
        if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) continue;
        if (findTeam(player) === meTeam) continue;

        const screenPos = gameManager.game[translations.camera][translations.pointToScreen]({
            x: player[translations.visualPos].x,
            y: player[translations.visualPos].y,
        });

        const distance = getDistance(
            screenPos.x,
            screenPos.y,
            gameManager.game[translations.input].mousePos._x,
            gameManager.game[translations.input].mousePos._y,
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
        if (player[translations.netData][translations.dead]) continue;
        if (!settings.aimbot_.targetKnocked_ && player.downed) continue;
        if (me.__id === player.__id) continue;
        if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) continue;
        if (findTeam(player) === meTeam) continue;

        const mePos = me[translations.visualPos];
        const playerPos = player[translations.visualPos];
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
        const game = gameManager.game;
        if (!game.initialized || !(settings.aimbot_.enabled_ || settings.meleeLock_.enabled_) || game[translations.uiManager].spectating) {
            manageAimState({ mode: 'idle' });
            if (aimbotDot) aimbotDot.style.display = 'none';
            state.lastTargetScreenPos_ = null;
            return;
        }

        const players = game[translations.playerBarn].playerPool[translations.pool];
        const me = game[translations.activePlayer];
        const isLocalOnBypassLayer = isBypassLayer(me.layer);
        let aimUpdated = false;
        let dotTargetPos = null;
        let previewTargetPos = null;

        try {
            const currentWeaponIndex = game[translations.activePlayer][translations.localData][translations.curWeapIdx];
            const isMeleeEquipped = currentWeaponIndex === 2;
            const isGrenadeEquipped = currentWeaponIndex === 3;
            const isAiming = game[translations.inputBinds].isBindDown(inputCommands.Fire_);
            const wantsMeleeLock = settings.meleeLock_.enabled_ && isAiming;

            let meleeEnemy = state.meleeLockEnemy_;
            if (wantsMeleeLock) {
                if (!meleeEnemy || !meleeEnemy.active || meleeEnemy[translations.netData][translations.dead]) {
                    meleeEnemy = findClosestTarget(players, me);
                    state.meleeLockEnemy_ = meleeEnemy;
                }
            } else {
                meleeEnemy = null;
                state.meleeLockEnemy_ = null;
            }

            let distanceToMeleeEnemy = Infinity;
            if (meleeEnemy) {
                const mePos = me[translations.visualPos];
                const enemyPos = meleeEnemy[translations.visualPos];
                distanceToMeleeEnemy = Math.hypot(mePos.x - enemyPos.x, mePos.y - enemyPos.y);
            }

            const meleeTargetInRange = distanceToMeleeEnemy <= MELEE_ENGAGE_DISTANCE;

            if (wantsMeleeLock && settings.meleeLock_.autoMelee_ && !isMeleeEquipped && meleeTargetInRange) {
                queueInput('EquipMelee');
            }

            const meleeLockActive = wantsMeleeLock && isMeleeEquipped && meleeTargetInRange && meleeEnemy;

            if (meleeLockActive) {
                const mePos = me[translations.visualPos];
                const enemyPos = meleeEnemy[translations.visualPos];
                const moveAngle = calcAngle(enemyPos, mePos) + Math.PI;
                const moveDir = {
                    touchMoveActive: true,
                    touchMoveLen: 255,
                    x: Math.cos(moveAngle),
                    y: Math.sin(moveAngle),
                };

                const screenPos = game[translations.camera][translations.pointToScreen]({ x: enemyPos.x, y: enemyPos.y });
                manageAimState({
                    mode: 'meleeLock',
                    targetScreenPos: { x: screenPos.x, y: screenPos.y },
                    moveDir,
                });
                aimUpdated = true;
                if (aimbotDot) aimbotDot.style.display = 'none';
                state.lastTargetScreenPos_ = null;
                return;
            }

            if (wantsMeleeLock && !meleeTargetInRange) {
                state.meleeLockEnemy_ = null;
            }

            if (!settings.aimbot_.enabled_ || isMeleeEquipped || isGrenadeEquipped) {
                manageAimState({ mode: 'idle' });
                if (aimbotDot) aimbotDot.style.display = 'none';
                state.lastTargetScreenPos_ = null;
                return;
            }

            const canEngageAimbot = isAiming;

            let enemy = state.focusedEnemy_?.active && !state.focusedEnemy_[translations.netData][translations.dead] ? state.focusedEnemy_ : null;

            if (enemy) {
                const localLayer = getLocalLayer(me);
                if (!meetsLayerCriteria(enemy.layer, localLayer, isLocalOnBypassLayer)) {
                    enemy = null;
                    state.focusedEnemy_ = null;
                } else if (aimbotDot) {
                    aimbotDot.style.backgroundColor = 'rgb(190, 12, 185)';
                }
            }

            if (!enemy) {
                if (aimbotDot) aimbotDot.style.backgroundColor = 'red';
                state.focusedEnemy_ = null;
                enemy = findTarget(players, me);
                state.currentEnemy_ = enemy;
            }

            if (enemy) {
                const mePos = me[translations.visualPos];
                const enemyPos = enemy[translations.visualPos];
                const distanceToEnemy = Math.hypot(mePos.x - enemyPos.x, mePos.y - enemyPos.y);

                if (enemy !== state.currentEnemy_ && !state.focusedEnemy_) {
                    state.currentEnemy_ = enemy;
                    state.previousEnemies_[enemy.__id] = [];
                    state.velocityBuffer_[enemy.__id] = [];
                }

                const predictedPos = predictPosition(enemy, me);
                if (!predictedPos) {
                    manageAimState({ mode: 'idle' });
                    if (aimbotDot) aimbotDot.style.display = 'none';
                    state.lastTargetScreenPos_ = null;
                    return;
                }

                previewTargetPos = { x: predictedPos.x, y: predictedPos.y };

                if (canEngageAimbot && (settings.aimbot_.enabled_ || (settings.meleeLock_.enabled_ && distanceToEnemy <= 8))) {
                    const currentAimPos = getCurrentAimPosition();
                    const shouldSmooth = shouldSmoothAim(currentAimPos, predictedPos);
                    manageAimState({
                        mode: 'aimbot',
                        targetScreenPos: { x: predictedPos.x, y: predictedPos.y },
                        immediate: !shouldSmooth,
                    });
                    state.lastTargetScreenPos_ = { x: predictedPos.x, y: predictedPos.y };
                    aimUpdated = true;
                    const aimSnapshot = aimState.lastAimPos_;
                    dotTargetPos = aimSnapshot
                        ? { x: aimSnapshot.clientX, y: aimSnapshot.clientY }
                        : { x: predictedPos.x, y: predictedPos.y };
                } else {
                    dotTargetPos = { x: predictedPos.x, y: predictedPos.y };
                }
            } else {
                previewTargetPos = null;
                dotTargetPos = null;
                if (aimbotDot) aimbotDot.style.display = 'none';
                state.lastTargetScreenPos_ = null;
            }

            if (!aimUpdated) {
                manageAimState({ mode: 'idle' });
                state.lastTargetScreenPos_ = previewTargetPos
                    ? { x: previewTargetPos.x, y: previewTargetPos.y }
                    : null;
            }
            if (aimbotDot) {
                let displayPos = dotTargetPos;
                if (!displayPos && previewTargetPos) {
                    displayPos = { x: previewTargetPos.x, y: previewTargetPos.y };
                }

                if (displayPos) {
                    const { x, y } = displayPos;
                    if (aimbotDot.style.left !== `${x}px` || aimbotDot.style.top !== `${y}px`) {
                        aimbotDot.style.left = `${x}px`;
                        aimbotDot.style.top = `${y}px`;
                    }
                    aimbotDot.style.display = 'block';
                } else {
                    aimbotDot.style.display = 'none';
                }
            }

        } catch (error) {
            if (aimbotDot) aimbotDot.style.display = 'none';
            manageAimState({ mode: 'idle', immediate: true });
            state.meleeLockEnemy_ = null;
            state.focusedEnemy_ = null;
            state.currentEnemy_ = null;
            state.lastTargetScreenPos_ = null;
        }
    } catch (error) {
        manageAimState({ mode: 'idle', immediate: true });
        state.lastTargetScreenPos_ = null;
    }
}


const ensureOverlay = () => {
    const uiRoot = getUIRoot();
    if (!uiRoot) {
        return false;
    }
    if (!aimbotDot) {
        aimbotDot = outerDocument.createElement('div');
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
