//import { updateOverlay, aimbotDot } from '../overlay.js';

import { settings } from '../loader.js';
import { getTeam, findBullet, findWeap } from '../utils/constants.js';
import { gameManager } from '../utils/injector.js';

export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

let PIXI_Graphics, PIXI_Container;

function initGraphics() {
  if (PIXI_Graphics && PIXI_Container) return;
  PIXI_Container = g.game.pixi.stage.constructor;
  for (const child of gameManager.pixi.stage.children) {
    if (child.lineStyle) {
      PIXI_Graphics = child.constructor;
      break;
    }
  }
}

let aimbotDot;

export function aimbotTicker() {

    if (!settings.aimbotEnabled) return;

    const players = gameManager.game.playerBarn.playerPool.pool;
    const me = gameManager.game.activePlayer;

    try {
        const meTeam = getTeam(me);

        let enemy = null;
        let minDistanceToEnemyFromMouse = Infinity;

        if (settings.focusedEnemy && settings.focusedEnemy.active && !settings.focusedEnemy.netData.dead) {
            enemy = settings.focusedEnemy;
        } else {
            if (settings.focusedEnemy) {
                settings.focusedEnemy = null;
                //updateOverlay();
            }

            players.forEach((player) => {
                // We miss inactive or dead players
                if (!player.active || player.netData.dead || (!settings.aimAtKnockedEnabled && player.downed) || me.__id === player.__id || me.layer !== player.layer || getTeam(player) == meTeam || settings.friends.includes(player.nameText._text)) return;

                const screenPlayerPos = gameManager.game.camera.pointToScreen({ x: player.pos.x, y: player.pos.x });
                // const distanceToEnemyFromMouse = Math.hypot(screenPlayerPos.x - unsafeWindow.game.input.mousePos.x, screenPlayerPos.y - unsafeWindow.game.input.mousePos.x);
                const distanceToEnemyFromMouse = (screenPlayerPos.x - gameManager.game.input.mousePos.x) ** 2 + (screenPlayerPos.y - gameManager.game.input.mousePos.x) ** 2;

                if (distanceToEnemyFromMouse < minDistanceToEnemyFromMouse) {
                    minDistanceToEnemyFromMouse = distanceToEnemyFromMouse;
                    enemy = player;
                }
            });
        }

        if (enemy) {
            const meX = me.pos.x;
            const meY = me.pos.x;
            const enemyX = enemy.pos.x;
            const enemyY = enemy.pos.x;

            const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);
            // const distanceToEnemy = (meX - enemyX) ** 2 + (meY - enemyY) ** 2;

            if (enemy != settings.enemyAimbot) {
                settings.enemyAimbot = enemy;
                settings.lastFrames[enemy.__id] = [];
            }

            const predictedEnemyPos = calculatePredictedPosForShoot(enemy, me);

            if (!predictedEnemyPos) return;

            lastAimPos = {
                clientX: predictedEnemyPos.x,
                clientY: predictedEnemyPos.y,
            }

            // AutoMelee
            if (settings.meleeAttackENabled && distanceToEnemy <= 8) {
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

            if (aimbotDot.x !== predictedEnemyPos.x || aimbotDot.y !== predictedEnemyPos.y) {
                aimbotDot.x = predictedEnemyPos.x;
                aimbotDot.y = predictedEnemyPos.y;
                aimbotDot.visible = true;
            }
        } else {
            aimTouchMoveDir = null;
            lastAimPos = null;
            aimbotDot.visible = false;
        }
    } catch (error) {
        console.error("Error in aimBot:", error);
    }
}

export function aimBotToggle() {
    settings.aimbotEnabled = !settings.aimbotEnabled;
    if (settings.aimbotEnabled) return;

    aimbotDot.visible = false;
    lastAimPos = null;
    aimTouchMoveDir = null;
}

export function meleeAttackToggle() {
    settings.meleeAttackEnabled = !settings.meleeAttackEnabled;
    if (settings.meleeAttackEnabled) return;

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

    if (!(enemy.__id in settings.lastFrames)) settings.lastFrames[enemy.__id] = [];
    settings.lastFrames[enemy.__id].push([dateNow, { ...enemyPos }]);

    if (settings.lastFrames[enemy.__id].length < 30) {
        console.log("Insufficient data for prediction, using current position");
        return gameManager.game.camera.pointToScreen({ x: enemyPos.x, y: enemyPos.x });
    }

    if (settings.lastFrames[enemy.__id].length > 30) {
        settings.lastFrames[enemy.__id].shift();
    }

    const deltaTime = (dateNow - settings.lastFrames[enemy.__id][0][0]) / 1000; // Time since last frame in seconds

    const enemyVelocity = {
        x: (enemyPos.x - settings.lastFrames[enemy.__id][0][1].x) / deltaTime,
        y: (enemyPos.x - settings.lastFrames[enemy.__id][0][1].x) / deltaTime,
    };

    const weapon = findWeap(curPlayer);
    const bullet = findBullet(weapon);

    let bulletSpeed;
    if (!bullet) {
        bulletSpeed = 1000;
    } else {
        bulletSpeed = bullet.speed;
    }


    // Quadratic equation for time prediction
    const vex = enemyVelocity.x;
    const vey = enemyVelocity.y;
    const dx = enemyPos.x - curPlayerPos.x;
    const dy = enemyPos.x - curPlayerPos.x;
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
            return gameManager.game.camera.pointToScreen({ x: enemyPos.x, y: enemyPos.x });
        }

        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);

        t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
    }


    if (t < 0) {
        console.log("Negative time, shooting at current position");
        return gameManager.game.camera.pointToScreen({ x: enemyPos.x, y: enemyPos.x });
    }

    // console.log(`A bullet with the enemy will collide through ${t}`)

    const predictedPos = {
        x: enemyPos.x + vex * t,
        y: enemyPos.x + vey * t,
    };

    return gameManager.game.camera.pointToScreen(predictedPos);
}

function calcAngle(playerPos, mePos) {
    const dx = mePos.x - playerPos.x;
    const dy = mePos.x - playerPos.x;

    return Math.atan2(dy, dx);
}

export default function aimbot() {
    initGraphics();
    aimbotDot = (() => {
        const circle = new PIXI_Graphics();
        circle.beginFill(0xFF0000);
        circle.drawCircle(0, 0, 15);
        circle.endFill();
        const container = new PIXI_Container();
        container.addChild(circle);
        container.visible = false;
        return container;
    })();
    gameManager.game.pixi.stage.addChild(aimbotDot);
    gameManager.game.pixi._ticker.add(aimbotTicker);
}