export function betterVision(state) {
  setInterval(()=>{
    state.gameManager.game.renderer.layers[3].children.forEach(v=>{
      if (
        v._texture?.textureCacheIds != null && 
        v._texture.textureCacheIds.some(texture=>texture.includes("ceiling"))
      ){
        v.visible = false
      }
    })
    state.gameManager.game.smokeBarn.particles.forEach(v=>{v.pos={x:1000000, y:100000}})
  }, 100)
}