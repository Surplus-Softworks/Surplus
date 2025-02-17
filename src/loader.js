
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
import emoteSpam from "./plugins/emoteSpam.js";

import { inject, gameManager } from "./utils/injector.js";
import { hook, reflect } from "./utils/hook.js";
import { PIXI } from "./utils/constants.js";

import initUI from "./ui/worker.js";

export const settings = {
  aimbot: {
    enabled: true,
    targetKnocked: true,
  },
  spinbot: {
    enabled: true,
  },
  autoFire: {
    enabled: true,
  },
  xray: {
    enabled: true,
  },
  esp: {
    enabled: true,
    players: true,
    grenades: true,
    flashlights: {
      own: true,
      others: true,
    },
  },
  autoLoot: {
    enabled: true,
  },
  trolling: {
    emoteSpam: true,
  }
};

function loadStaticPlugins() {
  infiniteZoom();
  autoLoot();
  autoFire();
  emoteSpam();
}

function loadPlugins() {
  //try {
  loadPIXI();

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
      break;
    }
  }
}

function attach() {
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      loadPlugins();
      return result;
    }
  });
}

export function initialize() {
  initUI();
  loadStaticPlugins()
  inject(attach);
}