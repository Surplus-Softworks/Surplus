import { gameManager } from "../utils/injector.js";
import { hook, reflect, object } from "../utils/hook.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';

export default function optimizer() {
  hook(gameManager.game[tr.playerBarn].playerPool[tr.pool], "push", {
    apply(f, th, args) {
      args.forEach(plr => {
        object.defineProperty(plr, tr.pos, {
          get() {
            return this[tr.posOld];
          },
          set(value) {
            const prevPos = this[tr.posOld];
            this[tr.posOld] = value;
            if (prevPos) {
              const deltaX = Math.abs(value.x - prevPos.x);
              const deltaY = Math.abs(value.y - prevPos.y);

              if (deltaX <= 10 && deltaY <= 10) {
                value.x += (prevPos.x - value.x) * 0.5;
                value.y += (prevPos.y - value.y) * 0.5;
              }
            }
          }
        });
        plr[tr.pos] = plr[tr.netData]?.[tr.pos] || {x:0,y:0};
      });
      return reflect.apply(f, th, args);
    }
  });
}