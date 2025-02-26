import betterVision from "./plugins/betterVision.js";
import infiniteZoom from "./plugins/infiniteZoom.js";
import esp from "./plugins/esp/main.js";
import autoLoot from "./plugins/autoLoot.js";
import grenadeTimer from "./plugins/grenadeTimer.js";
import inputOverride from "./plugins/inputOverride.js";
import autoFire from "./plugins/autoFire.js";
import optimizer from "./plugins/optimizer.js";
import spinbot from "./plugins/spinbot.js";
import aimbot from "./plugins/aimbot/main.js";
import emoteSpam from "./plugins/emoteSpam.js";
import mapColors from "./plugins/mapColors.js";
import autoSwitch from "./plugins/autoSwitch.js";

import { injectGame, gameManager } from "./utils/injector.js";
import { hook, reflect, object } from "./utils/hook.js";
import { PIXI } from "./utils/constants.js";

import initUI, { loadedConfig, ui } from "./ui/worker.js";
import { validate } from "./utils/security.js";
import { encryptDecrypt } from "./utils/encryption.js";
import { write } from "./utils/store.js";

const getElementById = validate(ShadowRoot.prototype.getElementById, true);

export const getChecked = (id) => !!(ui && reflect.apply(getElementById, ui, [id])?.checked);
export const setChecked = (id, checked) => {
  const el = ui && reflect.apply(getElementById, ui, [id]);
  if (el) el.checked = checked;
};

export const getValue = (id) => ui ? reflect.apply(getElementById, ui, [id])?.value : undefined;
export const setValue = (id, value) => {
  const el = ui && reflect.apply(getElementById, ui, [id]);
  if (el) el.value = value;
};

let lastConfig;
const stringify = validate(JSON.stringify, true);
let isUpdatingConfig = false;

const updateConfig = () => {
  if (!loadedConfig || isUpdatingConfig) return;
  isUpdatingConfig = true;
  const config = stringify(settings);
  if (config !== lastConfig) {
    write("c", encryptDecrypt(config));
    lastConfig = config;
  }
  isUpdatingConfig = false;
};

validate(setInterval, true)(updateConfig, 100);

const registerSettings = (obj) => {
  const substr = validate(String.prototype.substr, true);
  return object.entries(obj).reduce((settings, [key, value]) => {
    if (typeof value === "object" && value !== null) {
      settings[key] = value;
    } else if (key[0] == "_") {
      reflect.defineProperty(settings, key, { value, enumerable: false });
      settings[key] = value;
    } else if (key[0] == "$") {
      reflect.defineProperty(settings, reflect.apply(substr, key, [1]), reflect.getOwnPropertyDescriptor(obj, key));
    } else {
      reflect.defineProperty(settings, key, {
        get() {
          return getChecked(value)
        },
        set(v) {
          return setChecked(value, v);
        },
        enumerable: true
      });
      reflect.defineProperty(settings, `_${key}`, { value, enumerable: false });
    }
    return settings;
  }, {});
};

export const settings = {
  aimbot: registerSettings({ enabled: "aim-enable", targetKnocked: "target-knocked", meleeLock: "melee-lock" }),
  spinbot: registerSettings({
    enabled: "spinbot-enable",
    realistic: "realistic",
    get $speed() {
      return parseInt(getValue("spinbot-speed"));
    },
    set $speed(v) {
      const el = reflect.apply(getElementById, ui, [this._speed]);
      el.value = v;
      el.oninput();
    },
    _speed: "spinbot-speed"
  }),
  autoFire: registerSettings({ enabled: "semiauto-enable" }),
  xray: registerSettings({ enabled: "xray" }),
  esp: registerSettings({
    enabled: "esp-enable",
    players: "player-esp",
    grenades: "grenade-esp",
    flashlights: registerSettings({ own: "own-flashlight", others: "others-flashlight" })
  }),
  autoLoot: { enabled: true },
  emoteSpam: registerSettings({
    enabled: "emote-spam-enable",
    get $speed() {
      return 1001 - (getValue("emote-spam-speed") * 10);
    },
    set $speed(v) {
      const el = reflect.apply(getElementById, ui, [this._speed]);
      if (!el) return defaultSettings.emoteSpam.speed;
      el.value = (1001 - parseInt(v)) / 10;
      el.oninput();
    },
    _speed: "emote-spam-speed"
  }),
  infiniteZoom: registerSettings({
    enabled: "infinite-zoom-enable"
  }),
  autoSwitch: registerSettings({
    enabled: "autoswitch-enable",
    useOneGun: "useonegun"
  }),
};

export const defaultSettings = {
  aimbot: {
    enabled: true,
    targetKnocked: true,
    meleeLock: true
  },
  spinbot: {
    enabled: true,
    realistic: false,
    speed: 50
  },
  autoFire: {
    enabled: true
  },
  xray: {
    enabled: true
  },
  esp: {
    enabled: true,
    players: true,
    grenades: true,
    flashlights: {
      own: true,
      others: true
    }
  },
  autoLoot: {
    enabled: true
  },
  emoteSpam: {
    enabled: false,
    speed: 501
  },
  infiniteZoom: {
    enabled: true
  },
  autoSwitch: {
    enabled: true,
    useOneGun: false
  }
}

const loadStaticPlugins = () => {
  infiniteZoom();
  autoLoot();
  autoFire();
  emoteSpam();
  mapColors();
};

const loadPIXI = () => {
  PIXI.Container = gameManager.game.pixi.stage.constructor;
  PIXI.Graphics = gameManager.game.pixi.stage.children.find(child => child.lineStyle)?.constructor;
};

let ranPlugins = false;

const loadPlugins = () => {
  if (!ranPlugins) {
    loadPIXI();
    esp();
    betterVision();
    grenadeTimer();
    spinbot();
    aimbot();
    autoSwitch();
  }
  optimizer();
};
const attach = () => {
  let first = true;
  inputOverride();
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      loadPlugins();
      ranPlugins = true;
      return result;
    }
  });
};

export const initialize = () => {
  initUI();
  loadStaticPlugins();
  injectGame(attach);
};
