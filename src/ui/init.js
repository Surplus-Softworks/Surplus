import React from 'react';
import ReactDOM from 'react-dom/client';
import Menu from '@/ui/components/Menu.jsx';
import { defaultSettings, settings, setUIRoot, markConfigLoaded } from '@/state.js';
import { object, reflect, ref_addEventListener } from '@/utils/hook.js';
import { read } from '@/utils/store.js';
import { encryptDecrypt } from '@/utils/encryption.js';
import { globalStylesheet } from '@/ui/components/stylesGlobal.js';

const FONT_URL = 'https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/gotham.css';
const SETTINGS_KEY = 'c';
const VERSION_ENDPOINT = 'https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest';
const KEY_TOGGLE_MENU = 'ShiftRight';
const KEY_TOGGLE_AIMBOT = 'KeyB';
const KEY_TOGGLE_SPINBOT = 'KeyH';

let uiShadow;
export let menuElement;

let reactRoot = null;
let currentSettings = {};
let setMenuVisible = () => {};
let menuVersion = '';

const renderMenu = () => {
  if (!reactRoot) return;
  reactRoot.render(
    <Menu
      settings={currentSettings}
      onSettingChange={handleSettingChange}
      onClose={() => setMenuVisible(false)}
      version={menuVersion}
    />
  );
};

const assignPath = (target, keys, value) => {
  let node = target;
  for (let index = 0; index < keys.length - 1; index += 1) {
    node = node[keys[index]];
  }
  node[keys[keys.length - 1]] = value;
};

function handleSettingChange(path, value) {
  const keys = path.split('.');
  assignPath(settings, keys, value);
  assignPath(currentSettings, keys, value);
  renderMenu();
}

const cloneSettings = (source) => {
  if (source === null || typeof source !== 'object') return source;
  const clone = {};
  object.entries(source).forEach(([key, value]) => {
    clone[key] = cloneSettings(value);
  });
  return clone;
};

const mergeSettings = (patch, target, stateTarget) => {
  if (!patch || typeof patch !== 'object') return;
  object.entries(patch).forEach(([key, value]) => {
    if (value && typeof value === 'object' && target[key] && stateTarget[key]) {
      mergeSettings(value, target[key], stateTarget[key]);
      return;
    }
    if (typeof value === typeof target[key]) {
      target[key] = value;
      if (stateTarget[key] !== undefined) stateTarget[key] = value;
    }
  });
};

const attachFont = () => {
  const link = document.createElement('link');
  link.href = FONT_URL;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const createShadowRoot = () => {
  const container = document.createElement('div');
  const shadow = container.attachShadow({ mode: 'closed' });
  uiShadow = shadow;
  setUIRoot(shadow);
  document.body.appendChild(container);
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStylesheet;
  shadow.appendChild(styleElement);
  return shadow;
};

const createMenuContainer = (shadow) => {
  const root = document.createElement('div');
  shadow.appendChild(root);
  reactRoot = ReactDOM.createRoot(root);
  menuElement = root;
  return root;
};

const toggleSetting = (settingPath) => {
  const keys = settingPath.split('.');
  const lastKey = keys[keys.length - 1];
  let nodeSettings = settings;
  let nodeCurrent = currentSettings;
  for (let i = 0; i < keys.length - 1; i += 1) {
    nodeSettings = nodeSettings[keys[i]];
    nodeCurrent = nodeCurrent[keys[i]];
  }
  nodeSettings[lastKey] = !nodeSettings[lastKey];
  nodeCurrent[lastKey] = nodeSettings[lastKey];
  renderMenu();
};

const registerKeyboardShortcuts = (root) => {
  reflect.apply(ref_addEventListener, globalThis, ['keydown', (event) => {
    if (event.code === KEY_TOGGLE_MENU) {
      const menu = root.querySelector('#ui');
      if (!menu) return;
      const hidden = menu.style.display === 'none';
      menu.style.display = hidden ? '' : 'none';
      setMenuVisible = (visible) => {
        if (menu) menu.style.display = visible ? '' : 'none';
      };
      return;
    }
    if (event.code === KEY_TOGGLE_AIMBOT) {
      toggleSetting('aimbot.enabled');
      return;
    }
    if (event.code === KEY_TOGGLE_SPINBOT) {
      toggleSetting('spinbot.enabled');
    }
  }]);
};

const createVisibilityController = (root) => {
  setMenuVisible = (visible) => {
    const menu = root.querySelector('#ui');
    if (menu) menu.style.display = visible ? '' : 'none';
  };
};

const scheduleSettingsLoad = () => {
  const parse = JSON.parse;
  setTimeout(() => {
    mergeSettings(defaultSettings, currentSettings, settings);
    read(SETTINGS_KEY)
      .then((stored) => (!stored ? defaultSettings : parse(encryptDecrypt(stored))))
      .then((config) => {
        mergeSettings(config, currentSettings, settings);
        markConfigLoaded();
        renderMenu();
      });
  }, 1000);
};

const fetchVersion = () => {
  globalThis
    .fetch(VERSION_ENDPOINT)
    .then((response) => response.json())
    .then((response) => {
      const availableVersion = response.tag_name;
      const suffix = VERSION !== availableVersion ? ' (update available!)' : '';
      menuVersion = VERSION + suffix;
      renderMenu();
    })
    .catch(() => {
      menuVersion = VERSION;
      renderMenu();
    });
};

function buildUI() {
  attachFont();
  const shadow = createShadowRoot();
  const root = createMenuContainer(shadow);
  registerKeyboardShortcuts(root);
  createVisibilityController(root);
  currentSettings = cloneSettings(defaultSettings);
  renderMenu();
  scheduleSettingsLoad();
  fetchVersion();
}

export default function initUI() {
  const onReady = () => buildUI();
  if (document.readyState === 'loading') {
    reflect.apply(ref_addEventListener, document, ['DOMContentLoaded', onReady]);
  } else {
    onReady();
  }
}
