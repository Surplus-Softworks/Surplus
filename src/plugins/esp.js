import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";
import { lastAimPos } from "./aimbot.js";
import { translator } from '../utils/obfuscatedNameTranslator.js';

import {
  findTeam,
  findWeapon,
  findBullet,
  objects,
  explosions,
  throwable,
  inputCommands,
  PIXI,
} from "../utils/constants.js";
import { settings } from "../loader.js";


const GREEN = 0x399d37;
const BLUE = 0x3a88f4;
const RED = 0xdc3734;
const WHITE = 0xffffff;

function createDrawer(container, key) {
  if (!container[key]) {
      container[key] = new PIXI.Graphics();
      container.addChild(container[key]);
  }
  return container[key];
}

function drawLines(me, players, lineDrawer) {
  const meX = me.pos.x, meY = me.pos.y, myTeam = findTeam(me);
  players.forEach(player => {
      if (!player.active || player.netData.dead || me.__id === player.__id) return;
      const playerTeam = findTeam(player);
      const lineColor = playerTeam === myTeam ? BLUE : me.layer === player.layer && !player.downed ? RED : WHITE;
      lineDrawer.lineStyle(2, lineColor, 0.45);
      lineDrawer.moveTo(0, 0);
      lineDrawer.lineTo((player.pos.x - meX) * 16, (meY - player.pos.y) * 16);
  });
}

function drawGrenades(me, grenadeDrawer) {
  const meX = me.pos.x, meY = me.pos.y;
  object.values(gameManager.game.objectCreator.idToObj)
      .filter(obj => (obj.__type === 9 && obj.type !== "smoke") || (obj.smokeEmitter && objects[obj.type].explosion))
      .forEach(obj => {
          grenadeDrawer.beginFill(obj.layer !== me.layer ? 0xffffff : 0xff0000, obj.layer !== me.layer ? 0.2 : 0.1);
          grenadeDrawer.drawCircle(
              (obj.pos.x - meX) * 16,
              (meY - obj.pos.y) * 16,
              (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
          );
          grenadeDrawer.endFill();

          grenadeDrawer.lineStyle(2, 0x000000, 0.2); 
          grenadeDrawer.drawCircle(
              (obj.pos.x - meX) * 16,
              (meY - obj.pos.y) * 16,
              (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
          );
      });
}

function drawLasers(me, players, laserDrawer) {
  const curWeapon = findWeapon(me);
  const curBullet = findBullet(curWeapon);

  function laserPointer(acPlayer, curBullet, curWeapon, color = 0x0000ff, opacity = 0.1) {
      if (!curBullet) return;
      const center = { x: (acPlayer.pos.x - me.pos.x) * 16, y: (me.pos.y - acPlayer.pos.y) * 16 };
      let atan;
      if (acPlayer === me && (!lastAimPos || (lastAimPos && !(gameManager.game.touch.shotDetected || translator.inputBinds.isBindDown(inputCommands.Fire))))) {
          atan = Math.atan2(
              translator.input.mousePos._y - innerHeight / 2,
              translator.input.mousePos._x - innerWidth / 2
          );
      } else if (acPlayer === me && lastAimPos) {
          const playerPointToScreen = gameManager.game.camera.pointToScreen({ x: acPlayer.pos.x, y: acPlayer.pos.y });
          atan = Math.atan2(
              playerPointToScreen.y - lastAimPos.clientY,
              playerPointToScreen.x - lastAimPos.clientX
          ) - Math.PI;
      } else {
          atan = Math.atan2(acPlayer.dir.x, acPlayer.dir.y) - Math.PI / 2;
      }
      laserDrawer.beginFill(color, opacity);
      laserDrawer.moveTo(center.x, center.y);
      laserDrawer.arc(center.x, center.y, curBullet.distance * 16.25, atan - (curWeapon.shotSpread * 0.01745329252) / 2, atan + (curWeapon.shotSpread * 0.01745329252) / 2);
      laserDrawer.lineTo(center.x, center.y);
      laserDrawer.endFill();
  }
  if (settings.esp.flashlights.own) laserPointer(me, curBullet, curWeapon);
  players.filter(player =>
      player.active && !player.netData.dead && me.__id !== player.__id && me.layer === player.layer && findTeam(player) !== findTeam(me)
  ).forEach(enemy => {
      if (settings.esp.flashlights.others) laserPointer(enemy, findBullet(findWeapon(enemy)), findWeapon(enemy), 0, 0.05);
  });
}

function espTicker() {
  const pixi = gameManager.pixi;
  const me = translator.activePlayer;
  const players = translator.playerPoolPool;
  if (!pixi || !me || me.container == undefined || !settings.esp.enabled || !(gameManager.game?.initialized)) return;
  try {
      const lineDrawer = createDrawer(me.container, 'lineDrawer');
      lineDrawer.clear();
      if (settings.esp.players) drawLines(me, players, lineDrawer);

      const grenadeDrawer = createDrawer(me.container, 'grenadeDrawer');
      grenadeDrawer.clear();
      if (settings.esp.grenades) drawGrenades(me, grenadeDrawer);

      const laserDrawer = createDrawer(me.container, 'laserDrawer');
      laserDrawer.clear();
      if (settings.esp.flashlights.others || settings.esp.flashlights.own) drawLasers(me, players, laserDrawer);
  } catch (e) { }
}

export default function esp() {
  gameManager.pixi._ticker.add(espTicker);
}