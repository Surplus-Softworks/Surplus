import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";

import { 
    inputCommands, 
    getTeam, 
    findWeap, 
    findBullet, 
    objects, 
    explosions, 
    throwable 
} from "../utils/constants.js";

import { settings } from "../loader.js";

const GREEN = 0x399d37;
const BLUE = 0x3a88f4;
const RED = 0xdc3734;
const WHITE = 0xffffff;

let lastAimPos;

function espTicker() {
    const pixi = gameManager.game.pixi;
    const me = gameManager.game.activePlayer;
    const players = gameManager.game.playerBarn.playerPool.pool;
    
    if (!pixi || me?.container == undefined) return;

    let Graphics;
    for (const child of gameManager.pixi.stage.children) {
      if (child.lineStyle) {
          Graphics = child.constructor;
          break;
      }
    } 

    const meX = me.pos.x;
    const meY = me.pos.y;
    const myTeam = getTeam(me);

    try {
        const lineDrawer = me.container.lineDrawer;
        try {
            lineDrawer.clear();
        } catch {
            if (!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return;
        }

        if (settings.lineDrawerEnabled) {
            if (!me.container.lineDrawer) {
                me.container.lineDrawer = new Graphics();
                me.container.addChild(me.container.lineDrawer);
            }

            players.forEach(player => {
                if (!player.active || player.netData.dead || me.__id == player.__id) return;

                const playerX = player.pos.x;
                const playerY = player.pos.y;
                const playerTeam = getTeam(player);
                const lineColor = playerTeam === myTeam
                    ? BLUE
                    : settings.friends.includes(player.nameText._text)
                        ? GREEN
                        : me.layer === player.layer && (settings.aimAtKnockedEnabled || !player.downed)
                            ? RED
                            : WHITE;

                lineDrawer.lineStyle(2, lineColor, 1);
                lineDrawer.moveTo(0, 0);
                lineDrawer.lineTo((playerX - meX) * 16, (meY - playerY) * 16);
            });
        }

        const grenadeDrawer = me.container.grenadeDrawer;
        try {
            grenadeDrawer?.clear();
        } catch {
            if (!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return;
        }

        if (settings.grenadeDrawerEnabled) {
            if (!me.container.grenadeDrawer) {
                me.container.grenadeDrawer = new Graphics();
                me.container.addChild(me.container.grenadeDrawer);
            }

            object.values(gameManager.game.objectCreator.idToObj)
                .filter(obj => (obj.__type === 9 && obj.type !== "smoke") || (obj.smokeEmitter && objects[obj.type].explosion))
                .forEach(obj => {
                    grenadeDrawer.beginFill(obj.layer !== me.layer ? 0xffffff : 0xff0000, obj.layer !== me.layer ? 0.3 : 0.2);
                    grenadeDrawer.drawCircle(
                        (obj.pos.x - meX) * 16,
                        (meY - obj.pos.y) * 16,
                        (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
                    );
                    grenadeDrawer.endFill();
                });
        }

        const laserDrawer = me.container.laserDrawer;
        try {
            laserDrawer.clear();
        } catch {
            if (!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return;
        }

        if (settings.laserDrawerEnabled) {
            const curWeapon = findWeap(me);
            const curBullet = findBullet(curWeapon);

            if (!me.container.laserDrawer) {
                me.container.laserDrawer = new Graphics();
                me.container.addChildAt(me.container.laserDrawer, 0);
            }

            function laserPointer(curBullet, curWeapon, acPlayer, color = 0x0000ff, opacity = 0.1) {
                const { pos: acPlayerPos } = acPlayer;
                const dateNow = performance.now();

                if (!(acPlayer.__id in settings.lastFrames)) settings.lastFrames[acPlayer.__id] = [];
                settings.lastFrames[acPlayer.__id].push([dateNow, { ...acPlayerPos }]);
                if (settings.lastFrames[acPlayer.__id].length > 30) settings.lastFrames[acPlayer.__id].shift();
                if (settings.lastFrames[acPlayer.__id].length < 30) return;

                let atan;
                if (acPlayer === me && !lastAimPos) {
                    atan = Math.atan2(
                        gameManager.game.input.mousePos.y - innerHeight / 2,
                        gameManager.game.input.mousePos.x - innerWidth / 2
                    );
                } else {
                    atan = Math.atan2(acPlayer.dir.x, acPlayer.dir.y) - Math.PI / 2;
                }

                const lasic = {
                    active: !!curBullet,
                    range: curBullet ? curBullet.distance * 16.25 : 0,
                    direction: atan,
                    angle: curBullet ? ((curWeapon.shotSpread) * 0.01745329252) / 2 : 0
                };

                if (!lasic.active) return;

                const center = {
                    x: (acPlayerPos.x - me.pos.x) * 16,
                    y: (me.pos.y - acPlayerPos.y) * 16
                };
                laserDrawer.beginFill(color, opacity);
                laserDrawer.moveTo(center.x, center.y);
                laserDrawer.arc(center.x, center.y, lasic.range, lasic.direction - lasic.angle, lasic.direction + lasic.angle);
                laserDrawer.lineTo(center.x, center.y);
                laserDrawer.endFill();
            }

            laserPointer(curBullet, curWeapon, me);

            players.filter(player => player.active && !player.netData.dead && me.__id !== player.__id && me.layer === player.layer && getTeam(player) !== myTeam)
                .forEach(enemy => {
                    laserPointer(findBullet(findWeap(enemy)), findWeap(enemy), enemy, "0", 0.2);
                });
        }
    } catch {}
}

export function esp() {
    gameManager.game.pixi._ticker.add(espTicker);
}
