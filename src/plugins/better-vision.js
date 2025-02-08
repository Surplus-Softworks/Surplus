import { gameManager } from "../injector/injector.js";

export function betterVision() {
  setInterval(() => {
    gameManager.game.renderer.layers[3].children.forEach(v => {
      if (
        v._texture?.textureCacheIds != null &&
        v._texture.textureCacheIds.some(texture => texture.includes("ceiling"))
      ) {
        v.visible = false
      }
    })
    gameManager.game.smokeBarn.particles.forEach(v => { v.pos = { x: 1000000, y: 100000 } })
  }, 100)
}