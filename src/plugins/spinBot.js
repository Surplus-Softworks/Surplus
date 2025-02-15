import { settings } from "../loader.js";
import { gameManager } from "../utils/injector.js";

let previous;

function spinBot_ticker() {
  if (settings.spinBot) {
    gameManager.game.activePlayer.bodyContainer.rotation = Math.random(), Math.random()
  } else {
    if (!gameManager.game.spectating) {
      gameManager.game.activePlayer.bodyContainer.rotation = Math.atan2(
        gameManager.game.input.mousePos.y - window.innerHeight / 2,
        gameManager.game.input.mousePos.x - window.innerWidth / 2
      );
    } else {
      gameManager.game.activePlayer.bodyContainer.rotation = -Math.atan2(gameManager.game.activePlayer.dir.y, gameManager.game.activePlayer.dir.x);
    }
  }
}

export default function spinBot() {
  gameManager.game.pixi._ticker.add(spinBot_ticker);

  window.addEventListener("mousedown", () => {
    previous = settings.spinBot;
    settings.spinBot = false;
  });
  window.addEventListener("mouseup", () => {
    settings.spinBot = previous;
  });
}
