import { gameManager } from "../utils/injector.js";
import { findTeam } from "../utils/constants.js";
import { settings } from "../loader.js";
import { tr } from "../utils/obfuscatedNameTranslator.js";
import { reflect } from "../utils/hook.js";

function nameTag(player) {
  const me = gameManager.game[tr.activePlayer];
  reflect.defineProperty(player.nameText, "visible", {
    get: () => true,
    set: () => {}
  });
  player.nameText.visible = true;
  player.nameText.tint = findTeam(player) == findTeam(me) ? 0xcbddf5 : 0xff2828;
  player.nameText.style.fill = findTeam(player) == findTeam(me) ? "#3a88f4" : "#ff2828";
  player.nameText.style.fontSize = 20;
  player.nameText.style.dropShadowBlur = 0.1;
}

function betterVisionTicker() {
  if (!gameManager.game?.initialized) return;

  if (settings.xray.enabled) {
    gameManager.game[tr.renderer].layers[3].children.forEach(v => {
      if (
        v._texture?.textureCacheIds &&
        v._texture.textureCacheIds.some(texture => 
          (texture.includes("ceiling") && !texture.includes("map-building-container-ceiling-05")) || 
          texture.includes("map-snow-")
        )
      ) {
        v.visible = false;
      }
    });
    
    gameManager.game[tr.smokeBarn][tr.particles].forEach(v => { v.sprite.alpha = settings.xray.smokeTransparency/1000; });
    
    gameManager.game[tr.map][tr.obstaclePool][tr.pool].forEach(obstacle => {
      if (["tree", "table", "stairs"].some(substring => obstacle.type.includes(substring))) {
        obstacle.sprite.alpha = 0.55;
      }
      if (["bush"].some(substring => obstacle.type.includes(substring))) {
        obstacle.sprite.alpha = 0;
      }
    });
  }
  gameManager.game[tr.playerBarn].playerPool[tr.pool].forEach(nameTag);
}

let first = true;
export default function betterVision() {
  if (first) {
    gameManager.pixi._ticker.add(betterVisionTicker);
    first = false;
  }
}
