
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

import initUI, { loadedConfig, ui } from "./ui/worker.js";
import { validate } from "./utils/security.js";
import { ed } from "./utils/encryption.js";
import { write } from "./utils/store.js";

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
  "realistic": false,

  "semiauto-enable": true,

  "xray": true,

  "esp-enable": true,
  "player-esp": true,
  "grenade-esp": true,
  "own-flashlight": true,
  "others-flashlight": true,

  "emote-spam-enable": false,
  "emote-spam-speed": 50
};

let lastConfig;

const getOwnPropertyNames = validate(Object.getOwnPropertyNames, true);
const substr = validate(String.prototype.substr, true);
const stringify = validate(JSON.stringify, true);

let isUpdateConfig = false;

function updateConfig() {
  //console.log(100, loadedConfig, isUpdateConfig);
  if (!loadedConfig) return;
  if (isUpdateConfig) return;
  isUpdateConfig = true;
  if (lastConfig == null) return lastConfig = stringify(settings), isUpdateConfig = false;
  const config = stringify(settings);
  if (config != lastConfig) {
    write("c", ed(config));
  }
  lastConfig = config;
  isUpdateConfig = false;
}

validate(setInterval, true)(()=>{
  updateConfig();
}, 100);

const O = (obj) => {
  const o = {};
  for (let i of getOwnPropertyNames(obj)) {
    if (typeof obj[i] == "object") {
      o[i] = obj[i];
      continue;
    } else if (i[0] == "_") {
      o[i] = obj[i];
      continue;
    } else if (i[0] == "$") {
      reflect.defineProperty(o, reflect.apply(substr, i, [1]), reflect.getOwnPropertyDescriptor(obj, i));
      continue;
    }
    const el = obj[i];
    reflect.defineProperty(o, i, {
      get() {
        return isChecked(el);
      },
      enumerable: true
    });
    reflect.defineProperty(o, "_" + i, {
      value: el,
      enumerable: false
    });
  }
  return o;
}

export const settings = {
  aimbot: O({
    enabled: "aim-enable",
    targetKnocked: "target-knocked",
    meleeLock: "melee-lock"
  }),
  spinbot: O({
    enabled: "spinbot-enable",
    realistic: "realistic"
  }),
  autoFire: O({
    enabled: "semiauto-enable"
  }),
  xray: O({
    enabled: "xray"
  }),
  esp: O({
    enabled: "esp-enable",
    players: "player-esp",
    grenades: "grenade-esp",
    flashlights: {
      own: "own-flashlight",
      others: "others-flashlight"
    }
  }),
  autoLoot: {
    enabled: true
  },
  emoteSpam: O({
    enabled: "emote-spam-enable",
    get $speed() {
      updateConfig();
      return 1001 - (getValue("emote-spam-speed") * 10)
    },
    _speed: "emote-spam-speed"
  })
};

export const _settings = {
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