import xray from "@/features/X-Ray.js";
import infiniteZoom from "@/features/InfiniteZoom.js";
import esp from "@/features/ESP.js";
import grenadeTimer from "@/features/GrenadeTimer.js";
import autoFire, { autoFireEnabled } from "@/features/AutoFire.js";
import aimbot from "@/features/Aimbot.js";
import mapHighlights from "@/features/MapHighlights.js";
import autoSwitch from "@/features/AutoSwitch.js";
import layerSpoof from "@/features/LayerSpoofer.js";
import { translate } from "@/utils/obfuscatedNameTranslator.js";
import { hook, reflect, object } from "@/utils/hook.js";
import { PIXI, inputCommands, packetTypes } from "@/utils/constants.js";
import { aimState, inputState, settings, gameManager, setGameManager } from "@/state.js";
import { initializeAimController } from "@/utils/aimController.js";
import initUI from "@/ui/init.js";

function injectGame(oninject) {
  hook(Function.prototype, "call", {
    apply(f, th, args) {
      try {
        if (args[0]?.nameInput != null && args[0]?.game != null) {
          Function.prototype.call = f;
          setGameManager(args[0]);
          oninject();
        }
      } catch {}
      return reflect.apply(f, th, args);
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
  PIXI.Graphics_ = gameManager.pixi.stage.children.find(child => child.lineStyle)?.constructor;
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
  }
  xray();
};

let emoteTypes = [];
let cachedMoveDir = { x: 0, y: 0 };

const findNetworkHandler = () =>
  object
    .getOwnPropertyNames(gameManager.game.__proto__)
    .find((name) => typeof gameManager.game[name] === "function" && gameManager.game[name].length === 3);

const applyAutoLootFlag = (packet) => {
  packet.isMobile = settings.autoLoot_.enabled_;
};

const flushQueuedInputs = (packet) => {
  for (const command of inputState.queuedInputs_) {
    packet.addInput(inputCommands[command]);
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

const setupInputOverride = () => {
  const networkHandler = findNetworkHandler();

  hook(gameManager.game, networkHandler, {
    apply(original, context, args) {
      const [type, payload] = args;

      if (type === packetTypes.Join) {
        applyAutoLootFlag(payload);
      }

      if (type === packetTypes.Input) {
        flushQueuedInputs(payload);
      }

      if (payload.loadout) {
        updateEmoteTypes(payload.loadout);
      }

      if (!payload.inputs) {
        return reflect.apply(original, context, args);
      }

      applyAutoFire(payload);
      applyMobileMovement(payload);
      applyAimMovement(payload);

      inputState.toMouseLen_ = payload.toMouseLen;

      return reflect.apply(original, context, args);
    },
  });
};

const attach = () => {
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      translate(gameManager).then(() => {
        loadPlugins();
        ranPlugins = true;
      });
      return result;
    }
  });
  setupInputOverride();
};

export const initialize = () => {
  initUI();
  loadStaticPlugins();
  injectGame(attach);
};
