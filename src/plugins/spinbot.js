import { settings } from "../loader.js";
import { gameManager } from "../utils/injector.js";
import { object, ref_addEventListener, reflect } from "../utils/hook.js";
import { lastAimPos } from "./aimbot/main.js";
import { validate } from "../utils/security.js";


let currentAngle = 0;
let angularVelocity = 0;
const angularAccelerationMax = 0.075;
const dampingFactor = 0.98;
let isMouseDown = false;

function updateRotation() {
  if (
    !gameManager.game.activePlayer ||
    !gameManager.game.activePlayer.bodyContainer ||
    gameManager.game.spectating
  )
    return;

  if (isMouseDown) {
    if (!gameManager.game.spectating) {
      if (lastAimPos && settings.aimbot.enabled) {
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

  let lastX = 0, lastY = 0;
  object.defineProperty(gameManager.game.input.mousePos, "y", {
    get() {
      if (isMouseDown && !lastAimPos) {
        return this._y;
      }

      if (isMouseDown && lastAimPos && settings.aimbot.enabled) {
        return lastAimPos.clientY;
      }

      if (!settings.spinbot.realistic && settings.spinbot.enabled) {
        const chance = Math.random();
        if (chance > settings.spinbot.speed / 100) return lastY;
      }

      if (!isMouseDown && settings.spinbot.enabled) {
        return lastY = calculateSpinbotMousePosition("y");
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

      if (isMouseDown && lastAimPos && settings.aimbot.enabled) {
        return lastAimPos.clientX;
      }

      if (!settings.spinbot.realistic && settings.spinbot.enabled) {
        const chance = Math.random();
        if (chance > settings.spinbot.speed / 100) return lastX;
      }

      if (!isMouseDown && settings.spinbot.enabled) {
        return lastX = calculateSpinbotMousePosition("x");
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
        angularVelocity += (Math.random() * 2 - 1) * (settings.spinbot.speed/50 * angularAccelerationMax);
        angularVelocity *= dampingFactor;
        currentAngle += angularVelocity;
      }
    }
  });
}
