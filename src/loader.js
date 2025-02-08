import { betterVision } from "./plugins/better-vision.js";
import { infiniteZoom } from "./plugins/infinite-zoom.js";
import { inject, gameManager } from "./utils/injector.js";
import { hook, reflect } from "./utils/hook.js";

const loaded = false;

function loadPlugins() {
  if (!loaded) {
    infiniteZoom();
  }
  betterVision();
  
  loaded = true;
}

function attach() {
  hook(gameManager.game, "onJoin", {
    apply(f, th, args) {
      loadPlugins()
      return reflect.apply(f, th, args);
    }
  })
}

export function initialize() {
  inject(attach);
}