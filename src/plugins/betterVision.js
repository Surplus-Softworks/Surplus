import { gameManager } from "../utils/injector.js";
import {
  findTeam,
} from "../utils/constants.js";
import { settings } from "../loader.js";
import { object, reflect, hook } from "../utils/hook.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';

function nameTag(player) {
  const me = gameManager.game[tr.activePlayer];

  reflect.defineProperty(player.nameText, "visible", {
    get: () => true,
    set: () => {}
  });
  
  reflect.defineProperty(player.nameText, "tint", {
    get: () => (findTeam(player) == findTeam(me) ? 0x3a88f4 : 0xff2828),
    set: () => {}
  });
  
  reflect.defineProperty(player.nameText.style, "fill", {
    get: () => (findTeam(player) == findTeam(me) ? "#3a88f4" : "#ff2828"),
    set: () => {}
  });
  
  reflect.defineProperty(player.nameText.style, "fontSize", {
    get: () => 20,
    set: () => {}
  });
  
  reflect.defineProperty(player.nameText.style, "dropShadowBlur", {
    get: () => 0.1,
    set: () => {}
  });        
}

function betterVisionTicker() {
  if (!(gameManager.game?.initialized)) return;
  try {
    if (settings.xray.enabled) {
      gameManager.game[tr.renderer].layers[3].children.forEach(v => {
        if (
          v._texture?.textureCacheIds != null &&
          v._texture.textureCacheIds.some(texture => texture.includes("ceiling") && !texture.includes("map-building-container-ceiling-05") || texture.includes("map-snow-"))
        ) {
          v.visible = false
        }
      })
      gameManager.game[tr.smokeBarn][tr.particles].forEach(v => { v.pos = { x: 1000000, y: 100000 } })
      gameManager.game[tr.map][tr.obstaclePool][tr.pool].forEach(obstacle => {
        if (['tree', 'table', 'stairs'].some(substring => obstacle.type.includes(substring))) {
          obstacle.sprite.alpha = 0.55;
        };
        if (['bush'].some(substring => obstacle.type.includes(substring))) {
          obstacle.sprite.alpha = 0;
        }
      });
      gameManager.game[tr.playerBarn].playerPool[tr.pool].forEach(v=>{
        nameTag(v);
      });
    }
  } catch { }
}
let first = true;
export default function betterVision() {
  if (first) {
    setInterval(betterVisionTicker, 150);
    first = false;
  }
  gameManager.game[tr.playerBarn].playerPool[tr.pool].forEach(v=>{
    nameTag(v);
  });
}
