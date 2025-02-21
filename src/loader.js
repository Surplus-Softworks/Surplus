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
import { hook, reflect, object } from "./utils/hook.js";
import { PIXI } from "./utils/constants.js";

import initUI, { loadedConfig, ui } from "./ui/worker.js";
import { validate } from "./utils/security.js";
import { encryptDecrypt } from "./utils/cryptography.js";
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
  return object.entries(obj).reduce((settings, [key, value]) => {
    if (typeof value === "object" && value !== null) {
      settings[key] = registerSettings(value);
    } else if (key.startsWith("_") || key.startsWith("$")) {
      settings[key] = value;
    } else {
      reflect.defineProperty(settings, key, { get: () => getChecked(value), enumerable: true });
      reflect.defineProperty(settings, `_${key}`, { value, enumerable: false });
    }
    return settings;
  }, {});
};

export const settings = {
  aimbot: registerSettings({ enabled: "aim-enable", targetKnocked: "target-knocked", meleeLock: "melee-lock" }),
  spinbot: registerSettings({ enabled: "spinbot-enable", realistic: "realistic" }),
  autoFire: registerSettings({ enabled: "semiauto-enable" }),
  xray: registerSettings({ enabled: "xray" }),
  esp: registerSettings({
    enabled: "esp-enable",
    players: "player-esp",
    grenades: "grenade-esp",
    flashlights: { own: "own-flashlight", others: "others-flashlight" }
  }),
  autoLoot: { enabled: true },
  emoteSpam: registerSettings({
    enabled: "emote-spam-enable",
    get $speed() {
      updateConfig();
      return 1001 - (getValue("emote-spam-speed") * 10);
    },
    _speed: "emote-spam-speed"
  })
};

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

const loadStaticPlugins = () => {
  infiniteZoom();
  autoLoot();
  autoFire();
  emoteSpam();
};

const loadPIXI = () => {
  PIXI.Container = gameManager.game.pixi.stage.constructor;
  PIXI.Graphics = gameManager.pixi.stage.children.find(child => child.lineStyle)?.constructor;
};

const loadPlugins = () => {
  loadPIXI();
  esp();
  betterVision();
  grenadeTimer();
  optimizer();
  spinbot();
  aimbot();
};

const attach = () => {
  inputOverride();
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      loadPlugins();
      return result;
    }
  });
};

export const initialize = () => {
  initUI();
  loadStaticPlugins();
  inject(attach);
};
