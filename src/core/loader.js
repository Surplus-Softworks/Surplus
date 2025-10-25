import xray from '@/features/X-Ray.js';
import infiniteZoom from '@/features/InfiniteZoom.js';
import esp from '@/features/ESP.js';
import grenadeTimer from '@/features/GrenadeTimer.js';
import autoFire, { autoFireEnabled } from '@/features/AutoFire.js';
import aimbot from '@/features/Aimbot.js';
import mapHighlights from '@/features/MapHighlights.js';
import autoSwitch from '@/features/AutoSwitch.js';
import layerSpoof from '@/features/LayerSpoofer.js';
import { translate, translations } from '@/core/obfuscatedNameTranslator.js';
import { hook } from '@/core/hook.js';
import { PIXI, inputCommands, packetTypes } from '@/utils/constants.js';
import { aimState, inputState, settings, gameManager, setGameManager } from '@/core/state.js';
import { initializeAimController, isAimInterpolating, getAimMode } from '@/core/aimController.js';
import initUI from '@/ui/init.jsx';
import { outer } from '@/core/outer.js';

function injectGame(oninject) {
  hook(outer.Function.prototype, 'call', {
    apply(f, th, args) {
      try {
        if (args[0]?.nameInput != null && args[0]?.game != null) {
          outer.Function.prototype.call = f;
          setGameManager(args[0]);
          oninject();
        }
      } catch { }
      return Reflect.apply(f, th, args);
    },
  });
}

const loadStaticPlugins = () => {
  infiniteZoom();
  autoFire();
  mapHighlights();
};

const loadPIXI = () => {
  PIXI.Container_ = gameManager.pixi.stage.constructor;
  PIXI.Graphics_ = gameManager.pixi.stage.children.find((child) => child.lineStyle)?.constructor;
};

let ranPlugins = false;

const loadPlugins = () => {
  if (!ranPlugins) {
    loadPIXI();
    initializeAimController();
    esp();
    grenadeTimer();
    aimbot();
    autoSwitch();
    layerSpoof();
    ranPlugins = true;
  }
  xray();
};

let emoteTypes = [];
let cachedMoveDir = { x: 0, y: 0 };

const findNetworkHandler = () =>
  Object.getOwnPropertyNames(gameManager.game.__proto__).find(
    (name) => typeof gameManager.game[name] === 'function' && gameManager.game[name].length === 3
  );

const applyAutoLootFlag = (packet) => {
  packet.isMobile = settings.autoLoot_.enabled_;
};

const flushQueuedInputs = (packet) => {
  for (const command of inputState.queuedInputs_) {
    packet.addInput(command);
  }
  inputState.queuedInputs_.length = 0;
};

const updateEmoteTypes = (loadout) => {
  if (!loadout?.emotes) return;
  for (let i = 0; i < 4; i += 1) {
    emoteTypes[i] = loadout.emotes[i];
  }
};

const applyAutoFire = (packet) => {
  if (!autoFireEnabled) return;
  packet.shootStart = true;
  packet.shootHold = true;
};

const applyMobileMovement = (packet) => {
  if (!settings.mobileMovement_.enabled_) return;

  const moveX = (packet.moveRight ? 1 : 0) + (packet.moveLeft ? -1 : 0);
  const moveY = (packet.moveDown ? -1 : 0) + (packet.moveUp ? 1 : 0);

  if (moveX !== 0 || moveY !== 0) {
    packet.touchMoveActive = true;
    packet.touchMoveLen = true;

    cachedMoveDir.x += ((moveX - cachedMoveDir.x) * settings.mobileMovement_.smooth_) / 1000;
    cachedMoveDir.y += ((moveY - cachedMoveDir.y) * settings.mobileMovement_.smooth_) / 1000;

    packet.touchMoveDir.x = cachedMoveDir.x;
    packet.touchMoveDir.y = cachedMoveDir.y;
    return;
  }

  cachedMoveDir.x = 0;
  cachedMoveDir.y = 0;
};

const applyAimMovement = (packet) => {
  if (!aimState.aimTouchMoveDir_) return;

  packet.touchMoveActive = true;
  packet.touchMoveLen = true;
  packet.touchMoveDir.x = aimState.aimTouchMoveDir_.x;
  packet.touchMoveDir.y = aimState.aimTouchMoveDir_.y;
};

const suppressedShootState = {
  pendingStart_: false,
  pendingHold_: false,
  suppressedFireInput_: false,
  wasShootingLastFrame_: false,
  firstShotFrameCount_: 0,
};

