import { gameManager } from "../utils/injector.js";
import {
  findTeam,
} from "../utils/constants.js";
import { settings } from "../loader.js";
import { object, reflect, hook } from "../utils/hook.js";
import { translator } from '../utils/obfuscatedNameTranslator.js';

function betterVisionTicker() {
  if (!(gameManager.game?.initialized)) return;
  try {
    if (settings.xray.enabled) {
      gameManager.game[translator.renderer].layers[3].children.forEach(v => {
        if (
          v._texture?.textureCacheIds != null &&
          v._texture.textureCacheIds.some(texture => texture.includes("ceiling") && !texture.includes("map-building-container-ceiling-05") || texture.includes("map-snow-"))
        ) {
          v.visible = false
        }
      })
      gameManager.game[translator.smokeBarn][translator.particles].forEach(v => { v.pos = { x: 1000000, y: 100000 } })
      gameManager.game[translator.map][translator.obstaclePool][translator.pool].forEach(obstacle => {
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
let first = true;
export default function betterVision() {
  function nameTag(arg) {
    object.defineProperty(arg, "bleedTicker", {
      configurable: true,
      set(value) {
        this._bleedTicker = value;
        const me = gameManager.game[translator.activePlayer];
        const meTeam = findTeam(me);
        const playerTeam = findTeam(arg);

        object.defineProperty(arg.nameText, "visible", {
          configurable: true,
          value: true,
        });

        object.defineProperty(arg.nameText, "tint", {
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
  }
  hook(gameManager.game[translator.playerBarn].playerPool[translator.pool], "push", {
    apply(f, th, args) {
      args.forEach(arg => {
        nameTag(arg);
      });

      return reflect.apply(f, th, args);
    }
  });
  gameManager.game[translator.playerBarn].playerPool[translator.pool].forEach(v=>{
    nameTag(v);
  });
  if (first) {
    setInterval(betterVisionTicker, 150);
    first = false;
  }
}
