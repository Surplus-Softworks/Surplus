import { betterVision } from "./plugins/better-vision.js";
import { infiniteZoom } from "./plugins/infinite-zoom.js";
import { state } from "./index.js";
import { inject } from "./injector/injector.js";
import { hook, reflect } from "./injector/hook.js";

function loadScripts() {
  hook(state.gameManager.game, "onJoin", {
    apply(f,th,args) {
        betterVision();
        infiniteZoom();
        return reflect.apply(f, th, args);
    }
  })
}

export function initScripts() {
    inject(loadScripts);
}