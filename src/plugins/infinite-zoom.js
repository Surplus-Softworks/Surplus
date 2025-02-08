import { state } from "../index.js";

export function infiniteZoom() {
  window.addEventListener('wheel', function (event) {
    let zoom = state.gameManager.game.activePlayer.localData.zoom;
    if (event.deltaY > 0) {
      zoom += 15;
    } else {
      zoom -= 15;
      zoom = Math.max(30, zoom)
    }
    Object.defineProperty(state.gameManager.game.activePlayer.localData, "zoom", { configurable: true, get() { return zoom }, set() { } });
  });
}