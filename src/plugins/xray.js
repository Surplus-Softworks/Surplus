import { gameManager } from "@/utils/injector.js";
import { findTeam } from "@/utils/constants.js";
import { settings } from "@/state/settings.js";
import { tr } from "@/utils/obfuscatedNameTranslator.js";
import { reflect } from "@/utils/hook.js";

function processEnviroment() {
  if (!gameManager.game?.initialized) return;

  const isXrayEnabled = settings.xray.enabled;
  
  processCeilings(isXrayEnabled);
  processSmokes(isXrayEnabled);
  processObstacles(isXrayEnabled);
}

function processCeilings(isXrayEnabled) {
  if (isXrayEnabled && settings.xray.removeCeilings) {
    gameManager.game[tr.renderer].layers[3].children.forEach(element => {
      if (element._texture?.textureCacheIds) {
        const textures = element._texture.textureCacheIds;
        const shouldHide = textures.some(texture => 
          (texture.includes("ceiling") && !texture.includes("map-building-container-ceiling-05")) || 
          texture.includes("map-snow-")
        );
        
        if (shouldHide) {
          element.visible = false;
        }
      }
    });
  }
}

function processSmokes(isEnabled) {
  if (isEnabled) {
    gameManager.game[tr.smokeBarn][tr.particles].forEach(particle => {
      if (settings.xray.darkerSmokes) {
        particle.sprite._tintRGB = 1;
      }
      
      particle.sprite.alpha = settings.xray.smokeOpacity / 1000;
    });
  }
}

function processObstacles(isXrayEnabled) {
  if (isXrayEnabled) {
    gameManager.game[tr.map][tr.obstaclePool][tr.pool].forEach(obstacle => {
      if (["tree", "table", "stairs"].some(type => obstacle.type.includes(type))) {
        obstacle.sprite.alpha = settings.xray.treeOpacity / 100;
      }
      
      if (obstacle.type.includes("bush")) {
        obstacle.sprite.alpha = 0;
      }
    });
  }
}

let initialized = false;

export default function() {
  if (!initialized) {
    gameManager.pixi._ticker.add(processEnviroment);
    initialized = true;
  }
}