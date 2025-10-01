import { gameManager } from "@/utils/injector.js";
import { reflect, hook, object } from "@/utils/hook.js";
import { autoFireEnabled } from "@/plugins/autoFire.js";
import { aimState } from "@/state/aimbotState.js";
import { inputCommands, packetTypes } from "@/utils/constants.js";
import { tr } from '@/utils/obfuscatedNameTranslator.js';
import { inputState } from "@/state/inputState.js";
import { settings } from "@/state/settings.js";

export let emoteTypes = [];

let cachedMoveDir = { x: 0, y: 0 };

export default function() {
  hook(gameManager.game, object.getOwnPropertyNames(gameManager.game.__proto__).filter(v => typeof gameManager.game[v] == "function").find(v => gameManager.game[v].length == 3), {
    apply(f, th, args) {
      if (args[0] == packetTypes.Join) {
        args[1].isMobile = settings.autoLoot.enabled;
      }
      if (args[0] == packetTypes.Input) {
        for (const command of inputState.queuedInputs) {
          args[1].addInput(inputCommands[command]);
        }
        inputState.queuedInputs.length = 0;
      }
      if (args[1].loadout) {
        emoteTypes[0] = args[1].loadout.emotes[0];
        emoteTypes[1] = args[1].loadout.emotes[1];
        emoteTypes[2] = args[1].loadout.emotes[2];
        emoteTypes[3] = args[1].loadout.emotes[3];
      }

      if (!args[1].inputs) {
        return reflect.apply(f, th, args);
      }

      if (autoFireEnabled) {
        args[1].shootStart = true;
        args[1].shootHold = true;
      }

      if (settings.mobileMovement.enabled) {
        let moveX = (args[1].moveRight ? 1 : 0) + (args[1].moveLeft ? -1 : 0);
        let moveY = (args[1].moveDown ? -1 : 0) + (args[1].moveUp ? 1 : 0);

        if (moveX !== 0 || moveY !== 0) {
          args[1].touchMoveActive = true;
          args[1].touchMoveLen = true;

          cachedMoveDir.x += (moveX - cachedMoveDir.x) * settings.mobileMovement.smooth / 1000;
          cachedMoveDir.y += (moveY - cachedMoveDir.y) * settings.mobileMovement.smooth / 1000;

          args[1].touchMoveDir.x = cachedMoveDir.x;
          args[1].touchMoveDir.y = cachedMoveDir.y;
        }
      }

      if (!args[1].moveRight && !args[1].moveLeft && !args[1].moveDown && !args[1].moveUp) {
        cachedMoveDir.x = 0;
        cachedMoveDir.y = 0;
      }

      if (aimState.aimTouchMoveDir) {
        args[1].touchMoveActive = true;
        args[1].touchMoveLen = true;
        args[1].touchMoveDir.x = aimState.aimTouchMoveDir.x;
        args[1].touchMoveDir.y = aimState.aimTouchMoveDir.y;
      }

      inputState.toMouseLen = args[1].toMouseLen

      return reflect.apply(f, th, args);
    }
  });
}
