//import { updateOverlay, aimbotDot } from '../overlay.js';

import { settings } from '../loader.js';
import { getTeam, findBullet, findWeap } from '../utils/constants.js';
import { gameManager } from '../utils/injector.js';
import { ui } from '../ui/worker.js';

export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

let state = {
    isAimBotEnabled: true,
    isAimAtKnockedOutEnabled: true,
    get aimAtKnockedOutStatus() {
        return this.isAimBotEnabled && this.isAimAtKnockedOutEnabled;
    },
    isZoomEnabled: true,
    isMeleeAttackEnabled: true,
    get meleeStatus() {
        return this.isAimBotEnabled && this.isMeleeAttackEnabled;
    },
    isSpinBotEnabled: false,
    isAutoSwitchEnabled: true,
    isUseOneGunEnabled: false,
    focusedEnemy: null,
    get focusedEnemyStatus() {
        return this.isAimBotEnabled && this.focusedEnemy;
    },
    isXrayEnabled: true,
    friends: [],
    lastFrames: {},
    enemyAimBot: null,
    isLaserDrawerEnabled: true,
    isLineDrawerEnabled: true,
    isNadeDrawerEnabled: true,
    isOverlayEnabled: true,
};

let aimbotDot;

export function aimbotTicker() {

    if (!state.isAimBotEnabled) return;

    const players = gameManager.game.playerBarn.playerPool.pool;
    const me = gameManager.game.activePlayer;

    try {
        const meTeam = getTeam(me);

        let enemy = null;
        let minDistanceToEnemyFromMouse = Infinity;

        if (state.focusedEnemy && state.focusedEnemy.active && !state.focusedEnemy.netData.dead) {
            enemy = state.focusedEnemy;
        } else {
            if (state.focusedEnemy) {
                state.focusedEnemy = null;
                //updateOverlay();
            }

            players.forEach((player) => {
                // We miss inactive or dead players
                if (!player.active || player.netData.dead || (!state.aimAtKnockedEnabled && player.downed) || me.__id === player.__id || me.layer !== player.layer || getTeam(player) == meTeam || state.friends.includes(player.nameText._text)) return;

                const screenPlayerPos = gameManager.game.camera.pointToScreen({ x: player.pos.x, y: player.pos.y });
                // const distanceToEnemyFromMouse = Math.hypot(screenPlayerPos.x - unsafeWindow.game.input.mousePos.x, screenPlayerPos.y - unsafeWindow.game.input.mousePos.x);
                const distanceToEnemyFromMouse = (screenPlayerPos.x - gameManager.game.input.mousePos.x) ** 2 + (screenPlayerPos.y - gameManager.game.input.mousePos.y) ** 2;

                if (distanceToEnemyFromMouse < minDistanceToEnemyFromMouse) {
                    minDistanceToEnemyFromMouse = distanceToEnemyFromMouse;
                    enemy = player;
                }
            });
        }

        if (enemy) {
            const meX = me.pos.x;
            const meY = me.pos.y;
            const enemyX = enemy.pos.x;
            const enemyY = enemy.pos.y;

            const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);
            // const distanceToEnemy = (meX - enemyX) ** 2 + (meY - enemyY) ** 2;

            if (enemy != state.enemyAimbot) {
                state.enemyAimbot = enemy;
                state.lastFrames[enemy.__id] = [];
            }

            const predictedEnemyPos = calculatePredictedPosForShoot(enemy, me);

            if (!predictedEnemyPos) return;

            lastAimPos = {
                clientX: predictedEnemyPos.x,
                clientY: predictedEnemyPos.y,
            }

            // AutoMelee
            if (state.meleeAttackENabled && distanceToEnemy <= 8) {
                const moveAngle = calcAngle(enemy.pos, me.pos) + Math.PI;
                aimTouchMoveDir = {
                    x: Math.cos(moveAngle),
                    y: Math.sin(moveAngle),
                }
                aimTouchDistanceToEnemy = distanceToEnemy;
            } else {
                aimTouchMoveDir = null;
                aimTouchDistanceToEnemy = null;
            }

            if (aimbotDot.style.left !== predictedEnemyPos.x + 'px' || aimbotDot.style.top !== predictedEnemyPos.y + 'px') {
                aimbotDot.style.left = predictedEnemyPos.x + 'px';
                aimbotDot.style.top = predictedEnemyPos.y + 'px';
                aimbotDot.style.display = 'block';
            }
        } else {
            aimTouchMoveDir = null;
            lastAimPos = null;
            aimbotDot.style.display = "none";
        }
    } catch (error) {
        console.error("Error in aimBot:", error);
    }
}

