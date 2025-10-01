import { gameManager } from '@/utils/injector.js';
import { reflect, hook, object } from '@/utils/hook.js';
import { autoFireEnabled } from '@/plugins/autoFire.js';
import { inputCommands, packetTypes } from '@/utils/constants.js';
import { tr } from '@/utils/obfuscatedNameTranslator.js';
import { aimState, inputState, settings } from '@/state.js';

export let emoteTypes = [];

let cachedMoveDir = { x: 0, y: 0 };

const findNetworkHandler = () =>
  object
    .getOwnPropertyNames(gameManager.game.__proto__)
    .find((name) => typeof gameManager.game[name] === 'function' && gameManager.game[name].length === 3);

const applyAutoLootFlag = (packet) => {
  packet.isMobile = settings.autoLoot.enabled;
};

const flushQueuedInputs = (packet) => {
  for (const command of inputState.queuedInputs) {
    packet.addInput(inputCommands[command]);
  }
  inputState.queuedInputs.length = 0;
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
  if (!settings.mobileMovement.enabled) return;

  const moveX = (packet.moveRight ? 1 : 0) + (packet.moveLeft ? -1 : 0);
  const moveY = (packet.moveDown ? -1 : 0) + (packet.moveUp ? 1 : 0);

  if (moveX !== 0 || moveY !== 0) {
    packet.touchMoveActive = true;
    packet.touchMoveLen = true;

    cachedMoveDir.x += ((moveX - cachedMoveDir.x) * settings.mobileMovement.smooth) / 1000;
    cachedMoveDir.y += ((moveY - cachedMoveDir.y) * settings.mobileMovement.smooth) / 1000;

    packet.touchMoveDir.x = cachedMoveDir.x;
    packet.touchMoveDir.y = cachedMoveDir.y;
    return;
  }

  cachedMoveDir.x = 0;
  cachedMoveDir.y = 0;
};

const applyAimMovement = (packet) => {
  if (!aimState.aimTouchMoveDir) return;

  packet.touchMoveActive = true;
  packet.touchMoveLen = true;
  packet.touchMoveDir.x = aimState.aimTouchMoveDir.x;
  packet.touchMoveDir.y = aimState.aimTouchMoveDir.y;
};

export default function initInputOverride() {
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

      inputState.toMouseLen = payload.toMouseLen;

      return reflect.apply(original, context, args);
    },
  });
}
