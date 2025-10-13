import { gameManager } from '@/core/state.js';
import { settings } from '@/core/state.js';
import { translations } from '@/core/obfuscatedNameTranslator.js';

function processAll() {
  if (!gameManager.game?.initialized) return;

  const isXrayEnabled = settings.xray_.enabled_;

  try {
    processCeilings(isXrayEnabled);
    processSmokes(isXrayEnabled);
    processObstacles(isXrayEnabled);
  } catch { }
}

function processCeilings(isXrayEnabled) {
  if (isXrayEnabled && settings.xray_.removeCeilings_) {
    gameManager.game[translations.renderer_].layers[3].children.forEach((element) => {
      if (element._texture?.textureCacheIds) {
        const textures = element._texture.textureCacheIds;
        const shouldHide = textures.some(
          (texture) =>
            (texture.includes('ceiling') &&
              !texture.includes('map-building-container-ceiling-05')) ||
            texture.includes('map-snow-')
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
    gameManager.game[translations.smokeBarn_][translations.particles_].forEach((particle) => {
      if (settings.xray_.darkerSmokes_) {
        particle.sprite._tintRGB = 1;
      }

      particle.sprite.alpha = settings.xray_.smokeOpacity_ / 1000;
    });
  }
}

function processObstacles(isXrayEnabled) {
  if (isXrayEnabled) {
    gameManager.game[translations.map_][translations.obstaclePool_][translations.pool_].forEach(
      (obstacle) => {
        if (['tree', 'table', 'stairs', 'bush'].some((type) => obstacle.type.includes(type))) {
          obstacle.sprite.alpha = settings.xray_.treeOpacity_ / 100;
        }
      }
    );
  }
}

let initialized = false;

export default function () {
  if (!initialized) {
    gameManager.pixi._ticker.add(processAll);
    initialized = true;
  }
}
