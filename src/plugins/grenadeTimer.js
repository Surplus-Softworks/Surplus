import { gameManager } from "../utils/injector.js";
import { obfuscatedNameTranslator } from '../utils/obfuscatedNameTranslator.js';


let lastTime = Date.now();
let showing = false;
let timer = null;

function grenadeTimerTicker() {
  if (
    !(
      gameManager.game?.ws &&
      gameManager.game?.activePlayer?.localData?.curWeapIdx != null &&
      gameManager.game?.activePlayer?.netData?.activeWeapon != null &&
      gameManager.game?.initialized
    )
  )
    return;

  try {
    let elapsed = (Date.now() - lastTime) / 1000;
    const player = obfuscatedNameTranslator.activePlayer;
    const activeItem = player.netData.activeWeapon;

    if (
      3 !== obfuscatedNameTranslator.activePlayer.localData.curWeapIdx ||
      player.throwableState !== "cook" ||
      (!activeItem.includes("frag") &&
        !activeItem.includes("mirv") &&
        !activeItem.includes("martyr_nade"))
    )
      return (showing = false), timer && timer.destroy(), (timer = false);

    const time = 4;
    if (elapsed > time) {
      showing = false;
    }
    if (!showing) {
      if (timer) {
        timer.destroy();
      }
      timer = new gameManager.game.uiManager.pieTimer.constructor();
      gameManager.pixi.stage.addChild(timer.container);
      timer.start("Grenade", 0, time);
      showing = true;
      lastTime = Date.now();
      return;
    }
    timer.update(elapsed - timer.elapsed, gameManager.game.camera);
  } catch {}
}

export default function grenadeTimer() {
  gameManager.pixi._ticker.add(grenadeTimerTicker);
}
