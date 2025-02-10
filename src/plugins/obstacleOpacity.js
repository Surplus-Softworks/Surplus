import { gameManager } from "../utils/injector";

export function obstacleOpacity() {
    gameManager.game.map.obstaclePool.pool.forEach(obstacle => {
        if (!['bush', 'tree', 'table', 'stairs'].some(substring => obstacle.type.includes(substring))) return;
        obstacle.sprite.alpha = 0.45
    });
}