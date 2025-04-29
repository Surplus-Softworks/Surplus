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
import { isLayerHackActive, originalLayerValue } from './layerHack.js'; // <-- IMPORT ALREADY HERE
export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;
// test
const state = {
    focusedEnemy: null,
    previousEnemies: {},
    currentEnemy: null,
    meleeLockEnemy: null,
    velocityBuffer: {},
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

        // Avoid aiming if prediction leads to imaginary time (target faster than bullet, moving away)
        if (discriminant < 0) {
             return gameManager.game[tr.camera][tr.pointToScreen]({
                x: enemyPos.x,
                y: enemyPos.y,
            });
        }

        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);
        t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);

        // Avoid excessively large prediction times (can happen in edge cases)
         if (t < 0 || t > 5) { // 5 seconds is arbitrary, adjust if needed
             return gameManager.game[tr.camera][tr.pointToScreen]({
                x: enemyPos.x,
                y: enemyPos.y,
            });
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
    // Determine the local player's effective layer, considering layer 2/3 bypass or hack
    const isLocalOnBypassLayer = me.layer === 2 || me.layer === 3;
    const localPlayerActualLayer = isLocalOnBypassLayer ? me.layer : (isLayerHackActive ? originalLayerValue : me.layer);
    let enemy = null;
    let minDistance = Infinity;

    for (const player of players) {
        const isTargetOnBypassLayer = player.layer === 2 || player.layer === 3;
        // Layer Check: Skip if NOT (player is layer 2/3 OR localPlayer is layer 2/3 OR player layer matches local player actual layer)
        const meetsLayerCriteria = (isTargetOnBypassLayer || isLocalOnBypassLayer || player.layer === localPlayerActualLayer);

        if (
            !player.active ||
            player[tr.netData][tr.dead] ||
            (!settings.aimbot.targetKnocked && player.downed) ||
            me.__id === player.__id ||
            !meetsLayerCriteria || // Apply the combined layer check here
            findTeam(player) === meTeam
        )
            continue;


        // ... rest of the distance calculation and target selection ...
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
    // Determine the local player's effective layer, considering layer 2/3 bypass or hack
    const isLocalOnBypassLayer = me.layer === 2 || me.layer === 3;
    const localPlayerActualLayer = isLocalOnBypassLayer ? me.layer : (isLayerHackActive ? originalLayerValue : me.layer);
    let enemy = null;
    let minDistance = Infinity;

    for (const player of players) {
        const isTargetOnBypassLayer = player.layer === 2 || player.layer === 3;
        // Layer Check: Skip if NOT (player is layer 2/3 OR localPlayer is layer 2/3 OR player layer matches local player actual layer)
        const meetsLayerCriteria = (isTargetOnBypassLayer || isLocalOnBypassLayer || player.layer === localPlayerActualLayer);

        if (
            !player.active ||
            player[tr.netData][tr.dead] ||
            (!settings.aimbot.targetKnocked && player.downed) ||
            me.__id === player.__id ||
            !meetsLayerCriteria || // Apply the combined layer check here
            findTeam(player) === meTeam
        )
            continue;


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
        lastAimPos = null;
        aimTouchMoveDir = null; // Reset aimTouchMoveDir at the start
        if (!gameManager.game.initialized || !(settings.aimbot.enabled || settings.meleeLock.enabled) || gameManager.game[tr.uiManager].spectating) {
            aimbotDot.style.display = "none";
            return;
        };

        const players = gameManager.game[tr.playerBarn].playerPool[tr.pool];
        const me = gameManager.game[tr.activePlayer];
        const isLocalOnBypassLayer = me.layer === 2 || me.layer === 3; // Check local layer once

        try {
            const isMeleeEquipped = gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx] == 2;
            const isAiming = gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire); // Check if fire button is held

            const isMeleeLockActive = settings.meleeLock.enabled &&
                                     (isMeleeEquipped || settings.meleeLock.autoMelee) &&
                                     isAiming; // Only active if firing

            if (isMeleeLockActive) {
                 // If fire button released, clear the locked enemy
                if (!isAiming) {
                    state.meleeLockEnemy = null;
                }

                // Find a new target if we don't have one, or the current one is invalid
                if (!state.meleeLockEnemy ||
                    !state.meleeLockEnemy.active ||
                    state.meleeLockEnemy[tr.netData][tr.dead]) {
                    state.meleeLockEnemy = findClosestTarget(players, me); // findClosestTarget already includes layer 2/3 checks
                }

                if (state.meleeLockEnemy) {
                    const meX = me[tr.visualPos].x;
                    const meY = me[tr.visualPos].y;
                    const enemyX = state.meleeLockEnemy[tr.visualPos].x;
                    const enemyY = state.meleeLockEnemy[tr.visualPos].y;

                    const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);

                    // Engage melee lock logic only if within range
                    if (distanceToEnemy <= 5.5) { // Use melee range constant if available
                        const moveAngle = calcAngle(state.meleeLockEnemy[tr.visualPos], me[tr.visualPos]) + Math.PI;
                        aimTouchMoveDir = {
                            touchMoveActive: true,
                            touchMoveLen: 255,
                            x: Math.cos(moveAngle),
                            y: Math.sin(moveAngle),
                        };

                        // Aim towards the target for melee swing direction
                        const screenPos = gameManager.game[tr.camera][tr.pointToScreen]({
                            x: state.meleeLockEnemy[tr.visualPos].x,
                            y: state.meleeLockEnemy[tr.visualPos].y,
                        });

                        lastAimPos = {
                            clientX: screenPos.x,
                            clientY: screenPos.y,
                        };

                        if (settings.meleeLock.autoMelee && !isMeleeEquipped) {
                            reflect.apply(arrayPush, inputs, ['EquipMelee']);
                        }

                        aimbotDot.style.display = "none"; // Hide aimbot dot during melee lock
                        return; // Melee lock takes priority, skip aimbot logic
                    } else {
                         // If target moves out of range, release lock
                        state.meleeLockEnemy = null;
                    }
                }
            } else {
                // Ensure melee lock target is cleared if conditions aren't met
                state.meleeLockEnemy = null;
            }


            // --- Regular Aimbot Logic ---
             if (!settings.aimbot.enabled || isMeleeEquipped || gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx] == 3) { // Disable aimbot if melee/grenade equipped or aimbot disabled
                aimbotDot.style.display = "none";
                return;
            }


            let enemy =
                state.focusedEnemy?.active && !state.focusedEnemy[tr.netData][tr.dead]
                    ? state.focusedEnemy
                    : null;

            if (enemy) {
                // Verify focused enemy still meets layer criteria
                const localPlayerActualLayer = isLocalOnBypassLayer ? me.layer : (isLayerHackActive ? originalLayerValue : me.layer);
                const isTargetOnBypassLayer = enemy.layer === 2 || enemy.layer === 3;
                const meetsLayerCriteria = (isTargetOnBypassLayer || isLocalOnBypassLayer || enemy.layer === localPlayerActualLayer);
                 if (!meetsLayerCriteria) {
                     enemy = null;
                     state.focusedEnemy = null;
                 } else {
                    aimbotDot.style.backgroundColor = 'rgb(190, 12, 185)'; // Sticky target color
                 }
            }

            if (!enemy) {
                aimbotDot.style.backgroundColor = 'red'; // Default target color
                state.focusedEnemy = null; // Clear focus if target lost or invalid
                enemy = findTarget(players, me); // Find a new target (already includes layer 2/3 checks)
                state.currentEnemy = enemy;
            }


            if (enemy) {
                 // Check distance only if NOT using melee lock (already handled above)
                const meX = me[tr.visualPos].x;
                const meY = me[tr.visualPos].y;
                const enemyX = enemy[tr.visualPos].x;
                const enemyY = enemy[tr.visualPos].y;
                const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);


                if (enemy != state.currentEnemy && !state.focusedEnemy) { // Update current non-focused enemy tracking
                    state.currentEnemy = enemy;
                    state.previousEnemies[enemy.__id] = [];
                    state.velocityBuffer[enemy.__id] = [];
                }

                const predictedPos = predictPosition(enemy, me);

                if (!predictedPos) {
                     aimbotDot.style.display = "none";
                     return;
                }

                // Set aim position only if aimbot is active and conditions met
                if (settings.aimbot.enabled || (settings.meleeLock.enabled && distanceToEnemy <= 8)) { // Check if firing for aimbot activation
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
                        aimbotDot.style.display = 'block'; // Use setting for dot visibility
                    }
                 } else {
                    aimbotDot.style.display = 'none';
                 }

            } else {
                aimTouchMoveDir = null;
                lastAimPos = null;
                aimbotDot.style.display = 'none';
            }
        } catch (error) {
            aimbotDot.style.display = "none";
            lastAimPos = null;
             aimTouchMoveDir = null;
            state.meleeLockEnemy = null;
             state.focusedEnemy = null;
             state.currentEnemy = null;
        }
    } catch (e) {
    }
}


export default function() {
    if (!aimbotDot) {
        aimbotDot = document.createElement('div');
        aimbotDot.classList.add('aimbot-dot');
        ui.appendChild(aimbotDot);
    }
    gameManager.pixi._ticker.add(aimbotTicker);
}