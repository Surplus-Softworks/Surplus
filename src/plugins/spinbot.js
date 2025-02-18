import { settings } from "../loader.js";
import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";
import { lastAimPos } from "./aimbot.js";

export let spinbotEnabled;

let currentAngle = 0;
let angularVelocity = 0;
const angularAccelerationMax = 0.006; 
const dampingFactor = 0.98;

function spinbotTicker() {
  if (!gameManager.game.activePlayer || !gameManager.game.activePlayer.bodyContainer) return;
  if (!spinbotEnabled) {
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

export default function spinbot() {
  spinbotEnabled = settings.spinbot.enabled; // copied primitive

  gameManager.game.pixi._ticker.add(spinbotTicker);

  object.defineProperty(gameManager.game.input.mousePos, 'y', {
    get() {
      if (lastAimPos && !spinbotEnabled) {
        return lastAimPos.clientY
      }
      if (spinbotEnabled && !(gameManager.game.activePlayer.throwableState === "cook")) {
        if (settings.spinbot.realistic) {
          angularVelocity += (Math.random() * 2 - 1) * angularAccelerationMax;
          angularVelocity *= dampingFactor;
          currentAngle += angularVelocity;

          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const radius = Math.min(centerX, centerY) * 0.8;

          return centerY + Math.sin(currentAngle) * radius;
        } else {
          return Math.random() * window.innerHeight;
        }
      }
      return this._y;
    },
    set(value) {
      this._y = value;
    }
  });

  object.defineProperty(gameManager.game.input.mousePos, 'x', {
    get() {
      if (lastAimPos && !spinbotEnabled) {
        return lastAimPos.clientX
      }
      if (spinbotEnabled && !(gameManager.game.activePlayer.throwableState === "cook")) {
        if (settings.spinbot.realistic) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const radius = Math.min(centerX, centerY) * 0.8; 

          return centerX + Math.cos(currentAngle) * radius;
        } else {
          return Math.random() * window.innerWidth;
        }
      }
      return this._x;
    },
    set(value) {
      this._x = value;
    }
  });

  window.addEventListener("mousedown", () => {
    spinbotEnabled = false;
  });
  window.addEventListener("mouseup", () => {
    spinbotEnabled = settings.spinbot.enabled;
  });
}