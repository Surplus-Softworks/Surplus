import { gameManager } from "../utils/injector.js";
import { hook, reflect, object } from "../utils/hook.js";

export default function optimizer() {
  hook(gameManager.game.playerBarn.playerPool.pool, "push", {
    apply(f, th, args) {
      args.forEach(plr => {
        object.defineProperty(plr, 'pos', {
          get: function () {
            return this._pos;
          },
          set: function (value) {
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
      });
      return reflect.apply(f, th, args);
    }
  });
}