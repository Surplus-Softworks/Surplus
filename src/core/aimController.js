import { aimState, gameManager, settings } from '@/core/state.js';
import { translations } from '@/core/obfuscatedNameTranslator.js';
import { outer } from '@/core/outer.js';
import { v2 } from '@/utils/math.js';

export class AimState {
  constructor(mode = 'idle', targetScreenPos = null, moveDir = null, immediate = false) {
    this.mode_ = mode;
    this.targetScreenPos_ = targetScreenPos;
    this.moveDir_ = moveDir;
    this.immediate_ = immediate;
  }
}

const MIN_DURATION_MS = 45;
const MAX_EXTRA_DURATION_MS = 360;
const EPSILON = 1e-3;
const MIN_INTERPOLATION_DISTANCE = 6;
const MIN_INTERPOLATION_ANGLE = Math.PI / 90;

const controllerState = {
  initialized_: false,
  mode_: 'idle',
  baselinePos_: { x: 0, y: 0 },
  currentPos_: null,
  targetPos_: null,
  animation_: null,
  overrideActive_: false,
  currentMoveDir_: null,
  targetMoveDir_: null,
  moveAnimation_: null,
  isInterpolating_: false,
  idleReleaseTimeout_: null,
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
  x: outer.innerWidth / 2,
  y: outer.innerHeight / 2,
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
  const angleFactor = v2.clamp01_(angleDiff / Math.PI);
  const distanceFactor = v2.clamp01_(distance / 450);
  const factor = Math.max(angleFactor, distanceFactor);
  return MIN_DURATION_MS + factor * MAX_EXTRA_DURATION_MS * (settings.aimbot_.smooth_ / 100);
};

const updateBodyRotation = () => {
  if (!controllerState.overrideActive_ || controllerState.mode_ === 'idle') return;
  const gm = gameManager?.game;
  if (!gm?.initialized) return;
  const player = gm[translations.activePlayer_];
  const body = player?.bodyContainer;
  const target = controllerState.currentPos_;
  if (!body || !target) return;
  const center = getScreenCenter();
  const angle = Math.atan2(target.y - center.y, target.x - center.x);
  body.rotation = angle || 0;
};

const applyAimStateSnapshot = (pos) => {
  if (pos) {
    controllerState.overrideActive_ = true;
    controllerState.currentPos_ = clonePoint(pos);
    aimState.lastAimPos_ = { clientX: pos.x, clientY: pos.y };
  } else {
    controllerState.overrideActive_ = false;
    controllerState.currentPos_ = null;
    aimState.lastAimPos_ = null;
  }
};

const clearIdleReleaseTimeout = () => {
  if (controllerState.idleReleaseTimeout_ !== null) {
    clearTimeout(controllerState.idleReleaseTimeout_);
    controllerState.idleReleaseTimeout_ = null;
  }
};

const scheduleIdleRelease = (duration) => {
  clearIdleReleaseTimeout();
  controllerState.idleReleaseTimeout_ = setTimeout(
    () => {
      controllerState.idleReleaseTimeout_ = null;
      if (controllerState.mode_ === 'idle') {
        controllerState.animation_ = null;
        applyAimStateSnapshot(null);
      }
    },
    Math.max(0, duration)
  );
};

const updateMoveDir = (now) => {
  const animation = controllerState.moveAnimation_;
  if (animation) {
    const { startDir, targetDir, startTime, duration } = animation;
    const progress = duration <= 0 ? 1 : v2.clamp01_((now - startTime) / duration);
    const eased = v2.easeOutCubic_(progress);
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
        touchMoveLen:
          startDir.touchMoveLen + (targetDir.touchMoveLen - startDir.touchMoveLen) * eased,
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

    controllerState.currentMoveDir_ = working;
    if (progress >= 1 - EPSILON) {
      controllerState.moveAnimation_ = null;
      controllerState.currentMoveDir_ = targetDir ? cloneMoveDir(targetDir) : null;
    }
  }

  if (
    controllerState.currentMoveDir_?.touchMoveActive &&
    controllerState.currentMoveDir_.touchMoveLen > EPSILON
  ) {
    aimState.aimTouchMoveDir_ = cloneMoveDir(controllerState.currentMoveDir_);
  } else {
    aimState.aimTouchMoveDir_ = null;
  }
};

