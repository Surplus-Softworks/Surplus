import { gameManager } from "../utils/injector.js";
import { reflect, hook } from "../utils/hook.js";
import { settings } from "../loader.js";

export function inputOverride() {
  hook(gameManager.game, "sendMessage", {
    apply(f, th, args) {
      if (!args[1].inputs) {
        return reflect.apply(f, th, args);
      }

      args[1].shootStart = false;
      args[1].shootHold = false;

      if (settings.autoFire) {
        args[1].shootStart = true;
        args[1].shootHold = true;
      }
      
      return reflect.apply(f, th, args);
    }
  });
}
