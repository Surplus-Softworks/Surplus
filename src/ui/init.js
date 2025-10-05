import React from 'react';
import ReactDOM from 'react-dom/client';
import Menu from '@/ui/components/Menu.jsx';
import { defaultSettings, settings, setUIRoot, markConfigLoaded } from '@/state.js';
import { ref_addEventListener } from '@/utils/hook.js';
import { read, initStore } from '@/utils/store.js';
import { encryptDecrypt } from '@/utils/encryption.js';
import { globalStylesheet } from '@/ui/components/styles.js';
import { outer, outerDocument, shadowRoot } from '@/utils/outer.js';

const FONT_URL = 'https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/gotham.css';
const SETTINGS_KEY = 'c';
const VERSION_ENDPOINT = 'https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest';
const KEY_TOGGLE_MENU = 'ShiftRight';
const KEY_TOGGLE_AIMBOT = 'KeyB';

let uiShadow;
export let menuElement;

let reactRoot = null;
let currentSettings = {};
let setMenuVisible = () => {};
let menuVersion = '';
let settingsLoaded = false;

const renderMenu = () => {
  if (!reactRoot || !settingsLoaded) return;
  reactRoot.render(
    <Menu
      settings={currentSettings}
      onSettingChange={handleSettingChange}
      onClose={() => setMenuVisible(false)}
      version={menuVersion}
    />
  );
};

function handleSettingChange(updater) {
  updater(settings);
  updater(currentSettings);
  renderMenu();
}

const cloneSettings = (source) => {
  if (source === null || typeof source !== 'object') return source;
  const clone = {};
  Object.entries(source).forEach(([key, value]) => {
    clone[key] = cloneSettings(value);
  });
  return clone;
};

const mergeSettings = (patch, target, stateTarget) => {
  if (!patch || typeof patch !== 'object') return;
  Object.entries(patch).forEach(([key, value]) => {
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
  outerDocument.head.appendChild(link);
};

const createShadowRoot = () => {
  setUIRoot(shadowRoot);
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStylesheet;
  shadowRoot.appendChild(styleElement);
  return shadowRoot;
};

const createMenuContainer = (shadow) => {
  const root = document.createElement('div');
  shadow.appendChild(root);
  reactRoot = ReactDOM.createRoot(root);
  menuElement = root;
  return root;
};

const toggleSetting = (getter, setter) => {
  const newValue = !getter(settings);
  setter(settings, newValue);
  setter(currentSettings, newValue);
  renderMenu();
};

const registerKeyboardShortcuts = (root) => {
  Reflect.apply(ref_addEventListener, outer, ['keydown', (event) => {
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
      toggleSetting(
        (s) => s.aimbot_.enabled_,
        (s, v) => (s.aimbot_.enabled_ = v)
      );
      return;
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
    initStore()
      .then(() => read(SETTINGS_KEY))
      .then((stored) => (stored === null || stored === undefined ? defaultSettings : parse(encryptDecrypt(stored))))
      .then((config) => {
        mergeSettings(config, currentSettings, settings);
        markConfigLoaded();
        settingsLoaded = true;
        renderMenu();
      })
      .catch(() => {
        markConfigLoaded();
        settingsLoaded = true;
        renderMenu();
      });
  }, 1000);
};

const fetchVersion = () => {
  outer
    .fetch(VERSION_ENDPOINT)
    .then((response) => response.json())
    .then((response) => {
      const availableVersion = response.tag_name;
      const suffix = VERSION !== availableVersion ? ' (update available!)' : '';
      menuVersion = VERSION + suffix;
      if (settingsLoaded) renderMenu();
    })
    .catch(() => {
      menuVersion = VERSION;
      if (settingsLoaded) renderMenu();
    });
};

function buildUI() {
  attachFont();
  const shadow = createShadowRoot();
  const root = createMenuContainer(shadow);
  registerKeyboardShortcuts(root);
  createVisibilityController(root);
  currentSettings = cloneSettings(defaultSettings);
  scheduleSettingsLoad();
  fetchVersion();
}

let uiInitialized = false;
export default function initUI() {
  if (uiInitialized) {
    return;
  }
  uiInitialized = true;

  const onReady = () => buildUI();
  if (outerDocument.readyState === 'loading') {
    Reflect.apply(ref_addEventListener, outerDocument, ['DOMContentLoaded', onReady]);
  } else {
    onReady();
  }
}