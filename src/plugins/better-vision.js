import { gameManager } from "../utils/injector.js";

export function betterVision_ticker() {
  setInterval(() => {
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
  }, 100)
}

export function betterVision() {
  gameManager.game.pixi._ticker.add(betterVision_ticker);
}
