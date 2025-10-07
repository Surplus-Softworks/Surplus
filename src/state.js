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

const settingsKeys = {
  aimbot_: {
    _k: 'ab',
    enabled_: 'e',
    smooth_: 's',
    targetKnocked_: 'tk',
    stickyTarget_: 'st',
    showDot_: 'sd',
  },
  meleeLock_: {
    _k: 'ml',
    enabled_: 'e',
    autoMelee_: 'am',
  },
  mobileMovement_: {
    _k: 'mm',
    enabled_: 'e',
    smooth_: 's',
  },
  autoFire_: {
    _k: 'af',
    enabled_: 'e',
  },
  xray_: {
    _k: 'xr',
    enabled_: 'e',
    smokeOpacity_: 'so',
    treeOpacity_: 'to',
    removeCeilings_: 'rc',
    darkerSmokes_: 'ds',
  },
  esp_: {
    _k: 'es',
    visibleNametags_: 'vn',
    enabled_: 'e',
    players_: 'p',
    flashlights_: {
      _k: 'fl',
      own_: 'o',
      others_: 'ot',
      trajectory_: 't',
    },
    grenades_: {
      _k: 'gr',
      explosions_: 'ex',
      trajectory_: 't',
    },
  },
  mapHighlights_: {
    _k: 'mh',
    enabled_: 'e',
    smallerTrees_: 'st',
  },
  autoLoot_: {
    _k: 'al',
    enabled_: 'e',
  },
  infiniteZoom_: {
    _k: 'iz',
    enabled_: 'e',
  },
  autoSwitch_: {
    _k: 'as',
    enabled_: 'e',
    useOneGun_: 'uo',
  },
  layerSpoof_: {
    _k: 'ls',
    enabled_: 'e',
  },
};

const createSettings = (keys, defaults) => {
  const store = {};
  const obj = {};

  const build = (k, d, storePath) => {
    const result = {};
    for (const prop in k) {
      if (prop === '_k') continue;
      const key = k[prop];
      const defaultVal = d?.[prop];
      if (typeof key === 'object' && key._k) {
        result[prop] = build(key, defaultVal, storePath + '.' + prop);
      } else {
        const fullPath = storePath + '.' + prop;
        if (typeof defaultVal === 'number') {
          store[fullPath] = defaultVal;
        } else {
          store[fullPath] = Boolean(defaultVal);
        }
        Object.defineProperty(result, prop, {
          get() {
            return store[fullPath];
          },
          set(v) {
            if (typeof store[fullPath] === 'number') {
              store[fullPath] = typeof v === 'number' ? v : 0;
            } else {
              store[fullPath] = Boolean(v);
            }
          },
          enumerable: true,
        });
      }
    }
    return result;
  };

  for (const topKey in keys) {
    obj[topKey] = build(keys[topKey], defaults[topKey], topKey);
  }

  const serialize = () => {
    const serializeGroup = (k, prefix) => {
      const result = {};
      for (const prop in k) {
        if (prop === '_k') continue;
        const key = k[prop];
        if (typeof key === 'object' && key._k) {
          result[key._k] = serializeGroup(key, prefix + '.' + prop);
        } else {
          const fullPath = prefix + '.' + prop;
          result[key] = store[fullPath];
        }
      }
      return result;
    };

    const result = {};
    for (const topKey in keys) {
      result[keys[topKey]._k] = serializeGroup(keys[topKey], topKey);
    }
    return result;
  };

  const deserialize = (data) => {
    if (!data || typeof data !== 'object') return;

    const deserializeGroup = (k, d, prefix) => {
      if (!d || typeof d !== 'object') return;
      for (const prop in k) {
        if (prop === '_k') continue;
        const key = k[prop];
        if (typeof key === 'object' && key._k) {
          const nested = d[key._k];
          deserializeGroup(key, nested, prefix + '.' + prop);
        } else {
          const value = d[key];
          if (value !== undefined) {
            const fullPath = prefix + '.' + prop;
            if (typeof store[fullPath] === 'number') {
              store[fullPath] = typeof value === 'number' ? value : 0;
            } else {
              store[fullPath] = Boolean(value);
            }
          }
        }
      }
    };

    for (const topKey in keys) {
      const topData = data[keys[topKey]._k];
      deserializeGroup(keys[topKey], topData, topKey);
    }
  };

  obj._serialize = serialize;
  obj._deserialize = deserialize;

  return obj;
};

export const settings = createSettings(settingsKeys, defaultSettings);

let uiRoot;

export const setUIRoot = (root) => {
  uiRoot = root;
};

export const getUIRoot = () => uiRoot;

let configLoaded = false;
let isUpdatingConfig = false;
let lastConfig;
const stringify = JSON.stringify;
let updateTimer = null;
let storeReadyPromise = null;

const ensureStoreReady = () => {
  if (!storeReadyPromise) {
    storeReadyPromise = initStore().catch((error) => {
      storeReadyPromise = null;
      throw error;
    });
  }
  return storeReadyPromise;
};

export const markConfigLoaded = () => {
  configLoaded = true;
};

export const isConfigLoaded = () => configLoaded;

const updateConfig = async () => {
  if (!configLoaded || isUpdatingConfig) return;
  isUpdatingConfig = true;

  try {
    await ensureStoreReady();

    const serialized = settings._serialize();
    const config = stringify(serialized);
    if (config !== lastConfig) {
      const encrypted = encryptDecrypt(config);
      const success = await write('c', encrypted);
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

export const loadSettings = (data) => {
  if (data && typeof data === 'object') {
    settings._deserialize(data);
  }
};

startConfigPersistence();
