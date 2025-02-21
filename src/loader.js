
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

import initUI, { ui } from "./ui/worker.js";

const getElementById = ShadowRoot.prototype.getElementById;

export const isChecked = id => !!(ui && reflect.apply(getElementById, ui, [id])?.checked);
export const setChecked = (id, checked) => {
  if (ui) {
      const el = reflect.apply(getElementById, ui, [id]);
      if (el) el.checked = checked;
  }
};

export const getValue = id => ui ? reflect.apply(getElementById, ui, [id])?.value : undefined;
export const setValue = (id, value) => {
  if (ui) {
      const el = reflect.apply(getElementById, ui, [id]);
      if (el) el.value = value;
  }
}


export const defaultSettings = {
  "aim-enable": true,
  "target-knocked": true,
  "melee-lock": true,
  "spinbot-enable": true,
  "realistic": true,
  "semiauto-enable": true,
  "xray": true,
  "esp-enable": true,
  "player-esp": true,
  "grenade-esp": true,
  "own-flashlight": true,
  "others-flashlight": true,
  "emote-spam-enable": true
};

export const settings = {
  aimbot: {
    get enabled() {
      return isChecked("aim-enable");
    },
    get targetKnocked() {
      return isChecked("target-knocked");
    },
    get meleeLock() {
      return isChecked("melee-lock");
    }
  },
  spinbot: {
    get enabled() {
      return isChecked("spinbot-enable");
    },
    get realistic() {
      return isChecked("realistic");
    }
  },
  autoFire: {
    get enabled() {
      return isChecked("semiauto-enable");
    }
  },
  xray: {
    get enabled() {
      return isChecked("xray");
    }
  },
  esp: {
    get enabled() {
      return isChecked("esp-enable");
    },
    get players() {
      return isChecked("player-esp");
    },
    get grenades() {
      return isChecked("grenade-esp");
    },
    flashlights: {
      get own() {
        return isChecked("own-flashlight");
      },
      get others() {
        return isChecked("others-flashlight");
      }
    },
  },
  autoLoot: {
    enabled: true,
  },
  emoteSpam: {
    get enabled() {
      return isChecked("emote-spam-enable");
    },
    get speed() {
      return 1001 - (getValue("emote-spam-speed") * 10)
    }
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
  aimbot();
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