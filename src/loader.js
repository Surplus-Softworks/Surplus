import betterVision from "./plugins/betterVision.js";
import infiniteZoom from "./plugins/infiniteZoom.js";
import esp from "./plugins/esp.js";
import grenadeTimer from "./plugins/grenadeTimer.js";
import inputOverride from "./plugins/inputOverride.js";
import autoFire from "./plugins/autoFire.js";
import spinbot from "./plugins/spinbot.js";
import aimbot from "./plugins/aimbot.js";
import mapColors from "./plugins/mapColors.js";
import autoSwitch from "./plugins/autoSwitch.js";
import { translate } from "./utils/obfuscatedNameTranslator.js";
import { injectGame, gameManager } from "./utils/injector.js";
import { hook, reflect, object } from "./utils/hook.js";
import { PIXI } from "./utils/constants.js";

import initUI, { loadedConfig, ui } from "./ui/worker.js";
import { encryptDecrypt } from "./utils/encryption.js";
import { write } from "./utils/store.js";

const getElementById = ShadowRoot.prototype.getElementById;

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
const stringify = JSON.stringify;
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

setInterval(updateConfig, 100);

const registerSettings = (obj) => {
  const substr = String.prototype.substr;
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
  aimbot: registerSettings({ enabled: "aim-enable", 
    targetKnocked: "target-knocked", 
    stickyTarget: "sticky-target",
  }),
  meleeLock: registerSettings({ enabled: "melee-lock", autoMelee: "auto-melee"}),
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
  mobileMovement: registerSettings({
    enabled: "mobile-movement-enable",
    get $smooth() {
      return parseInt(getValue("mobile-movement-smooth"));
    },
    set $smooth(v) {
      const el = reflect.apply(getElementById, ui, [this._smooth]);
      el.value = v;
      el.oninput();
    },
    _smooth: "mobile-movement-smooth"
  }),
  autoFire: registerSettings({ enabled: "semiauto-enable" }),
  xray: registerSettings({ 
    enabled: "xray",
    get $smokeOpacity() {
      return parseInt(getValue("smoke-opacity"));
    },
    set $smokeOpacity(v) {
      const el = reflect.apply(getElementById, ui, [this._smokeOpacity]);
      el.value = v;
      el.oninput();
    },
    _smokeOpacity: "smoke-opacity",
    get $treeOpacity() {
      return parseInt(getValue("tree-opacity"));
    },
    set $treeOpacity(v) {
      const el = reflect.apply(getElementById, ui, [this._treeOpacity]);
      el.value = v;
      el.oninput();
    },
    _treeOpacity: "tree-opacity",
    removeCeilings: "remove-ceilings",
    darkerSmokes: "darker-smokes"
  }),
  esp: registerSettings({
    visibleNametags: "visible-nametags",
    enabled: "esp-enable",
    players: "player-esp",
    flashlights: registerSettings({ own: "own-flashlight", others: "others-flashlight" }),
    grenades: registerSettings({ explosions: "grenade-esp", trajectories: "grenade-trajectories" })
  }),
  mapHighlights: registerSettings({
    enabled: "maphighlights",
    smallerTrees: "smaller-trees"
  }),
  autoLoot: registerSettings({ enabled: "auto-loot" }),
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
    stickyTarget: true
  },
  meleeLock: {
    enabled: true,
    autoMelee: false
  },
  spinbot: {
    enabled: true,
    realistic: false,
    speed: 50
  },
  mobileMovement: {
    enabled: false,
    smooth: 50
  },
  autoFire: {
    enabled: true
  },
  xray: {
    enabled: true,
    smokeOpacity: 50,
    darkerSmokes: true,
    treeOpacity: 50,
    removeCeilings: true,
  },
  esp: {
    visibleNametags: true,
    enabled: true,
    players: true,
    grenades: {
      explosions: true,
      trajectories: true
    },
    flashlights: {
      own: true,
      others: true
    }
  },
  autoLoot: {
    enabled: true
  },
  mapHighlights: {
    enabled: true,
    smallerTrees: true,
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
  autoFire();
  mapColors();
};

const loadPIXI = () => {
  PIXI.Container = gameManager.pixi.stage.constructor;
  PIXI.Graphics = gameManager.pixi.stage.children.find(child => child.lineStyle)?.constructor;
};

let ranPlugins = false;

const loadPlugins = () => {
  if (!ranPlugins) {
    loadPIXI();
    esp();
    grenadeTimer();
    spinbot();
    aimbot();
    autoSwitch();
  }
  betterVision();
};
const attach = () => {
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      translate(gameManager).then(translator => {
        loadPlugins();
        ranPlugins = true;
      });
      return result;
    }
  });
  inputOverride()
};

export const initialize = () => {
  initUI();
  loadStaticPlugins();
  injectGame(attach);
};
