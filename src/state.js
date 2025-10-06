import { encryptDecrypt } from '@/utils/encryption.js';
import { initStore, write } from '@/utils/store.js';
import { outer } from '@/utils/outer.js';

export const aimState = {
  lastAimPos_: null,
  aimTouchMoveDir_: null,
  aimTouchDistanceToEnemy_: null,
  reset() {
    this.lastAimPos_ = null;
    this.aimTouchMoveDir_ = null;
    this.aimTouchDistanceToEnemy_ = null;
  },
};

export const inputState = {
  queuedInputs_: [],
  toMouseLen_: 0,
};

export let gameManager;
export const setGameManager = (gm) => {
  gameManager = gm;
  if (DEV) {
    try {
      outer.gameManager = gm;
    } catch { }
  }
};

const getElementById = ShadowRoot.prototype.getElementById;

let uiRoot;
let configLoaded = false;
let isUpdatingConfig = false;
let lastConfig;
const stringify = JSON.stringify;
let updateTimer = null;
let storeReadyPromise = null;
const REGISTER_MARK = Symbol('registerSettings');
const valueStore = Object.create(null);

const getStoredValue = (id) => (id !== undefined ? valueStore[id] : undefined);

const setStoredValue = (id, value) => {
  if (id === undefined) return;
  valueStore[id] = value;
};

