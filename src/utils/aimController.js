import { aimState, gameManager } from '@/state.js';
import { translations } from '@/utils/obfuscatedNameTranslator.js';
import { object } from '@/utils/hook.js';

const MIN_DURATION_MS = 45;
const MAX_EXTRA_DURATION_MS = 360;
const EPSILON = 1e-3;
const MIN_INTERPOLATION_DISTANCE = 6;
const MIN_INTERPOLATION_ANGLE = Math.PI / 90;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const clamp01 = (value) => Math.max(0, Math.min(1, value));

const controllerState = {
  initialized: false,
  mode: 'idle',
  baselinePos: { x: 0, y: 0 },
  currentPos: null,
  targetPos: null,
  animation: null,
  overrideActive: false,
  currentMoveDir: null,
  targetMoveDir: null,
  moveAnimation: null,
  isInterpolating: false,
};

const clonePoint = (point) => (point ? { x: point.x, y: point.y } : null);
const positionsDiffer = (a, b) => {
  if (!a && !b) return false;
  if (!a || !b) return true;
  return Math.abs(a.x - b.x) > EPSILON || Math.abs(a.y - b.y) > EPSILON;
};

const cloneMoveDir = (dir) =>
  dir
    ? {
        touchMoveActive: dir.touchMoveActive,
        touchMoveLen: dir.touchMoveLen,
        x: dir.x,
        y: dir.y,
      }
    : null;

const moveDirsEqual = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.touchMoveActive === b.touchMoveActive &&
    Math.abs(a.touchMoveLen - b.touchMoveLen) <= EPSILON &&
    Math.abs(a.x - b.x) <= EPSILON &&
    Math.abs(a.y - b.y) <= EPSILON
  );
};

const getScreenCenter = () => ({
  x: globalThis.innerWidth / 2,
  y: globalThis.innerHeight / 2,
});

const computeAngle = (point, center) => Math.atan2(point.y - center.y, point.x - center.x);
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
const angleDifference = (from, to) => Math.abs(normalizeAngle(to - from));

const computeDuration = (start, end) => {
  if (!start || !end) return MIN_DURATION_MS;
  const center = getScreenCenter();
  const startAngle = computeAngle(start, center);
  const endAngle = computeAngle(end, center);
  const angleDiff = angleDifference(startAngle, endAngle);
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const angleFactor = clamp01(angleDiff / Math.PI);
  const distanceFactor = clamp01(distance / 450);
  const factor = Math.max(angleFactor, distanceFactor);
  return MIN_DURATION_MS + factor * MAX_EXTRA_DURATION_MS;
};

const updateBodyRotation = () => {
  if (!controllerState.overrideActive) return;
  const gm = gameManager?.game;
  if (!gm?.initialized) return;
  const player = gm[translations.activePlayer];
  const body = player?.bodyContainer;
  const target = controllerState.currentPos;
  if (!body || !target) return;
  const center = getScreenCenter();
  const angle = Math.atan2(target.y - center.y, target.x - center.x);
  body.rotation = angle || 0;
};

const applyAimStateSnapshot = (pos) => {
  if (pos) {
    controllerState.overrideActive = true;
    controllerState.currentPos = clonePoint(pos);
    aimState.lastAimPos_ = { clientX: pos.x, clientY: pos.y };
  } else {
    controllerState.overrideActive = false;
    controllerState.currentPos = null;
    aimState.lastAimPos_ = null;
  }
};

const updateMoveDir = (now) => {
  const animation = controllerState.moveAnimation;
  if (animation) {
    const { startDir, targetDir, startTime, duration } = animation;
    const progress = duration <= 0 ? 1 : clamp01((now - startTime) / duration);
    const eased = easeOutCubic(progress);
    let working;

    if (!startDir && targetDir) {
      working = {
        touchMoveActive: true,
        touchMoveLen: targetDir.touchMoveLen * eased,
        x: targetDir.x * eased,
        y: targetDir.y * eased,
      };
    } else if (startDir && targetDir) {
      working = {
        touchMoveActive: true,
        touchMoveLen: startDir.touchMoveLen + (targetDir.touchMoveLen - startDir.touchMoveLen) * eased,
        x: startDir.x + (targetDir.x - startDir.x) * eased,
        y: startDir.y + (targetDir.y - startDir.y) * eased,
      };
    } else if (startDir && !targetDir) {
      const fade = 1 - eased;
      working = {
        touchMoveActive: fade > EPSILON,
        touchMoveLen: startDir.touchMoveLen * fade,
        x: startDir.x * fade,
        y: startDir.y * fade,
      };
    } else {
      working = null;
    }

    controllerState.currentMoveDir = working;
    if (progress >= 1 - EPSILON) {
      controllerState.moveAnimation = null;
      controllerState.currentMoveDir = targetDir ? cloneMoveDir(targetDir) : null;
    }
  }

  if (controllerState.currentMoveDir?.touchMoveActive && controllerState.currentMoveDir.touchMoveLen > EPSILON) {
    aimState.aimTouchMoveDir_ = cloneMoveDir(controllerState.currentMoveDir);
  } else {
    aimState.aimTouchMoveDir_ = null;
  }
};