const step = (now = performance.now()) => {
  if (!controllerState.initialized_) return;

  let snapshot = null;
  const animation = controllerState.animation_;
  let interpolationActive = false;
  if (animation) {
    const { startPos, targetPos, startTime, duration } = animation;
    const progress = duration <= 0 ? 1 : v2.clamp01_((now - startTime) / duration);
    const eased = v2.easeOutCubic_(progress);
    let hasMovement = false;
    if (duration > 0 && startPos && targetPos) {
      const distance = Math.hypot(targetPos.x - startPos.x, targetPos.y - startPos.y);
      if (distance > MIN_INTERPOLATION_DISTANCE) {
        hasMovement = true;
      } else {
        const center = getScreenCenter();
        const angleDiff = angleDifference(
          computeAngle(startPos, center),
          computeAngle(targetPos, center)
        );
        hasMovement = angleDiff > MIN_INTERPOLATION_ANGLE;
      }
    }
    if (hasMovement && progress < 1 - EPSILON && controllerState.mode_ !== 'idle') {
      interpolationActive = true;
    }
    snapshot = {
      x: startPos.x + (targetPos.x - startPos.x) * eased,
      y: startPos.y + (targetPos.y - startPos.y) * eased,
    };

    if (progress >= 1 - EPSILON) {
      controllerState.animation_ = null;
      if (controllerState.mode_ === 'idle') {
        snapshot = null;
      } else {
        controllerState.targetPos_ = clonePoint(targetPos);
        snapshot = clonePoint(targetPos);
      }
    }
  } else if (controllerState.mode_ !== 'idle' && controllerState.targetPos_) {
    snapshot = clonePoint(controllerState.targetPos_);
  }

  controllerState.isInterpolating_ = interpolationActive;
  applyAimStateSnapshot(snapshot);
  updateMoveDir(now);
  updateBodyRotation();
};

const getAxisValue = (axis, fallback) => {
  if (!controllerState.overrideActive_) return fallback;
  const current = controllerState.currentPos_;
  if (!current) return fallback;
  return axis === 'x' ? current.x : current.y;
};

const updateBaselineAxis = (axis, value) => {
  controllerState.baselinePos_ = {
    ...controllerState.baselinePos_,
    [axis]: value,
  };
  if (controllerState.mode_ !== 'idle') {
    return;
  }

  if (!controllerState.overrideActive_) {
    controllerState.currentPos_ = null;
    controllerState.animation_ = null;
    return;
  }

  const now = performance.now();
  step(now);

  const baselinePoint = clonePoint(controllerState.baselinePos_);
  const current = controllerState.currentPos_ ?? baselinePoint;

  if (!positionsDiffer(current, baselinePoint)) {
    clearIdleReleaseTimeout();
    controllerState.animation_ = null;
    controllerState.targetPos_ = null;
    applyAimStateSnapshot(null);
    return;
  }

  const duration = computeDuration(current, baselinePoint);

  controllerState.animation_ = {
    startPos: clonePoint(current),
    targetPos: baselinePoint,
    startTime: now,
    duration,
  };
  scheduleIdleRelease(duration);
};

export const initializeAimController = () => {
  if (controllerState.initialized_) return;
  const gm = gameManager?.game;
  const ticker = gameManager?.pixi?._ticker;
  if (!gm || !ticker) return;

  const input = gm[translations.input_];
  const mousePos = input?.mousePos;
  if (!mousePos) {
    outer.requestAnimationFrame(initializeAimController);
    return;
  }

  const initialX = mousePos._x ?? mousePos.x ?? outer.innerWidth / 2;
  const initialY = mousePos._y ?? mousePos.y ?? outer.innerHeight / 2;
  controllerState.baselinePos_ = { x: initialX, y: initialY };

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

  Object.defineProperty(mousePos, 'x', define('x'));
  Object.defineProperty(mousePos, 'y', define('y'));

  ticker.add(() => step());
  controllerState.initialized_ = true;
};

export function setAimState(aimStateObj) {
  if (!controllerState.initialized_) return;

  const { mode_, targetScreenPos_, moveDir_, immediate_ } = aimStateObj;

  const normalizedMode = mode_ ?? 'idle';
  const now = performance.now();
  step(now);

  if (normalizedMode === 'idle') {
    clearIdleReleaseTimeout();
    const baseline = clonePoint(controllerState.baselinePos_);
    const start = controllerState.currentPos_ ?? clonePoint(baseline);
    const needsInterpolation = !immediate_ && positionsDiffer(start, baseline);

    if (needsInterpolation) {
      const duration = computeDuration(start, baseline);
      controllerState.animation_ = {
        startPos: clonePoint(start),
        targetPos: clonePoint(baseline),
        startTime: now,
        duration,
      };
      scheduleIdleRelease(duration);
    } else {
      controllerState.animation_ = null;
      applyAimStateSnapshot(null);
    }
    controllerState.mode_ = 'idle';
    controllerState.targetPos_ = null;
  } else {
    clearIdleReleaseTimeout();
    const resolvedTarget = targetScreenPos_
      ? { x: targetScreenPos_.x, y: targetScreenPos_.y }
      : clonePoint(controllerState.baselinePos_);
    const start = controllerState.currentPos_ ?? clonePoint(controllerState.baselinePos_);
    const targetChanged = positionsDiffer(resolvedTarget, controllerState.targetPos_);
    const modeChanged = normalizedMode !== controllerState.mode_;

    if (modeChanged || targetChanged) {
      controllerState.animation_ = {
        startPos: clonePoint(start),
        targetPos: clonePoint(resolvedTarget),
        startTime: now,
        duration: immediate_ ? 0 : computeDuration(start, resolvedTarget),
      };
      controllerState.targetPos_ = clonePoint(resolvedTarget);
    } else if (controllerState.animation_) {
      controllerState.animation_.targetPos = clonePoint(resolvedTarget);
    }

    controllerState.mode_ = normalizedMode;
  }

  const desiredMoveDir = cloneMoveDir(moveDir_);
  if (!moveDirsEqual(desiredMoveDir, controllerState.targetMoveDir_)) {
    controllerState.moveAnimation_ = {
      startDir: cloneMoveDir(controllerState.currentMoveDir_),
      targetDir: desiredMoveDir,
      startTime: now,
      duration: controllerState.animation_?.duration ?? MIN_DURATION_MS + 150,
    };
    controllerState.targetMoveDir_ = desiredMoveDir;
  }

  step(now);
}

