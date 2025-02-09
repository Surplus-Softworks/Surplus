import { betterVision } from "./plugins/better-vision.js";
import { infiniteZoom } from "./plugins/infinite-zoom.js";
import { esp } from "./plugins/esp.js";
import { inject, gameManager } from "./utils/injector.js";
import { hook, reflect } from "./utils/hook.js";

function loadPlugins() {
  betterVision();
  setTimeout(()=>{esp()},1000)
}

function loadStaticPlugins() {
  infiniteZoom();
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
  loadStaticPlugins()
  inject(attach);
}