import { gameManager } from "../utils/injector.js";
import {
  getTeam,
} from "../utils/constants.js";

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
    player.nameText.text = player.netData.activeWeapon === "fists" 
      ? player.nameText.text.split('\n')[0] 
      : `${player.nameText.text.split('\n')[0]}\n${player.netData.activeWeapon}`;

    player.nameText.visible = true
    const me = gameManager.game.activePlayer;
    const meTeam = getTeam(me);
    const playerTeam = getTeam(player);

    if (playerTeam == meTeam) {
      player.tint = 0x3a88f4
      player.nameText.style.fill = "3a88f4"
    } else {
      player.tint = 0xff2828
      player.nameText.style.fill = "ff2828"
    }
    player.nameText.style.fontSize = 20;
    player.nameText.style.dropShadowBlur = 0.1;
  })
  if (!gameManager.game.spectating) {
    gameManager.game.activePlayer.bodyContainer.rotation = Math.atan2(
      gameManager.game.input.mousePos.y - window.innerHeight / 2,
      gameManager.game.input.mousePos.x - window.innerWidth / 2
    );
  } else {
    gameManager.game.activePlayer.bodyContainer.rotation = -Math.atan2(gameManager.game.activePlayer.dir.y, gameManager.game.activePlayer.dir.x);
  }  
}

export function betterVision() {
  gameManager.game.pixi._ticker.add(betterVision_ticker);
}
