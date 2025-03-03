import { gameManager } from "../utils/injector.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';


let lastTime = Date.now();
let showing = false;
let timer = null;

function grenadeTimerTicker() {
  if (
    !(
      gameManager.game?.[tr.activePlayer]?.[tr.localData]?.[tr.curWeapIdx] != null &&
      gameManager.game?.[tr.activePlayer]?.[tr.netData]?.[tr.activeWeapon] != null &&
      gameManager.game?.initialized
    )
  )
    return;

  try {
    let elapsed = (Date.now() - lastTime) / 1000;
    const player = gameManager.game[tr.activePlayer];
    const activeItem = gameManager.game[tr.activePlayer][tr.netData][tr.activeWeapon];

    if (
      3 !== gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx] ||
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
      timer = new gameManager.game[tr.uiManager][tr.pieTimer].constructor;
      gameManager.pixi.stage.addChild(timer.container);
      timer.start("Grenade", 0, time);
      showing = true;
      lastTime = Date.now();
      return;
    }
    timer.update(elapsed - timer.elapsed, gameManager.game[tr.camera]);
  } catch {}
}

export default function grenadeTimer() {
  gameManager.pixi._ticker.add(grenadeTimerTicker);
}
