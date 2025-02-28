import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";
import { lastAimPos } from "./aimbot.js";
import {
  getTeam,
  findWeap,
  findBullet,
  objects,
  explosions,
  throwable,
  inputCommands,
  PIXI,
} from "../utils/constants.js";
import { settings } from "../loader.js";
import espTickerCode from "./espFuncs.text.js";

const GREEN = 0x399d37;
const BLUE = 0x3a88f4;
const RED = 0xdc3734;
const WHITE = 0xffffff;

const ref_Function = Function.prototype.constructor;

const espTickerModule = { exports: {} };

new ref_Function(
  "module",
  "exports",
  espTickerCode
)(espTickerModule, espTickerModule.exports);
const espTicker = espTickerModule.exports.default;

export default function esp() {
  const tickerCallback = () => {
    espTicker(
      gameManager,
      settings,
      PIXI,
      getTeam,
      BLUE,
      RED,
      WHITE,
      object,
      objects,
      explosions,
      throwable,
      findWeap,
      findBullet,
      inputCommands,
      lastAimPos,
      innerHeight,
      innerWidth
    );
  };
  gameManager.game.pixi._ticker.add(tickerCallback);
}