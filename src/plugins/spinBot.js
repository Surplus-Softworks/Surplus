import { settings } from "../loader.js";
import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";

let previous;

function spinBot_ticker() {
  if (!gameManager.game.activePlayer || !gameManager.game.activePlayer.bodyContainer) return;
  if (!settings.spinBot) {
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

  object.defineProperty(gameManager.game.input.mousePos, 'y', {
    get() {
        if (settings.spinBot) {
            return Math.random() * window.innerHeight;
        }
        return this._y;
    },
    set(value) {
        this._y = value;
    }
  });

  object.defineProperty(gameManager.game.input.mousePos, 'x', {
    get() {
        if (settings.spinBot) {
            return Math.random() * window.innerWidth;
        }
        return this._x;
    },
    set(value) {
        this._x = value;
    }
  });

  window.addEventListener("mousedown", () => {
    previous = settings.spinBot;
    settings.spinBot = false;
  });
  window.addEventListener("mouseup", () => {
    settings.spinBot = previous;
  });
}
