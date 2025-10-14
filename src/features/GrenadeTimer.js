import { gameManager } from '@/core/state.js';
import { translations } from '@/core/obfuscatedNameTranslator.js';

const GRENADE_TYPES = ['frag', 'mirv', 'martyr_nade'];
const MAX_TIMER_DURATION = 4;

let lastTimestamp = Date.now();
let timerActive = false;
let timerUI = null;

const isGameInitialized = () => {
  const game = gameManager.game;
  if (!game?.initialized) return false;
  const player = game[translations.activePlayer_];
  return (
    player?.[translations.localData_]?.[translations.curWeapIdx_] != null &&
    player?.[translations.netData_]?.[translations.activeWeapon_] != null
  );
};

const isHoldingGrenade = () => {
  const game = gameManager.game;
  return game[translations.activePlayer_][translations.localData_][translations.curWeapIdx_] === 3;
};

const isCookingGrenade = (player) => player.throwableState === 'cook';

const isGrenadeExplosive = (weapon) => GRENADE_TYPES.some((type) => weapon.includes(type));

const resetTimer = () => {
  timerActive = false;
  if (timerUI) {
    timerUI.destroy();
    timerUI = null;
  }
};

const createNewTimer = () => {
  resetTimer();
  const PieTimer = gameManager.game[translations.uiManager_][translations.pieTimer_].constructor;
  timerUI = new PieTimer();
  gameManager.pixi.stage.addChild(timerUI.container);
  timerUI.start('Grenade', 0, MAX_TIMER_DURATION);
  timerActive = true;
  lastTimestamp = Date.now();
};

const updateGrenadeTimer = () => {
  if (!isGameInitialized()) return;

  if (!isHoldingGrenade()) {
    resetTimer();
    return;
  }

  try {
    const game = gameManager.game;
    const player = game[translations.activePlayer_];
    const activeWeapon = player[translations.netData_][translations.activeWeapon_];
    const secondsElapsed = (Date.now() - lastTimestamp) / 1000;

    if (!isCookingGrenade(player) || !isGrenadeExplosive(activeWeapon)) {
      resetTimer();
      return;
    }

    if (secondsElapsed > MAX_TIMER_DURATION) timerActive = false;

    if (!timerActive) {
      createNewTimer();
      return;
    }

    timerUI.update(secondsElapsed - timerUI.elapsed, game[translations.camera_]);
  } catch { }
};

export default function () {
  gameManager.pixi._ticker.add(updateGrenadeTimer);
}
