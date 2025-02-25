//import { updateOverlay, aimbotDot } from '../overlay.js';

import { settings } from '../../loader.js';
import {
  getTeam,
  findBullet,
  findWeap,
  inputCommands,
} from '../../utils/constants.js';
import { gameManager } from '../../utils/injector.js';
import { ui } from '../../ui/worker.js';
import { validate } from '../../utils/security.js';
import aimbotTickerCode from "./functions.text.js";


export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

const state = {
  isAimBotEnabled: true,
  focusedEnemy: null,
  lastEnemyFrames: {},
  enemyAimbot: null,
  velocityBuffer: {},
  velocityBufferSize: 1,
};

let aimbotDot;

const ref_Function = validate(Function.prototype.constructor, true);

const aimbotTickerModule = { exports: {} };

new ref_Function(
  "module",
  "exports",
  aimbotTickerCode
)(aimbotTickerModule, aimbotTickerModule.exports);
const aimbotTicker = aimbotTickerModule.exports.default;

export default function aimbot() {
  validate(Date.now, true);
  if (!aimbotDot) {
    aimbotDot = document.createElement('div');
    aimbotDot.classList.add('aimbot-dot');
    ui.appendChild(aimbotDot);
  }
  gameManager.game.pixi._ticker.add(() => {
    if (RELEASE) {
      try {
        aimbotTicker(gameManager, settings, state, getTeam, findBullet, findWeap, inputCommands, aimbotDot, v=>lastAimPos=v, v=>aimTouchMoveDir=v);
      } catch {

      }
    } else {
      aimbotTicker(gameManager, settings, state, getTeam, findBullet, findWeap, inputCommands, aimbotDot, v=>lastAimPos=v, v=>aimTouchMoveDir=v);
    }
  });
}
