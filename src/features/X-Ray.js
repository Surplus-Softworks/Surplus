import { gameManager } from '@/state.js';
import { settings } from '@/state.js';
import { translations } from '@/utils/obfuscatedNameTranslator.js';

function processEnvironment() {
  if (!gameManager.game?.initialized) return;

  const isXrayEnabled = settings.xray.enabled;
  
  processCeilings(isXrayEnabled);
  processSmokes(isXrayEnabled);
  processObstacles(isXrayEnabled);
}

function processCeilings(isXrayEnabled) {
  if (isXrayEnabled && settings.xray.removeCeilings) {
    gameManager.game[translations.renderer].layers[3].children.forEach(element => {
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
    gameManager.game[translations.smokeBarn][translations.particles].forEach(particle => {
      if (settings.xray.darkerSmokes) {
        particle.sprite._tintRGB = 1;
      }
      
      particle.sprite.alpha = settings.xray.smokeOpacity / 1000;
    });
  }
}

function processObstacles(isXrayEnabled) {
  if (isXrayEnabled) {
    gameManager.game[translations.map][translations.obstaclePool][translations.pool].forEach(obstacle => {
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
    gameManager.pixi._ticker.add(processEnvironment);
    initialized = true;
  }
}
