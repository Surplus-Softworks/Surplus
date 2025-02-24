import { gameManager } from "../utils/injector.js";
import {
  getTeam,
} from "../utils/constants.js";
import { settings } from "../loader.js";
import { object, reflect, hook } from "../utils/hook.js";

export function betterVisionTicker() {
  try {
    if (settings.xray.enabled) {
      gameManager.game.renderer.layers[3].children.forEach(v => {
        if (
          v._texture?.textureCacheIds != null &&
          v._texture.textureCacheIds.some(texture => texture.includes("ceiling") && !texture.includes("map-building-container-ceiling-05") || texture.includes("map-snow-"))
        ) {
          v.visible = false
        }
      })
      gameManager.game.smokeBarn.particles.forEach(v => { v.pos = { x: 1000000, y: 100000 } })
      gameManager.game.map.obstaclePool.pool.forEach(obstacle => {
        if (['tree', 'table', 'stairs'].some(substring => obstacle.type.includes(substring))) {
          obstacle.sprite.alpha = 0.55;
        };
        if (['bush'].some(substring => obstacle.type.includes(substring))) {
          obstacle.sprite.alpha = 0;
        }
      });
    }
  } catch { }
}

export default function betterVision() {
  hook(gameManager.game.playerBarn.playerPool.pool, "push", {
    apply(f, th, args) {
      args.forEach(arg => {
        object.defineProperty(arg, "bleedTicker", {
          configurable: true,
          set(value) {
            this._bleedTicker = value;
            const me = gameManager.game.activePlayer;
            const meTeam = getTeam(me);
            const playerTeam = getTeam(arg);

            object.defineProperty(arg.nameText, "visible", {
              configurable: true,
              value: true,
            });

            object.defineProperty(arg, "tint", {
              configurable: true,
              value: playerTeam == meTeam ? 0x3a88f4 : 0xff2828,
            });

            object.defineProperty(arg.nameText.style, "fill", {
              configurable: true,
              value: playerTeam == meTeam ? "#3a88f4" : "#ff2828",
            });

            object.defineProperty(arg.nameText.style, "fontSize", {
              configurable: true,
              value: 20,
            });

            object.defineProperty(arg.nameText.style, "dropShadowBlur", {
              configurable: true,
              value: 0.1,
            });
          },
          get() {
            return this._bleedTicker;
          }
        });
      });

      return reflect.apply(f, th, args);
    }
  });
  setInterval(betterVisionTicker, 250);
}
