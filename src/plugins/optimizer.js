import { gameManager } from "../utils/injector.js";
import { hook, reflect, object } from "../utils/hook.js";
import { translator } from '../utils/obfuscatedNameTranslator.js';

export default function optimizer() {
  hook(gameManager.game[translator.playerBarn].playerPool[translator.pool], "push", {
    apply(f, th, args) {
      args.forEach(plr => {
        object.defineProperty(plr, translator.pos, {
          get() {
            return this[translator.posOld];
          },
          set(value) {
            const prevPos = this[translator.posOld];
            this[translator.posOld] = value;
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
        plr[translator.pos] = plr[translator.netData]?.[translator.pos] || {x:0,y:0};
      });
      return reflect.apply(f, th, args);
    }
  });
}