const clearSuppressedShootState = () => {
  suppressedShootState.pendingStart_ = false;
  suppressedShootState.pendingHold_ = false;
  suppressedShootState.suppressedFireInput_ = false;
  suppressedShootState.firstShotFrameCount_ = 0;
};

const applyAimTransitionSafety = (packet) => {
  if (!packet) return;

  const aimMode = getAimMode();
  const isCurrentlyShooting =
    !!packet.shootStart ||
    !!packet.shootHold ||
    (Array.isArray(packet.inputs) && packet.inputs.includes(inputCommands.Fire_));

  if (
    isCurrentlyShooting &&
    !suppressedShootState.wasShootingLastFrame_ &&
    settings.aimbot_.enabled_
  ) {
    suppressedShootState.firstShotFrameCount_ = 3;
  }

  suppressedShootState.wasShootingLastFrame_ = isCurrentlyShooting;

  if (!isCurrentlyShooting) {
    suppressedShootState.firstShotFrameCount_ = 0;
  }

  const suppressFirstShot = suppressedShootState.firstShotFrameCount_ > 0;
  if (suppressFirstShot) {
    suppressedShootState.firstShotFrameCount_--;
  }

  const shouldSuppressShooting = (isAimInterpolating() && aimMode !== 'idle') || suppressFirstShot;

  if (!shouldSuppressShooting) {
    if (suppressedShootState.pendingStart_) {
      packet.shootStart = true;
      if (suppressedShootState.pendingHold_) {
        packet.shootHold = true;
        if (
          Array.isArray(packet.inputs) &&
          suppressedShootState.suppressedFireInput_ &&
          !packet.inputs.includes(inputCommands.Fire_)
        ) {
          packet.inputs.push(inputCommands.Fire_);
        }
      }
    }
    clearSuppressedShootState();
    return;
  }

  let fireCommandSuppressed = false;
  if (Array.isArray(packet.inputs)) {
    for (let i = packet.inputs.length - 1; i >= 0; i -= 1) {
      if (packet.inputs[i] === inputCommands.Fire_) {
        packet.inputs.splice(i, 1);
        fireCommandSuppressed = true;
      }
    }
  }

  const intendedStart = !!packet.shootStart;
  const intendedHold = !!packet.shootHold || fireCommandSuppressed;

  if (!intendedStart && !intendedHold) {
    return;
  }

  packet.shootStart = false;
  packet.shootHold = false;

  suppressedShootState.pendingStart_ =
    suppressedShootState.pendingStart_ || intendedStart || intendedHold;
  suppressedShootState.pendingHold_ = suppressedShootState.pendingHold_ || intendedHold;
  suppressedShootState.suppressedFireInput_ =
    suppressedShootState.suppressedFireInput_ || fireCommandSuppressed;
};

const setupInputOverride = () => {
  const networkHandler = findNetworkHandler();

  hook(gameManager.game, networkHandler, {
    apply(original, context, args) {
      const [type, payload] = args;

      if (type === packetTypes.Join_) {
        applyAutoLootFlag(payload);
      }

      if (type === packetTypes.Input_) {
        flushQueuedInputs(payload);
      }

      if (payload.loadout) {
        updateEmoteTypes(payload.loadout);
      }

      if (!payload.inputs) {
        return Reflect.apply(original, context, args);
      }

      applyAutoFire(payload);
      applyMobileMovement(payload);
      applyAimMovement(payload);
      applyAimTransitionSafety(payload);

      inputState.toMouseLen_ = payload.toMouseLen;

      return Reflect.apply(original, context, args);
    },
  });
};

const attach = () => {
  hook(gameManager.game, 'init', {
    apply(f, th, args) {
      const result = Reflect.apply(f, th, args);
      translate(gameManager).then(() => {
        loadPlugins();
        ranPlugins = true;
      });
      return result;
    },
  });
  setupInputOverride();
};

export const initialize = () => {
  try {
    const configKey = 'surviv_config';
    const configStr = outer.localStorage.getItem(configKey);
    if (configStr) {
      const config = JSON.parse(configStr);
      config.interpolation = true;
      config.localRotation = true;
      outer.localStorage.setItem(configKey, JSON.stringify(config));
    }
  } catch { }

  initUI();
  loadStaticPlugins();
  injectGame(attach);

  (() => {
    requestAnimationFrame(doubleInputs);
    function doubleInputs() {
      requestAnimationFrame(doubleInputs);
      try {
        gameManager.game?.[translations.sendMessage_]?.(packetTypes.Input_, gameManager.game?.[translations.prevInputMsg_]);
      } catch { }
    }
  })();
};
