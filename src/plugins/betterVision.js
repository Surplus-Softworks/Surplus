import { gameManager } from "../utils/injector.js";
import { findTeam } from "../utils/constants.js";
import { settings } from "../loader.js";
import { tr } from "../utils/obfuscatedNameTranslator.js";
import { reflect } from "../utils/hook.js";

function betterVisionTicker() {
  if (!gameManager.game?.initialized) return;

  if (settings.xray.enabled) {
    if (settings.xray.removeCeilings) {
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
    }
    
    gameManager.game[tr.smokeBarn][tr.particles].forEach(v => { 
      if (settings.xray.darkerSmokes) {
        v.sprite._tintRGB = 1
      }
      v.sprite.alpha = settings.xray.smokeOpacity/1000; 
    });
    
    gameManager.game[tr.map][tr.obstaclePool][tr.pool].forEach(obstacle => {
      if (["tree", "table", "stairs"].some(substring => obstacle.type.includes(substring))) {
        obstacle.sprite.alpha = settings.xray.treeOpacity/100;
      }
      if (["bush"].some(substring => obstacle.type.includes(substring))) {
        obstacle.sprite.alpha = 0;
      }
    });
  }
}

let first = true;
export default function betterVision() {
  if (first) {
    gameManager.pixi._ticker.add(betterVisionTicker);
    first = false;
  }
}
