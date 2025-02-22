import { gameManager } from "../utils/injector.js";
import { tickers } from '../utils/ticker.js';

let lastTime = Date.now();
let showing = false;
let timer = null;

function grenadeTimerTicker() {
  if (
    !(
      gameManager.game?.ws &&
      gameManager.game?.activePlayer?.localData?.curWeapIdx != null &&
      gameManager.game?.activePlayer?.netData?.activeWeapon != null
    )
  )
    return;

  try {
    let elapsed = (Date.now() - lastTime) / 1000;
    const player = gameManager.game.activePlayer;
    const activeItem = player.netData.activeWeapon;

    if (
      3 !== gameManager.game.activePlayer.localData.curWeapIdx ||
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
      gameManager.game.pixi.stage.addChild(timer.container);
      timer.start("Grenade", 0, time);
      showing = true;
      lastTime = Date.now();
      return;
    }
    timer.update(elapsed - timer.elapsed, gameManager.game.camera);
  } catch {}
}

export default function grenadeTimer() {
  gameManager.game.pixi._ticker.add(grenadeTimerTicker);
  tickers.push(grenadeTimerTicker)
}
