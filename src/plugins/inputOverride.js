import { gameManager } from "../utils/injector.js";
import { reflect, hook } from "../utils/hook.js";
import { settings } from "../loader.js";

export default function inputOverride() {
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
      
      if (settings.spinBot) {
        args[1].toMouseDir = {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
        }
      }

      return reflect.apply(f, th, args);
    }
  });
}
