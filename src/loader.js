
import betterVision from "./plugins/betterVision.js";
import infiniteZoom from "./plugins/infiniteZoom.js";
import esp from "./plugins/esp.js";
import autoLoot from "./plugins/autoLoot.js";
import grenadeTimer from "./plugins/grenadeTimer.js";
import inputOverride from "./plugins/inputOverride.js";
import autoFire from "./plugins/autoFire.js";
import optimizer from "./plugins/optimizer.js";
import spinbot from "./plugins/spinbot.js";
import aimbot from "./plugins/aimbot.js";
import initUI from "./ui/initUI.js";

import { inject, gameManager } from "./utils/injector.js";
import { hook, reflect } from "./utils/hook.js";
import { PIXI } from "./utils/constants.js";

export const settings = {
  aimbot: {
    enabled: true,
    targetKnocked: true,
  },
  spinbot: true,
  autoFire: true,
  xray: true,
  esp: {
    players: true,
    grenades: true,
  },
  flashlights: {
    own: true,
    others: true,
  },
  autoLoot: true,
  emoteSpam: false,
};

function loadStaticPlugins() {
  infiniteZoom();
  autoLoot();
  autoFire();
}

function loadPlugins() {
  //try {
  esp();
  betterVision();
  grenadeTimer();
  inputOverride();
  optimizer();
  spinbot();
  //aimbot();
  //} catch(e) { warn(e) }
}

function loadPIXI() {
  PIXI.Container = gameManager.game.pixi.stage.constructor;
  for (const child of gameManager.pixi.stage.children) {
    if (child.lineStyle) {
      PIXI.Graphics = child.constructor;
      window.log(PIXI)
      break;
    }
  }
}

function attach() {
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      loadPlugins();
      loadPIXI();
      return result;
    }
  });
}

export function initialize() {
  initUI();
  loadStaticPlugins()
  inject(attach);
}