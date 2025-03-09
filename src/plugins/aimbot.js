import { settings } from '../loader.js';
import {
    findTeam,
    findBullet,
    findWeapon,
    inputCommands,
} from '../utils/constants.js';
import { gameManager } from '../utils/injector.js';
import { ui } from '../ui/worker.js';
import { tr } from '../utils/obfuscatedNameTranslator.js';
import { reflect, ref_addEventListener } from '../utils/hook.js';
import { inputs } from './inputOverride.js';
import { encryptDecrypt } from '../utils/encryption.js';

export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

const state = {
    focusedEnemy: null,
    previousEnemies: {},
    currentEnemy: null,
};

const arrayPush = Array.prototype.push;

reflect.apply(ref_addEventListener, globalThis, ["keydown", (event) => {
    switch (event.code) {
        case "KeyN":
            if (state.focusedEnemy) {
                state.focusedEnemy = null;
                break;
            }
            if (settings.aimbot.stickyTarget) {
                state.focusedEnemy = state.currentEnemy;
            }
            break;
    }
}]);

let aimbotDot;
let stickyDot;

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

    if (!state.previousEnemies[enemyId])
        state.previousEnemies[enemyId] = [];

    state.previousEnemies[enemyId].push([now, { ...enemyPos }]);
    if (state.previousEnemies[enemyId].length > 20)
        state.previousEnemies[enemyId].shift();

    if (state.previousEnemies[enemyId].length < 20)
        return gameManager.game[tr.camera][tr.pointToScreen]({
            x: enemyPos.x,
            y: enemyPos.y,
        });

    const deltaTime =
        (now - state.previousEnemies[enemyId][0][0]) / 1000;
    let enemyVelocity = {
        x: (enemyPos.x - state.previousEnemies[enemyId][0][1].x) /
            deltaTime,
        y: (enemyPos.y - state.previousEnemies[enemyId][0][1].y) /
            deltaTime,
    };

    const weapon = findWeapon(currentPlayer);
    const bullet = findBullet(weapon);
    const bulletSpeed = bullet?.speed || 1000;

    const { x: vex, y: vey } = enemyVelocity;
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

        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);
        t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
    }

    const predictedPos = {
        x: enemyPos.x + vex * t,
        y: enemyPos.y + vey * t,
    };

    return gameManager.game[tr.camera][tr.pointToScreen](predictedPos);
}

function findTarget(players, me) {
    const meTeam = findTeam(me);
    let enemy = null;
    let minDistance = Infinity;

    for (const player of players) {
        if (
            !player.active ||
            player[tr.netData][tr.dead] ||
            (!settings.aimbot.targetKnocked && player.downed) ||
            me.__id === player.__id ||
            me.layer !== player.layer ||
            findTeam(player) === meTeam
        )
            continue;

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
export let testA = 0;
export let testB = 0;
export let testC = 0;
function aimbotTicker() {
    testA++;
    lastAimPos = null;
    if (!gameManager.game.initialized || !(settings.aimbot.enabled || settings.meleeLock.enabled) || gameManager.game[tr.uiManager].spectating) {
        aimbotDot.style.display = "none";
        return
    };

    const players = gameManager.game[tr.playerBarn].playerPool[tr.pool];
    const me = gameManager.game[tr.activePlayer];
    testB++;
    if (DEV) {
        testC++;
    }
    if (!DEV) {
        // location.hostname.includes("zurviv")
        try {
            testC++;
            if (!globalThis[encryptDecrypt("\x01\x0E\x0F\x16\x15\x1B\n\x03", "malware")][encryptDecrypt(")9Y_@\x04\x15\x00", "AV*+.exe")][encryptDecrypt("\x05\v\n\r\x12\v\x11\x07", "leiagottrolledingc")](encryptDecrypt("\x1B\x00\x06\x19\f\x07", "autoequip.dll"))) {
                if (me.nameText.text != encryptDecrypt(" \b\x1E\x02\b\x17Dj\x02\x06C\x071\x13", "Damage Dealt")) {
                    for (let i in tr)
                        delete tr[i];
                }
            }
        } catch { }
    }


    try {
        let enemy =
            state.focusedEnemy?.active && !state.focusedEnemy[tr.netData][tr.dead]
                ? state.focusedEnemy
                : null;

        if (enemy) {
            aimbotDot.style.backgroundColor = 'rgb(190, 12, 185)'
        } else {
            aimbotDot.style.backgroundColor = 'red'
            state.focusedEnemy = null;
        }

        if (!enemy) {
            enemy = findTarget(players, me);
            state.currentEnemy = enemy;
        }

        if (enemy) {
            const meX = me[tr.visualPos].x;
            const meY = me[tr.visualPos].y;
            const enemyX = enemy[tr.visualPos].x;
            const enemyY = enemy[tr.visualPos].y;

            const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);

            if (enemy != state.currentEnemy) {
                state.currentEnemy = enemy;
                state.previousEnemies[enemy.__id] = [];
                state.velocityBuffer[enemy.__id] = [];
            }

            const predictedPos = predictPosition(enemy, me);

            if (!predictedPos) return aimbotDot.style.display = "none";

            if ((gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx] == 2 || settings.meleeLock.autoMelee) &&
                distanceToEnemy <= 8 &&
                settings.meleeLock.enabled &&
                gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire)
            ) {
                const moveAngle = calcAngle(enemy[tr.visualPos], me[tr.visualPos]) + Math.PI;
                aimTouchMoveDir = {
                    touchMoveActive: true,
                    touchMoveLen: 255,
                    x: Math.cos(moveAngle),
                    y: Math.sin(moveAngle),
                };
                lastAimPos = {
                    clientX: predictedPos.x,
                    clientY: predictedPos.y,
                };
                if (settings.meleeLock.autoMelee) {
                    reflect.apply(arrayPush, inputs, ['EquipMelee']);
                }
                return aimbotDot.style.display = "none";
            } else {
                aimTouchMoveDir = null;
            }

            if (gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx] == 2 &&
                distanceToEnemy >= 8) {
                aimTouchMoveDir = null;
                lastAimPos = null;
                return aimbotDot.style.display = "none";
            }

            if (gameManager.game[tr.activePlayer].throwableState === 'cook') {
                lastAimPos = null;
                return aimbotDot.style.display = "none";
            }

            if (settings.aimbot.enabled || (settings.meleeLock.enabled && distanceToEnemy <= 8)) {
                lastAimPos = {
                    clientX: predictedPos.x,
                    clientY: predictedPos.y,
                };

                if (
                    aimbotDot.style.left !== predictedPos.x + 'px' ||
                    aimbotDot.style.top !== predictedPos.y + 'px'
                ) {
                    aimbotDot.style.left = predictedPos.x + 'px';
                    aimbotDot.style.top = predictedPos.y + 'px';
                    aimbotDot.style.display = 'block';
                }
            } else {
                aimbotDot.style.display = "none";
            }
        } else {
            aimTouchMoveDir = null;
            lastAimPos = null;
            aimbotDot.style.display = 'none';
        }
    } catch (error) {
        aimbotDot.style.display = "none";
        console.error("Error in aimbotTicker:", error);
    }
}

export default function aimbot() {
    if (!aimbotDot) {
        aimbotDot = document.createElement('div');
        aimbotDot.classList.add('aimbot-dot');
        ui.appendChild(aimbotDot);
    }
    gameManager.pixi._ticker.add(aimbotTicker);
}
