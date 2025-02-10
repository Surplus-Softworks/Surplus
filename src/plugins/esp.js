import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";
import * as PIXI from "pixi.js"

const GREEN = 0x00ff00;
const BLUE = 0x00f3f3;
const RED = 0xff0000;
const WHITE = 0xffffff;

import { inputCommands, getTeam, findWeap, findBullet, objects, explosions, throwable } from "../utils/constants.js";

import { state } from "../loader.js";

const log = console.log;

function espTicker() {
    const pixi = gameManager.game.pixi;
    const me = gameManager.game.activePlayer;
    const players = gameManager.game.playerBarn.playerPool.pool;

    // We check if there is an object of Pixi, otherwise we create a new
    if (!pixi || me?.container == undefined) {
        // console.error("PIXI object not found in game.");
        return;
    }

    const meX = me.pos.x;
    const meY = me.pos.y;

    const meTeam = getTeam(me);

    try {

        // lineDrawer
        const lineDrawer = me.container.lineDrawer;
        try { lineDrawer.clear() }
        catch { if (!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return; }
        if (state.lineDrawerEnabled) {

            if (!me.container.lineDrawer) {
                me.container.lineDrawer = new PIXI.Graphics();
                me.container.addChild(me.container.lineDrawer);
            }

            // For each player
            players.forEach((player) => {
                // We miss inactive or dead players
                if (!player.active || player.netData.dead || me.__id == player.__id) return;

                const playerX = player.pos.x;
                const playerY = player.pos.y;

                const playerTeam = getTeam(player);

                // We calculate the color of the line (for example, red for enemies)
                const lineColor = playerTeam === meTeam ? BLUE : state.friends.includes(player.nameText._text) ? GREEN : me.layer === player.layer && (state.aimAtKnockedEnabled || !player.downed) ? RED : WHITE;

                // We draw a line from the current player to another player
                lineDrawer.lineStyle(2, lineColor, 1);
                lineDrawer.moveTo(0, 0); // Container Container Center
                lineDrawer.lineTo(
                    (playerX - meX) * 16,
                    (meY - playerY) * 16
                );
            });
        }

        // grenadeDrawer
        const grenadeDrawer = me.container.grenadeDrawer;
        try { grenadeDrawer?.clear() }
        catch { if (!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return; }
        if (state.grenadeDrawerEnabled) {
            if (!me.container.grenadeDrawer) {
                me.container.grenadeDrawer = new PIXI.Graphics();
                me.container.addChild(me.container.grenadeDrawer);
            }

            object.values(gameManager.game.objectCreator.idToObj)
                .filter(obj => {
                    const isValid = (obj.__type === 9 && obj.type !== "smoke")
                        || (
                            obj.smokeEmitter &&
                            objects[obj.type].explosion);
                    return isValid;
                })
                .forEach(obj => {
                    if (obj.layer !== me.layer) {
                        grenadeDrawer.beginFill(0xffffff, 0.3);
                    } else {
                        grenadeDrawer.beginFill(0xff0000, 0.2);
                    }
                    grenadeDrawer.drawCircle(
                        (obj.pos.x - meX) * 16,
                        (meY - obj.pos.y) * 16,
                        (explosions[
                            throwable[obj.type]?.explosionType ||
                            objects[obj.type].explosion
                        ].rad.max +
                            1) *
                        16
                    );
                    grenadeDrawer.endFill();
                });
        }

        // flashlightDrawer(laserDrawer)
        const laserDrawer = me.container.laserDrawer;
        try { laserDrawer.clear() }
        catch { if (!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return; }
        if (state.laserDrawerEnabled) {
            const curWeapon = findWeap(me);
            const curBullet = findBullet(curWeapon);

            if (!me.container.laserDrawer) {
                me.container.laserDrawer = new PIXI.Graphics();
                me.container.addChildAt(me.container.laserDrawer, 0);
            }

            function laserPointer(
                curBullet,
                curWeapon,
                acPlayer,
                color = 0x0000ff,
                opacity = 0.3,
            ) {
                const { pos: acPlayerPos, posOld: acPlayerPosOld } = acPlayer;

                const dateNow = performance.now();

                if (!(acPlayer.__id in state.lastFrames)) state.lastFrames[acPlayer.__id] = [];
                state.lastFrames[acPlayer.__id].push([dateNow, { ...acPlayerPos }]);

                if (state.lastFrames[acPlayer.__id].length < 30) return;

                if (state.lastFrames[acPlayer.__id].length > 30) {
                    state.lastFrames[acPlayer.__id].shift();
                }

                const deltaTime = (dateNow - state.lastFrames[acPlayer.__id][0][0]) / 1000; // Time since last frame in seconds

                const acPlayerVelocity = {
                    x: (acPlayerPos._x - state.lastFrames[acPlayer.__id][0][1]._x) / deltaTime,
                    y: (acPlayerPos._y - state.lastFrames[acPlayer.__id][0][1]._y) / deltaTime,
                };

                let lasic = {};

                let isMoving = !!(acPlayerVelocity.x || acPlayerVelocity.y);

                if (curBullet) {
                    lasic.active = true;
                    lasic.range = curBullet.distance * 16.25;
                    let atan;
                    if (acPlayer == me && (!(gameManager.lastAimPos) || (gameManager.lastAimPos) && !(gameManager.game.touch.shotDetected || gameManager.game.inputBinds.isBindDown(inputCommands.Fire)))) {
                        //local rotation
                        atan = Math.atan2(
                            gameManager.game.input.mousePos._y - gameManager.innerHeight / 2,
                            gameManager.game.input.mousePos._x - gameManager.innerWidth / 2,
                        );
                    } else if (acPlayer == me && (gameManager.lastAimPos) && (gameManager.game.touch.shotDetected || gameManager.game.inputBinds.isBindDown(inputCommands.Fire))) {
                        const playerPointToScreen = gameManager.game.camera.pointToScreen({ x: acPlayer.pos._x, y: acPlayer.pos._y })
                        atan = Math.atan2(
                            playerPointToScreen.y - gameManager.lastAimPos.clientY,
                            playerPointToScreen.x - gameManager.lastAimPos.clientX
                        )
                            -
                            Math.PI;
                    } else {
                        atan = Math.atan2(
                            acPlayer.dir.x,
                            acPlayer.dir.y
                        )
                            -
                            Math.PI / 2;
                    }
                    lasic.direction = atan;
                    lasic.angle =
                        ((curWeapon.shotSpread +
                            (isMoving ? curWeapon.moveSpread : 0)) *
                            0.01745329252) /
                        2;
                } else {
                    lasic.active = false;
                }

                if (!lasic.active) {
                    return;
                }

                const center = {
                    x: (acPlayerPos._x - me.pos._x) * 16,
                    y: (me.pos._y - acPlayerPos._y) * 16,
                };
                const radius = lasic.range;
                let angleFrom = lasic.direction - lasic.angle;
                let angleTo = lasic.direction + lasic.angle;
                angleFrom =
                    angleFrom > Math.PI * 2
                        ? angleFrom - Math.PI * 2
                        : angleFrom < 0
                            ? angleFrom + Math.PI * 2
                            : angleFrom;
                angleTo =
                    angleTo > Math.PI * 2
                        ? angleTo - Math.PI * 2
                        : angleTo < 0
                            ? angleTo + Math.PI * 2
                            : angleTo;
                laserDrawer.beginFill(color, opacity);
                laserDrawer.moveTo(center.x, center.y);
                laserDrawer.arc(center.x, center.y, radius, angleFrom, angleTo);
                laserDrawer.lineTo(center.x, center.y);
                laserDrawer.endFill();
            }


            laserPointer(
                curBullet,
                curWeapon,
                me,
            );

            players
                .filter(player => player.active && !player.netData.dead && me.__id !== player.__id && me.layer === player.layer && getTeam(player) != meTeam)
                .forEach(enemy => {
                    const enemyWeapon = findWeap(enemy);
                    laserPointer(
                        findBullet(enemyWeapon),
                        enemyWeapon,
                        enemy,
                        "0",
                        0.2,
                    )
                });
        };

    } catch {

    }
}

export function esp() {
    gameManager.game.pixi._ticker.add(espTicker);
}