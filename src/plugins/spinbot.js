import { settings } from "../loader.js";
import { gameManager } from "../utils/injector.js";
import { object } from "../utils/hook.js";
import { lastAimPos } from "./aimbot.js";
import { validate } from "../utils/security.js";
import { reflect } from "../utils/hook.js";
import { ref_addEventListener } from "../utils/hook.js";

let currentAngle = 0;
let angularVelocity = 0;
const angularAccelerationMax = 0.012;
const dampingFactor = 0.98;
let isMouseDown = false;

function updateRotation() {
  if (
    !gameManager.game.activePlayer ||
    !gameManager.game.activePlayer.bodyContainer
  )
    return;

  if (isMouseDown) {
    if (!gameManager.game.spectating) {
      if (lastAimPos) {
        gameManager.game.activePlayer.bodyContainer.rotation = Math.atan2(
          lastAimPos.clientY - globalThis.innerHeight / 2,
          lastAimPos.clientX - globalThis.innerWidth / 2
        );
      } else {
        gameManager.game.activePlayer.bodyContainer.rotation = Math.atan2(
          gameManager.game.input.mousePos.y - globalThis.innerHeight / 2,
          gameManager.game.input.mousePos.x - globalThis.innerWidth / 2
        );
      }
    } else {
      gameManager.game.activePlayer.bodyContainer.rotation = -Math.atan2(
        gameManager.game.activePlayer.dir.y,
        gameManager.game.activePlayer.dir.x
      );
    }
  } else {
    gameManager.game.activePlayer.bodyContainer.rotation = Math.atan2(
      gameManager.game.input.mousePos.y - globalThis.innerHeight / 2,
      gameManager.game.input.mousePos.x - globalThis.innerWidth / 2
    );
  }
}

function spinbotTicker() {
  updateRotation();
}

function calculateSpinbotMousePosition(axis) {
  if (gameManager.game.activePlayer.throwableState === "cook") {
    return axis === "x" ? gameManager.game.input.mousePos._x : gameManager.game.input.mousePos._y;
  }

  if (settings.spinbot.realistic) {
    const centerX = globalThis.innerWidth / 2;
    const centerY = globalThis.innerHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    if (axis === "x") {
      return centerX + Math.cos(currentAngle) * radius;
    } else {
      return centerY + Math.sin(currentAngle) * radius;
    }
  } else {
    return axis === "x" ? Math.random() * globalThis.innerWidth : Math.random() * globalThis.innerHeight;
  }
}

export default function spinbot() {
  validate(Date.now, true);
  gameManager.game.pixi._ticker.add(spinbotTicker);

  object.defineProperty(gameManager.game.input.mousePos, "y", {
    get() {
      if (isMouseDown && !lastAimPos) {
        return this._y;
      }

      if (isMouseDown && lastAimPos) {
        return lastAimPos.clientY;
      }

      if (!isMouseDown && settings.spinbot.enabled) {
        return calculateSpinbotMousePosition("y");
      }

      return this._y;
    },
    set(value) {
      this._y = value;
    },
  });

  object.defineProperty(gameManager.game.input.mousePos, "x", {
    get() {
      if (isMouseDown && !lastAimPos) {
        return this._x;
      }

      if (isMouseDown && lastAimPos) {
        return lastAimPos.clientX;
      }

      if (!isMouseDown && settings.spinbot.enabled) {
        return calculateSpinbotMousePosition("x");
      }

      return this._x;
    },
    set(value) {
      this._x = value;
    },
  });

  reflect.apply(ref_addEventListener, globalThis, ["mousedown", () => {
    isMouseDown = true;
  }]) 

  reflect.apply(ref_addEventListener, globalThis, ["mouseup", () => {
    isMouseDown = false;
  }]) 

  gameManager.game.pixi._ticker.add(() => {
    if (!isMouseDown && settings.spinbot.enabled) {
      if (settings.spinbot.realistic) {
        angularVelocity += (Math.random() * 2 - 1) * angularAccelerationMax;
        angularVelocity *= dampingFactor;
        currentAngle += angularVelocity;
      }
    }
  });
}
