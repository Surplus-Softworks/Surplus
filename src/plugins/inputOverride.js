import { gameManager } from "../utils/injector.js";
import { reflect, hook } from "../utils/hook.js";
import { autoFireEnabled } from "./autoFire.js";

import { aimTouchMoveDir } from "./aimbot.js";

export default function inputOverride() {
  hook(gameManager.game, "sendMessage", {
    apply(f, th, args) {
      if (!args[1].inputs) {
        return reflect.apply(f, th, args);
      }

      args[1].shootStart = false;
      args[1].shootHold = false;

      if (autoFireEnabled) {
        args[1].shootStart = true;
        args[1].shootHold = true;
      }

      if (aimTouchMoveDir) {
        args[1].touchMoveActive = true;
        args[1].touchMoveLen = true;
        args[1].touchMoveDir.x = aimTouchMoveDir.x;
        args[1].touchMoveDir.y = aimTouchMoveDir.y;
      }

      return reflect.apply(f, th, args);
    }
  });
}
