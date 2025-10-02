import { settings, aimState } from '@/state.js';
import { gameManager } from '@/state.js';
import { hook, object, ref_addEventListener, reflect } from '@/utils/hook.js';
import { translatedTable } from '@/utils/obfuscatedNameTranslator.js';

const ANGULAR_ACCELERATION_MAX = 0.075;
const DAMPING_FACTOR = 0.98;
const PRIMARY_BUTTON = 0;
const TWO_PI = Math.PI * 2;

let currentAngle = 0;
let angularVelocity = 0;
let randomAngle = Math.random() * TWO_PI;
let isMouseDown = false;

function updateRotation() {
  const game = gameManager.game;
  const activePlayer = game[translatedTable.activePlayer];
  if (!activePlayer?.bodyContainer || game[translatedTable.uiManager].spectating) return;

  const body = activePlayer.bodyContainer;
  const mouseX = game[translatedTable.input].mousePos.x - globalThis.innerWidth / 2;
  const mouseY = game[translatedTable.input].mousePos.y - globalThis.innerHeight / 2;

  if (isMouseDown && aimState.lastAimPos && (settings.aimbot.enabled || settings.meleeLock.enabled)) {
    body.rotation = Math.atan2(
      aimState.lastAimPos.clientY - globalThis.innerHeight / 2,
      aimState.lastAimPos.clientX - globalThis.innerWidth / 2,
    ) || 0;
    return;
  }

  body.rotation = Math.atan2(mouseY, mouseX) || 0;
}

function spinbotTicker() {
  if (!gameManager.game?.initialized) return;
  updateRotation();
}

const getCursorRadius = () => {
  const centerX = globalThis.innerWidth / 2;
  const centerY = globalThis.innerHeight / 2;
  const deltaX = gameManager.game[translatedTable.input].mousePos._x - centerX;
  const deltaY = gameManager.game[translatedTable.input].mousePos._y - centerY;
  return { centerX, centerY, radius: Math.hypot(deltaX, deltaY) };
};

function calculateSpinbotMousePosition(axis) {
  if (gameManager.game[translatedTable.activePlayer].throwableState === 'cook') {
    return axis === 'x' ? gameManager.game[translatedTable.input].mousePos._x : gameManager.game[translatedTable.input].mousePos._y;
  }

  const { centerX, centerY, radius } = getCursorRadius();
  const angle = settings.spinbot.realistic ? currentAngle : randomAngle;
  return axis === 'x' ? centerX + Math.cos(angle) * radius : centerY + Math.sin(angle) * radius;
}

const updateSpinPhysics = () => {
  if (isMouseDown || !settings.spinbot.enabled) return;

  if (settings.spinbot.realistic) {
    angularVelocity += (Math.random() * 2 - 1) * ((settings.spinbot.speed / 50) * ANGULAR_ACCELERATION_MAX);
    angularVelocity *= DAMPING_FACTOR;
    currentAngle += angularVelocity;
    return;
  }

  if (Math.random() < settings.spinbot.speed / 100) {
    randomAngle = Math.random() * TWO_PI;
  }
};

const createMouseAccessor = (axis, compute) => ({
  get: function () {
    return compute.call(this);
  },
  set(value) {
    this[`_${axis}`] = value;
  },
});

const shouldBypassSpinbot = (isEmoteUpdate) => (isMouseDown && !aimState.lastAimPos) || isEmoteUpdate;

export default function() {
  gameManager.pixi._ticker.add(spinbotTicker);
  gameManager.pixi._ticker.add(updateSpinPhysics);

  let lastX = 0;
  let lastY = 0;
  let isEmoteUpdate = false;

  hook(gameManager.game[translatedTable.emoteBarn].__proto__, translatedTable.update, {
    apply(original, context, args) {
      isEmoteUpdate = true;
      try {
        const result = reflect.apply(original, context, args);
        isEmoteUpdate = false;
        return result;
      } catch (error) {
        isEmoteUpdate = false;
        throw error;
      }
    },
  });

  const mousePos = gameManager.game[translatedTable.input].mousePos;

  object.defineProperty(mousePos, 'y', createMouseAccessor('y', function () {
    if (shouldBypassSpinbot(isEmoteUpdate)) return this._y;
    if (isMouseDown && aimState.lastAimPos && settings.aimbot.enabled) return aimState.lastAimPos.clientY;
    if (!isMouseDown && settings.spinbot.enabled) {
      lastY = calculateSpinbotMousePosition('y');
      return lastY;
    }
    return this._y;
  }));

  object.defineProperty(mousePos, 'x', createMouseAccessor('x', function () {
    if (shouldBypassSpinbot(isEmoteUpdate)) return this._x;
    if (isMouseDown && aimState.lastAimPos && settings.aimbot.enabled) return aimState.lastAimPos.clientX;
    if (!isMouseDown && settings.spinbot.enabled) {
      lastX = calculateSpinbotMousePosition('x');
      return lastX;
    }
    return this._x;
  }));

  const handleMouseDown = (event) => {
    if (event.button !== PRIMARY_BUTTON) return;
    isMouseDown = true;
  };

  const handleMouseUp = (event) => {
    if (event.button !== PRIMARY_BUTTON) return;
    isMouseDown = false;
  };

  reflect.apply(ref_addEventListener, globalThis, ['mousedown', handleMouseDown]);
  reflect.apply(ref_addEventListener, globalThis, ['mouseup', handleMouseUp]);
}