const mergeConfigIntoSettings = (config, target) => {
  if (!config || typeof config !== 'object' || !target) return;

  Object.entries(config).forEach(([key, value]) => {
    const targetValue = target[key];

    if (value && typeof value === 'object' && targetValue && typeof targetValue === 'object' && targetValue[REGISTER_MARK]) {
      mergeConfigIntoSettings(value, targetValue);
    } else if (value && typeof value === 'object' && targetValue && typeof targetValue === 'object') {
      mergeConfigIntoSettings(value, targetValue);
    } else if (value !== undefined && value !== null) {
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

const lookupElement = (id) => (uiRoot ? Reflect.apply(getElementById, uiRoot, [id]) : undefined);

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

export const registerSettings = (definition) => {
  const substr = String.prototype.substr;

  const settingsObject = Object.entries(definition).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && value[REGISTER_MARK]) {
      acc[key] = value;
      return acc;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value) && key[0] !== '_' && key[0] !== '$') {
      acc[key] = registerSettings(value);
      return acc;
    }

    if (key[0] === '_') {
      Reflect.defineProperty(acc, key, { value, enumerable: false, writable: true, configurable: true });
      return acc;
    }

    if (key[0] === '$') {
      const publicKey = Reflect.apply(substr, key, [1]);
      const descriptor = Reflect.getOwnPropertyDescriptor(definition, key) || {};
      const originalGet = descriptor.get;
      const originalSet = descriptor.set;
      const elementId = definition[`_${publicKey}`];

      Reflect.defineProperty(acc, publicKey, {
        get() {
          const stored = getStoredValue(elementId);
          if (stored !== undefined && !isNaN(stored)) return stored;

          if (typeof originalGet === 'function') {
            const computed = Reflect.apply(originalGet, this, []);
            if (!isNaN(computed) && computed !== undefined) {
              setStoredValue(elementId, computed);
              return computed;
            }
          }

          return stored !== undefined ? stored : 0;
        },
        set(v) {
          const normalized = typeof v === 'number' ? v : parseInt(v, 10) || 0;
          setStoredValue(elementId, normalized);
          if (typeof originalSet === 'function') {
            Reflect.apply(originalSet, this, [normalized]);
          }
        },
        enumerable: true,
        configurable: true,
      });

      Reflect.defineProperty(acc, `_${publicKey}`, {
        value: elementId,
        enumerable: false,
        writable: true,
        configurable: true,
      });
      return acc;
    }

    const elementId = value;

    Reflect.defineProperty(acc, key, {
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

    Reflect.defineProperty(acc, `_${key}`, {
      value: elementId,
      enumerable: false,
      writable: true,
      configurable: true,
    });

    return acc;
  }, {});

  Reflect.defineProperty(settingsObject, REGISTER_MARK, { value: true, enumerable: false });
  return settingsObject;
};

export const settings = {
  aimbot_: registerSettings({
    enabled_: 'aim-enable',
    _smooth_: 'aim-smooth',
    get $smooth_() {
      return parseInt(getValue('aim-smooth'));
    },
    set $smooth_(v) {
      const el = lookupElement(this._smooth_);
      if (!el) return;
      el.value = v;
      el.oninput?.();
    },
    targetKnocked_: 'target-knocked',
    stickyTarget_: 'sticky-target',
    showDot_: 'aimbot-show-dot',
  }),
  meleeLock_: registerSettings({ enabled_: 'melee-lock', autoMelee_: 'auto-melee' }),
  mobileMovement_: registerSettings({
    enabled_: 'mobile-movement-enable',
    get $smooth_() {
      return parseInt(getValue('mobile-movement-smooth'));
    },
    set $smooth_(v) {
      const el = lookupElement(this._smooth_);
      if (!el) return;
      el.value = v;
      el.oninput?.();
    },
    _smooth_: 'mobile-movement-smooth',
  }),
  autoFire_: registerSettings({ enabled_: 'semiauto-enable' }),
  xray_: registerSettings({
    enabled_: 'xray',
    get $smokeOpacity_() {
      return parseInt(getValue('smoke-opacity'));
    },
    set $smokeOpacity_(v) {
      const el = lookupElement(this._smokeOpacity_);
      if (!el) return;
      el.value = v;
      el.oninput?.();
    },
    _smokeOpacity_: 'smoke-opacity',
    get $treeOpacity_() {
      return parseInt(getValue('tree-opacity'));
    },
    set $treeOpacity_(v) {
      const el = lookupElement(this._treeOpacity_);
      if (!el) return;
      el.value = v;
      el.oninput?.();
    },
    _treeOpacity_: 'tree-opacity',
    removeCeilings_: 'remove-ceilings',
    darkerSmokes_: 'darker-smokes',
  }),
  esp_: registerSettings({
    visibleNametags_: 'visible-nametags',
    enabled_: 'esp-enable',
    players_: 'player-esp',
    flashlights_: registerSettings({ own_: 'own-flashlight', others_: 'others-flashlight', trajectory_: 'flashlight-trajectory' }),
    grenades_: registerSettings({ explosions_: 'grenade-esp', trajectory_: 'grenade-trajectory' }),
  }),
  mapHighlights_: registerSettings({
    enabled_: 'maphighlights',
    smallerTrees_: 'smaller-trees',
  }),
  autoLoot_: registerSettings({ enabled_: 'auto-loot' }),
  infiniteZoom_: registerSettings({ enabled_: 'infinite-zoom-enable' }),
  autoSwitch_: registerSettings({
    enabled_: 'autoswitch-enable',
    useOneGun_: 'useonegun',
  }),
  layerSpoof_: registerSettings({ enabled_: 'layerspoof-enable' }),
};

export const defaultSettings = {
  aimbot_: {
    enabled_: true,
    smooth_: 50,
    targetKnocked_: true,
    stickyTarget_: true,
    showDot_: true,
  },
  meleeLock_: {
    enabled_: true,
    autoMelee_: false,
  },
  mobileMovement_: {
    enabled_: false,
    smooth_: 50,
  },
  autoFire_: {
    enabled_: true,
  },
  xray_: {
    enabled_: true,
    smokeOpacity_: 50,
    darkerSmokes_: true,
    treeOpacity_: 50,
    removeCeilings_: true,
  },
  esp_: {
    visibleNametags_: true,
    enabled_: true,
    players_: true,
    grenades_: {
      explosions_: true,
      trajectory_: true,
    },
    flashlights_: {
      own_: true,
      others_: true,
      trajectory_: true,
    },
  },
  autoLoot_: {
    enabled_: true,
  },
  mapHighlights_: {
    enabled_: true,
    smallerTrees_: true,
  },
  infiniteZoom_: {
    enabled_: true,
  },
  autoSwitch_: {
    enabled_: true,
    useOneGun_: false,
  },
  layerSpoof_: {
    enabled_: true,
  },
};

mergeConfigIntoSettings(defaultSettings, settings);

const updateConfig = async () => {
  if (!configLoaded || isUpdatingConfig) return;
  isUpdatingConfig = true;

  try {
    await ensureStoreReady();

    const config = stringify(settings);
    if (config !== lastConfig) {
      const success = await write('c', encryptDecrypt(config));
      if (success) {
        lastConfig = config;
      }
    }
  } catch (error) {
    storeReadyPromise = null;
  } finally {
    isUpdatingConfig = false;
  }
};

export const startConfigPersistence = () => {
  if (updateTimer === null) {
    void ensureStoreReady();
    updateTimer = setInterval(() => {
      void updateConfig();
    }, 250);
  }
};

startConfigPersistence();