let lastPing;

export function getPing() {
  if (gameManager.game.pings.length == 0) return lastPing ?? 0;
  let slice = Reflect.apply(Array.prototype.slice, gameManager.game.pings, [-5]);
  let sum = slice.reduce((a, b) => a + b);
  lastPing = sum / slice.length / 1000;
  return lastPing;
}

export const getCurrentAimPosition = () => clonePoint(controllerState.currentPos_);
export const isAimInterpolating = () => controllerState.isInterpolating_;
export const getAimMode = () => controllerState.mode_;

const overlayState = {
  aimbotDot_: null,
  fovCircle_: null,
  initialized_: false,
};

const ensureOverlays = (uiRoot) => {
  if (!uiRoot) return false;

  if (!overlayState.aimbotDot_) {
    const outerDocument = outer.document;
    overlayState.aimbotDot_ = outerDocument.createElement('div');
    overlayState.aimbotDot_.classList.add('aimbot-dot');
    uiRoot.appendChild(overlayState.aimbotDot_);
  }

  if (!overlayState.fovCircle_) {
    const outerDocument = outer.document;
    overlayState.fovCircle_ = outerDocument.createElement('div');
    overlayState.fovCircle_.classList.add('aimbot-fov-circle');
    uiRoot.appendChild(overlayState.fovCircle_);
  }

  overlayState.initialized_ = true;
  return true;
};

const updateAimbotDot = (displayPos, isDotTargetShootable, isFocusedEnemy) => {
  if (!overlayState.aimbotDot_) return;

  if (displayPos && settings.aimbot_.showDot_) {
    const { x, y } = displayPos;

    if (
      overlayState.aimbotDot_.style.left !== `${x}px` ||
      overlayState.aimbotDot_.style.top !== `${y}px`
    ) {
      overlayState.aimbotDot_.style.left = `${x}px`;
      overlayState.aimbotDot_.style.top = `${y}px`;
    }

    if (!isDotTargetShootable) {
      overlayState.aimbotDot_.style.backgroundColor = 'gray';
      overlayState.aimbotDot_.style.boxShadow = '0 0 0.5rem rgba(128, 128, 128, 0.5)';
    } else if (isFocusedEnemy) {
      overlayState.aimbotDot_.style.backgroundColor = 'rgb(190, 12, 185)';
      overlayState.aimbotDot_.style.boxShadow = '0 0 0.5rem rgba(190, 12, 185, 0.5)';
    } else {
      overlayState.aimbotDot_.style.backgroundColor = 'red';
      overlayState.aimbotDot_.style.boxShadow = '0 0 0.5rem rgba(255, 0, 0, 0.5)';
    }

    overlayState.aimbotDot_.style.display = 'block';
  } else {
    overlayState.aimbotDot_.style.display = 'none';
  }
};

const updateFovCircle = () => {
  if (!overlayState.fovCircle_) return;

  const game = gameManager?.game;
  if (!game?.initialized) {
    overlayState.fovCircle_.style.display = 'none';
    return;
  }

  if (settings.aimbot_.showFov_) {
    const mouseX = game[translations.input_].mousePos._x;
    const mouseY = game[translations.input_].mousePos._y;
    const fovDiameter = settings.aimbot_.fov_ * 2;

    overlayState.fovCircle_.style.left = `${mouseX}px`;
    overlayState.fovCircle_.style.top = `${mouseY}px`;
    overlayState.fovCircle_.style.width = `${fovDiameter}px`;
    overlayState.fovCircle_.style.height = `${fovDiameter}px`;
    overlayState.fovCircle_.style.display = 'block';
  } else {
    overlayState.fovCircle_.style.display = 'none';
  }
};

const hideAllOverlays = () => {
  if (overlayState.aimbotDot_) {
    overlayState.aimbotDot_.style.display = 'none';
  }
  if (overlayState.fovCircle_) {
    overlayState.fovCircle_.style.display = 'none';
  }
};

export const aimOverlays = {
  ensureInitialized: (uiRoot) => ensureOverlays(uiRoot),
  updateDot: (displayPos, isShootable, isFocused) =>
    updateAimbotDot(displayPos, isShootable, isFocused),
  updateFovCircle: () => updateFovCircle(),
  hideAll: () => hideAllOverlays(),
  isInitialized: () => overlayState.initialized_,
};
