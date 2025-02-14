import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";
import {
  getTeam,
  findWeap,
  findBullet,
  objects,
  explosions,
  throwable,
} from "../utils/constants.js";
import { settings } from "../loader.js";

const GREEN = 0x399d37;
const BLUE = 0x3a88f4;
const RED = 0xdc3734;
const WHITE = 0xffffff;

let lastAimPos, PIXI_Graphics;

function initGraphics() {
  if (PIXI_Graphics) return;
  for (const child of gameManager.pixi.stage.children) {
    if (child.lineStyle) {
      PIXI_Graphics = child.constructor;
      break;
    }
  }
}

function createDrawer(container, key) {
  if (!container[key]) {
    container[key] = new PIXI_Graphics();
    container.addChild(container[key]);
  }
  return container[key];
}

function drawLines(me, players, lineDrawer) {
  const meX = me.pos.x,
    meY = me.pos.y,
    myTeam = getTeam(me);
  players.forEach((player) => {
    if (!player.active || player.netData.dead || me.__id === player.__id)
      return;
    const playerTeam = getTeam(player);
    const lineColor =
      playerTeam === myTeam
        ? 0x3a88f4
        : settings.friends.includes(player.nameText._text)
        ? GREEN
        : me.layer === player.layer &&
          (settings.aimAtKnockedEnabled || !player.downed)
        ? RED
        : WHITE;
    lineDrawer.lineStyle(2, lineColor, 0.45);
    lineDrawer.moveTo(0, 0);
    lineDrawer.lineTo((player.pos.x - meX) * 16, (meY - player.pos.y) * 16);
  });
}

function drawGrenades(me, grenadeDrawer) {
  const meX = me.pos.x,
    meY = me.pos.y;
  object
    .values(gameManager.game.objectCreator.idToObj)
    .filter(
      (obj) =>
        (obj.__type === 9 && obj.type !== "smoke") ||
        (obj.smokeEmitter && objects[obj.type].explosion)
    )
    .forEach((obj) => {
      grenadeDrawer.beginFill(
        obj.layer !== me.layer ? 0xffffff : 0xff0000,
        obj.layer !== me.layer ? 0.2 : 0.1
      );
      grenadeDrawer.drawCircle(
        (obj.pos.x - meX) * 16,
        (meY - obj.pos.y) * 16,
        (explosions[
          throwable[obj.type]?.explosionType || objects[obj.type].explosion
        ].rad.max +
          1) *
          16
      );
      grenadeDrawer.endFill();
    });
}

function drawLasers(me, players, laserDrawer) {
  const curWeapon = findWeap(me);
  const curBullet = findBullet(curWeapon);

  function laserPointer(
    acPlayer,
    curBullet,
    curWeapon,
    color = 0x0000ff,
    opacity = 0.1
  ) {
    if (!curBullet) return;
    const center = {
      x: (acPlayer.pos.x - me.pos.x) * 16,
      y: (me.pos.y - acPlayer.pos.y) * 16,
    };
    const atan =
      acPlayer === me && !lastAimPos
        ? Math.atan2(
            gameManager.game.input.mousePos.y - innerHeight / 2,
            gameManager.game.input.mousePos.x - innerWidth / 2
          )
        : Math.atan2(acPlayer.dir.x, acPlayer.dir.y) - Math.PI / 2;
    laserDrawer.beginFill(color, opacity);
    laserDrawer.moveTo(center.x, center.y);
    laserDrawer.arc(
      center.x,
      center.y,
      curBullet.distance * 16.25,
      atan - (curWeapon.shotSpread * 0.01745329252) / 2,
      atan + (curWeapon.shotSpread * 0.01745329252) / 2
    );
    laserDrawer.lineTo(center.x, center.y);
    laserDrawer.endFill();
  }
  laserPointer(me, curBullet, curWeapon);
  players
    .filter(
      (player) =>
        player.active &&
        !player.netData.dead &&
        me.__id !== player.__id &&
        me.layer === player.layer &&
        getTeam(player) !== getTeam(me)
    )
    .forEach((enemy) => {
      laserPointer(enemy, findBullet(findWeap(enemy)), findWeap(enemy), 0, 0.05);
    });
}

function esp_ticker() {
  const pixi = gameManager.game.pixi;
  const me = gameManager.game.activePlayer;
  const players = gameManager.game.playerBarn.playerPool.pool;
  if (!pixi || !me || me.container == undefined) return;

  initGraphics();

  try {
    const lineDrawer = createDrawer(me.container, "lineDrawer");
    lineDrawer.clear();
    if (settings.lineDrawerEnabled) drawLines(me, players, lineDrawer);

    const grenadeDrawer = createDrawer(me.container, "grenadeDrawer");
    grenadeDrawer.clear();
    if (settings.grenadeDrawerEnabled) drawGrenades(me, grenadeDrawer);

    const laserDrawer = createDrawer(me.container, "laserDrawer");
    laserDrawer.clear();
    if (settings.laserDrawerEnabled) drawLasers(me, players, laserDrawer);
  } catch {}
}

export function esp() {
  gameManager.game.pixi._ticker.add(esp_ticker);
}
