import { betterVision } from "./plugins/better-vision.js";
import { infiniteZoom } from "./plugins/infinite-zoom.js";

function loadScripts(state) {
  state.gameManager.game.onJoin = new Proxy(state.gameManager.game.onJoin, {
    apply(f,th,args) {
        betterVision(state);
        infiniteZoom(state);
        return Reflect.apply(f,th,args);
    }
  });
}

export function inject(state) {
    Function.prototype.bind = new Proxy(Function.prototype.bind,{
        apply(f,th,args) {
            try {
                if (args[0]?.nameInput != null) {
                    state.gameManager = args[0];
                    loadScripts(state);
                }
            } catch {}
            return Reflect.apply(f,th,args);
        }
    });
}