export function aimBotToggle() {
    state.isAimBotEnabled = !state.isAimBotEnabled;
    if (state.isAimBotEnabled) return;

    aimbotDot.style.display = "none";
    lastAimPos = null;
    aimTouchMoveDir = null;
}

export function meleeAttackToggle() {
    state.meleeAttackEnabled = !state.meleeAttackEnabled;
    if (state.meleeAttackEnabled) return;

    aimTouchMoveDir = null;
}

function calculatePredictedPosForShoot(enemy, curPlayer) {
    if (!enemy || !curPlayer) {
        console.log("Missing enemy or player data");
        return null;
    }
    
    const { pos: enemyPos } = enemy;
    const { pos: curPlayerPos } = curPlayer;

    const dateNow = performance.now();

    if ( !(enemy.__id in state.lastFrames) ) state.lastFrames[enemy.__id] = [];
    state.lastFrames[enemy.__id].push([dateNow, { ...enemyPos }]);

    if (state.lastFrames[enemy.__id].length < 30) {
        console.log("Insufficient data for prediction, using current position");
        return gameManager.game.camera.pointToScreen({x: enemyPos.x, y: enemyPos.y});
    }

    if (state.lastFrames[enemy.__id].length > 30){
        state.lastFrames[enemy.__id].shift();
    }

    const deltaTime = (dateNow - state.lastFrames[enemy.__id][0][0]) / 1000; // Time since last frame in seconds

    const enemyVelocity = {
        x: (enemyPos.x - state.lastFrames[enemy.__id][0][1].x) / deltaTime,
        y: (enemyPos.y - state.lastFrames[enemy.__id][0][1].y) / deltaTime,
    };

    const weapon = findWeap(curPlayer);
    const bullet = findBullet(weapon);

    let bulletSpeed;
    if (!bullet) {
        bulletSpeed = 1000;
    }else{
        bulletSpeed = bullet.speed;
    }


    // Quadratic equation for time prediction
    const vex = enemyVelocity.x;
    const vey = enemyVelocity.y;
    const dx = enemyPos.x - curPlayerPos.x;
    const dy = enemyPos.y - curPlayerPos.y;
    const vb = bulletSpeed;

    const a = vb ** 2 - vex ** 2 - vey ** 2;
    const b = -2 * (vex * dx + vey * dy);
    const c = -(dx ** 2) - (dy ** 2);

    let t; 

    if (Math.abs(a) < 1e-6) {
        console.log('Linear solution bullet speed is much greater than velocity')
        t = -c / b;
    } else {
        const discriminant = b ** 2 - 4 * a * c;

        if (discriminant < 0) {
            console.log("No solution, shooting at current position");
            return gameManager.game.camera.pointToScreen({x: enemyPos.x, y: enemyPos.y});
        }

        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);

        t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
    }


    if (t < 0) {
        console.log("Negative time, shooting at current position");
        return gameManager.game.camera.pointToScreen({x: enemyPos.x, y: enemyPos.y});
    }

    // console.log(`A bullet with the enemy will collide through ${t}`)

    const predictedPos = {
        x: enemyPos.x + vex * t,
        y: enemyPos.y + vey * t,
    };

    return gameManager.game.camera.pointToScreen(predictedPos);
}

function calcAngle(playerPos, mePos) {
    const dx = mePos.x - playerPos.x;
    const dy = mePos.y - playerPos.y;

    return Math.atan2(dy, dx);
}

export default function aimbot() {
    if (aimbotDot == null) {
        aimbotDot = document.createElement("div");
        aimbotDot.classList.add("aimbotDot");
        ui.appendChild(aimbotDot);
    }
    gameManager.game.pixi._ticker.add(aimbotTicker);
}