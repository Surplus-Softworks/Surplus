import { gameManager } from "../utils/injector.js";
import {
  getTeam,
} from "../utils/constants.js";

const GREEN = 0x399d37;
const BLUE = 0x3a88f4;
const RED = 0xdc3734;
const WHITE = 0xffffff;

export function betterVision_ticker() {
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
  gameManager.game.playerBarn.playerPool.pool.forEach(player => {
    player.nameText.visible = true
    const me = gameManager.game.activePlayer;
    const meTeam = getTeam(me);
    const playerTeam = getTeam(player);
    player.tint = playerTeam === meTeam ? BLUE : RED;
    player.nameText.style.fontSize = 20;
  })
}

export function betterVision() {
  gameManager.game.pixi._ticker.add(betterVision_ticker);
}
