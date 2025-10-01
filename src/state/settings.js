import { object, reflect } from "@/utils/hook.js";
import { encryptDecrypt } from "@/utils/encryption.js";
import { initStore, write } from "@/utils/store.js";

const getElementById = ShadowRoot.prototype.getElementById;

let uiRoot;
let configLoaded = false;
let isUpdatingConfig = false;
let lastConfig;
const stringify = JSON.stringify;
let updateTimer = null;
let storeReadyPromise = null;
const REGISTER_MARK = Symbol('registerSettings');
const valueStore = object.create(null);

const getStoredValue = (id) => (id !== undefined ? valueStore[id] : undefined);

const setStoredValue = (id, value) => {
  if (id === undefined) return;
  valueStore[id] = value;
};

const mergeConfigIntoSettings = (config, target) => {
  if (!config || typeof config !== 'object' || !target) return;

  object.entries(config).forEach(([key, value]) => {
    const targetValue = target[key];

    if (value && typeof value === 'object' && targetValue && typeof targetValue === 'object' && targetValue[REGISTER_MARK]) {
      mergeConfigIntoSettings(value, targetValue);
    } else if (value && typeof value === 'object' && targetValue && typeof targetValue === 'object') {
      mergeConfigIntoSettings(value, targetValue);
    } else if (targetValue !== undefined) {
      target[key] = value;
    }
  });
};

const ensureStoreReady = () => {
  if (!storeReadyPromise) {
    storeReadyPromise = initStore().catch((error) => {
      storeReadyPromise = null;
      throw error;
    });
  }
  return storeReadyPromise;
};

const lookupElement = (id) => uiRoot ? reflect.apply(getElementById, uiRoot, [id]) : undefined;

export const setUIRoot = (root) => {
  uiRoot = root;
};

export const getUIRoot = () => uiRoot;

export const markConfigLoaded = () => {
  configLoaded = true;
};

export const isConfigLoaded = () => configLoaded;

export const getChecked = (id) => !!lookupElement(id)?.checked;

export const setChecked = (id, checked) => {
  const el = lookupElement(id);
  if (el) el.checked = checked;
};

export const getValue = (id) => {
  const el = lookupElement(id);
  return el ? el.value : undefined;
};

export const setValue = (id, value) => {
  const el = lookupElement(id);
  if (el) el.value = value;
};

export const registerSettings = (obj) => {
  const substr = String.prototype.substr;
  const settingsObject = object.entries(obj).reduce((settings, [key, value]) => {
    if (value && typeof value === 'object' && value[REGISTER_MARK]) {
      settings[key] = value;
      return settings;
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value) && key[0] !== '_' && key[0] !== '$') {
      settings[key] = registerSettings(value);
      return settings;
    }

    if (key[0] === "_") {
      reflect.defineProperty(settings, key, { value, enumerable: false, writable: true, configurable: true });
      return settings;
    }

    if (key[0] === "$") {
      const publicKey = reflect.apply(substr, key, [1]);
      const descriptor = reflect.getOwnPropertyDescriptor(obj, key) || {};
      const originalGet = descriptor.get;
      const originalSet = descriptor.set;

      reflect.defineProperty(settings, publicKey, {
        get() {
          const storeKey = this[`_${publicKey}`];
          const stored = getStoredValue(storeKey);
          if (stored !== undefined) return stored;

          if (typeof originalGet === 'function') {
            const computed = reflect.apply(originalGet, this, []);
            setStoredValue(storeKey, computed);
            return computed;
          }

          return undefined;
        },
        set(v) {
          const storeKey = this[`_${publicKey}`];
          setStoredValue(storeKey, v);
          if (typeof originalSet === 'function') {
            reflect.apply(originalSet, this, [v]);
          }
        },
        enumerable: true,
        configurable: true,
      });

      reflect.defineProperty(settings, `_${publicKey}`, { value: obj[`_${publicKey}`], enumerable: false, writable: true, configurable: true });
      return settings;
    }

    const elementId = value;
    reflect.defineProperty(settings, key, {
      get() {
        const stored = getStoredValue(elementId);
        if (stored !== undefined) return stored;

        const initial = getChecked(elementId);
        const normalized = Boolean(initial);
        setStoredValue(elementId, normalized);
        return normalized;
      },
      set(v) {
        const normalized = typeof v === 'boolean' ? v : Boolean(v);
        setStoredValue(elementId, normalized);
        setChecked(elementId, normalized);
      },
      enumerable: true,
      configurable: true,
    });
    reflect.defineProperty(settings, `_${key}`, { value: elementId, enumerable: false, writable: true, configurable: true });
    return settings;
  }, {});

  reflect.defineProperty(settingsObject, REGISTER_MARK, { value: true, enumerable: false });
  return settingsObject;
};

export const settings = {
  aimbot: registerSettings({
    enabled: "aim-enable",
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
      const el = lookupElement(this._speed);
      if (!el) return;
      el.value = v;
      el.oninput?.();
    },
    _speed: "spinbot-speed"
  }),
  mobileMovement: registerSettings({
    enabled: "mobile-movement-enable",
    get $smooth() {
      return parseInt(getValue("mobile-movement-smooth"));
    },
    set $smooth(v) {
      const el = lookupElement(this._smooth);
      if (!el) return;
      el.value = v;
      el.oninput?.();
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
      const el = lookupElement(this._smokeOpacity);
      if (!el) return;
      el.value = v;
      el.oninput?.();
    },
    _smokeOpacity: "smoke-opacity",
    get $treeOpacity() {
      return parseInt(getValue("tree-opacity"));
    },
    set $treeOpacity(v) {
      const el = lookupElement(this._treeOpacity);
      if (!el) return;
      el.value = v;
      el.oninput?.();
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
  layerHack: registerSettings({ enabled: "layerhack-enable" }),
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
  },
  layerHack: {
    enabled: true
  }
};

mergeConfigIntoSettings(defaultSettings, settings);

const updateConfig = async () => {
  if (!configLoaded || isUpdatingConfig) return;
  isUpdatingConfig = true;

  try {
    await ensureStoreReady();

    const config = stringify(settings);
    if (config !== lastConfig) {
      const success = await write("c", encryptDecrypt(config));
      if (success) {
        lastConfig = config;
      }
    }
  } catch (error) {
    // Allow retries on next interval by clearing the ready promise when writes fail
    storeReadyPromise = null;
  } finally {
    isUpdatingConfig = false;
  }
};

export const startConfigPersistence = () => {
  if (updateTimer === null) {
    // Ensure IndexedDB is initialised as soon as we begin persistence
    void ensureStoreReady();
    updateTimer = setInterval(() => {
      void updateConfig();
    }, 250);
  }
};

startConfigPersistence();
