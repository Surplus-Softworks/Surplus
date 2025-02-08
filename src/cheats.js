import { betterVision } from "./plugins/better-vision.js";
import { infiniteZoom } from "./plugins/infinite-zoom.js";
import { inject, gameManager } from "./injector/injector.js";
import { hook, reflect } from "./injector/hook.js";

function loadScripts() {
  hook(gameManager.game, "onJoin", {
    apply(f, th, args) {
      betterVision();
      return reflect.apply(f, th, args);
    }
  })
}

export function initScripts() {
  infiniteZoom();
  inject(loadScripts);
}