import { gameManager } from "../utils/injector.js";

export function optimizer() {
  Object.defineProperty(gameManager.game.activePlayer, 'pos', {
    get: function() {
      return this._pos;
    },
    set: function(value) {
      const prevPos = this._pos;
      this._pos = value;
      
      if (prevPos) {
        const deltaX = Math.abs(value.x - prevPos.x);
        const deltaY = Math.abs(value.y - prevPos.y);

        if (deltaX <= 18 && deltaY <= 18) {
          value.x += (prevPos.x - value.x) * 0.5;
          value.y += (prevPos.y - value.y) * 0.5;
        }
      }
    }
  });

  gameManager.game.activePlayer.pos = gameManager.game.activePlayer.netData.pos;
}