const step = (now = performance.now()) => {
  if (!controllerState.initialized) return;

  let snapshot = null;
  const animation = controllerState.animation;
  let interpolationActive = false;
  if (animation) {
    const { startPos, targetPos, startTime, duration } = animation;
    const progress = duration <= 0 ? 1 : clamp01((now - startTime) / duration);
    const eased = easeOutCubic(progress);
    let hasMovement = false;
    if (duration > 0 && startPos && targetPos) {
      const distance = Math.hypot(targetPos.x - startPos.x, targetPos.y - startPos.y);
      if (distance > MIN_INTERPOLATION_DISTANCE) {
        hasMovement = true;
      } else {
        const center = getScreenCenter();
        const angleDiff = angleDifference(computeAngle(startPos, center), computeAngle(targetPos, center));
        hasMovement = angleDiff > MIN_INTERPOLATION_ANGLE;
      }
    }
    if (hasMovement && progress < 1 - EPSILON) {
      interpolationActive = true;
    }
    snapshot = {
      x: startPos.x + (targetPos.x - startPos.x) * eased,
      y: startPos.y + (targetPos.y - startPos.y) * eased,
    };

    if (progress >= 1 - EPSILON) {
      controllerState.animation = null;
      if (controllerState.mode === 'idle') {
        snapshot = null;
      } else {
        controllerState.targetPos = clonePoint(targetPos);
        snapshot = clonePoint(targetPos);
      }
    }
  } else if (controllerState.mode !== 'idle' && controllerState.targetPos) {
    snapshot = clonePoint(controllerState.targetPos);
  }

  controllerState.isInterpolating = interpolationActive;
  applyAimStateSnapshot(snapshot);
  updateMoveDir(now);
  updateBodyRotation();
};

const getAxisValue = (axis, fallback) => {
  if (!controllerState.overrideActive) return fallback;
  const current = controllerState.currentPos;
  if (!current) return fallback;
  return axis === 'x' ? current.x : current.y;
};

const updateBaselineAxis = (axis, value) => {
  controllerState.baselinePos = {
    ...controllerState.baselinePos,
    [axis]: value,
  };
  if (controllerState.mode === 'idle' && !controllerState.animation) {
    controllerState.currentPos = null;
  }
};

export const initializeAimController = () => {
  if (controllerState.initialized) return;
  const gm = gameManager?.game;
  const ticker = gameManager?.pixi?._ticker;
  if (!gm || !ticker) return;

  const input = gm[translations.input];
  const mousePos = input?.mousePos;
  if (!mousePos) {
    globalThis.requestAnimationFrame(initializeAimController);
    return;
  }

  const initialX = mousePos._x ?? mousePos.x ?? globalThis.innerWidth / 2;
  const initialY = mousePos._y ?? mousePos.y ?? globalThis.innerHeight / 2;
  controllerState.baselinePos = { x: initialX, y: initialY };

  const define = (axis) => ({
    configurable: true,
    get() {
      return getAxisValue(axis, this[`_${axis}`]);
    },
    set(value) {
      this[`_${axis}`] = value;
      updateBaselineAxis(axis, value);
    },
  });

  object.defineProperty(mousePos, 'x', define('x'));
  object.defineProperty(mousePos, 'y', define('y'));

  ticker.add(() => step());
  controllerState.initialized = true;
};

export const manageAimState = ({ mode = 'idle', targetScreenPos, moveDir, immediate = false } = {}) => {
  if (!controllerState.initialized) return;

  const normalizedMode = mode ?? 'idle';
  const now = performance.now();
  step(now);

  if (normalizedMode === 'idle') {
    if (controllerState.mode !== 'idle' || controllerState.overrideActive || controllerState.animation) {
      const baseline = clonePoint(controllerState.baselinePos);
      const start = controllerState.currentPos ?? baseline;
      controllerState.animation = {
        startPos: clonePoint(start),
        targetPos: baseline,
        startTime: now,
        duration: immediate ? 0 : computeDuration(start, baseline),
      };
    }
    controllerState.mode = 'idle';
    controllerState.targetPos = null;
  } else {
    const resolvedTarget = targetScreenPos ? { x: targetScreenPos.x, y: targetScreenPos.y } : clonePoint(controllerState.baselinePos);
    const start = controllerState.currentPos ?? clonePoint(controllerState.baselinePos);
    const targetChanged = positionsDiffer(resolvedTarget, controllerState.targetPos);
    const modeChanged = normalizedMode !== controllerState.mode;

    if (modeChanged || targetChanged) {
      controllerState.animation = {
        startPos: clonePoint(start),
        targetPos: clonePoint(resolvedTarget),
        startTime: now,
        duration: immediate ? 0 : computeDuration(start, resolvedTarget),
      };
      controllerState.targetPos = clonePoint(resolvedTarget);
    } else if (controllerState.animation) {
      controllerState.animation.targetPos = clonePoint(resolvedTarget);
    }

    controllerState.mode = normalizedMode;
  }

  const desiredMoveDir = cloneMoveDir(moveDir);
  if (!moveDirsEqual(desiredMoveDir, controllerState.targetMoveDir)) {
    controllerState.moveAnimation = {
      startDir: cloneMoveDir(controllerState.currentMoveDir),
      targetDir: desiredMoveDir,
      startTime: now,
      duration: controllerState.animation?.duration ?? MIN_DURATION_MS + 150,
    };
    controllerState.targetMoveDir = desiredMoveDir;
  }

  step(now);
};

export const getCurrentAimPosition = () => clonePoint(controllerState.currentPos);
export const isAimInterpolating = () => controllerState.isInterpolating;
