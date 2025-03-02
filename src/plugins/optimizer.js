import { gameManager } from "../utils/injector.js";
import { hook, reflect, object } from "../utils/hook.js";
import { obfuscatedNameTranslator } from '../utils/obfuscatedNameTranslator.js';

export default function optimizer() {
  console.log("HELLO");
  hook(gameManager.game[obfuscatedNameTranslator.playerBarn].playerPool[obfuscatedNameTranslator.pool], "push", {
    apply(f, th, args) {
      args.forEach(plr => {
        object.defineProperty(plr, obfuscatedNameTranslator.pos, {
          get() {
            return this._pos;
          },
          set(value) {
            const prevPos = this._pos;
            this._pos = value;

            if (prevPos) {
              const deltaX = Math.abs(value.x - prevPos.x);
              const deltaY = Math.abs(value.y - prevPos.y);

              if (deltaX <= 18 && deltaY <= 18) {
                value.x += (prevPos.x - value.x) * 0.5;
                value.y += (prevPos.y - value.y) * 0.5;
              }
            }
          }
        });
        plr[obfuscatedNameTranslator.pos] = plr[obfuscatedNameTranslator.netData][obfuscatedNameTranslator.pos];
      });
      return reflect.apply(f, th, args);
    }
  });
}