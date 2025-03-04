import { settings } from "../loader.js";
import { gameManager } from "../utils/injector.js";
import { hook, object, ref_addEventListener, reflect } from "../utils/hook.js";
import { lastAimPos } from "./aimbot.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';

let currentAngle = 0;
let angularVelocity = 0;
const angularAccelerationMax = 0.075;
const dampingFactor = 0.98;
let isMouseDown = false;

function updateRotation() {
  if (
    !gameManager.game[tr.activePlayer] ||
    !gameManager.game[tr.activePlayer].bodyContainer ||
    gameManager.game[tr.uiManager].spectating
  )
    return;

  if (isMouseDown) {
    if (!gameManager.game.spectating) {
      if (lastAimPos && (settings.aimbot.enabled || settings.meleeLock.enabled)) {
        gameManager.game[tr.activePlayer].bodyContainer.rotation = Math.atan2(
          lastAimPos.clientY - globalThis.innerHeight / 2,
          lastAimPos.clientX - globalThis.innerWidth / 2
        );
      } else {
        gameManager.game[tr.activePlayer].bodyContainer.rotation = Math.atan2(
          gameManager.game[tr.input].mousePos.y - globalThis.innerHeight / 2,
          gameManager.game[tr.input].mousePos.x - globalThis.innerWidth / 2
        );
      }
    } else {
      gameManager.game[tr.activePlayer].bodyContainer.rotation = -Math.atan2(
        gameManager.game[tr.activePlayer][tr.dir].y,
        gameManager.game[tr.activePlayer][tr.dir].x
      );
    }
  } else {
    gameManager.game[tr.activePlayer].bodyContainer.rotation = Math.atan2(
      gameManager.game[tr.input].mousePos.y - globalThis.innerHeight / 2,
      gameManager.game[tr.input].mousePos.x - globalThis.innerWidth / 2
    );
  }
}

function spinbotTicker() {
  if (!(gameManager.game?.initialized)) return;
  updateRotation();
}

function calculateSpinbotMousePosition(axis) {
  if (gameManager.game[tr.activePlayer].throwableState === "cook") {
    return axis === "x" ? gameManager.game[tr.input].mousePos._x : gameManager.game[tr.input].mousePos._y;
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
  gameManager.pixi._ticker.add(spinbotTicker);

  let lastX = 0, lastY = 0;
  let isEmoteUpdate = false;
  hook(gameManager.game[tr.emoteBarn].__proto__, tr.update, {
    apply(f, th, args) {
      isEmoteUpdate = true;
      try {
        const r = Reflect.apply(f, th, args);
        isEmoteUpdate = false;
        return r;
      } catch (e) {
        isEmoteUpdate = false;
        throw e;
      }
    }
  });


  object.defineProperty(gameManager.game[tr.input].mousePos, "y", {
    get() {
      if ((isMouseDown && !lastAimPos) || isEmoteUpdate) {
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

  object.defineProperty(gameManager.game[tr.input].mousePos, "x", {
    get() {
      if ((isMouseDown && !lastAimPos) || isEmoteUpdate) {
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

  reflect.apply(ref_addEventListener, globalThis, ["mousedown", e => {
    if (e.button != 0) return;
    isMouseDown = true;
  }])

  reflect.apply(ref_addEventListener, globalThis, ["mouseup", e => {
    if (e.button != 0) return;
    isMouseDown = false;
  }])

  gameManager.pixi._ticker.add(() => {
    if (!isMouseDown && settings.spinbot.enabled) {
      if (settings.spinbot.realistic) {
        angularVelocity += (Math.random() * 2 - 1) * (settings.spinbot.speed / 50 * angularAccelerationMax);
        angularVelocity *= dampingFactor;
        currentAngle += angularVelocity;
      }
    }
  });
}
