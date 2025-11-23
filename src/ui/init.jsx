import React from 'react';
import ReactDOM from 'react-dom/client';
import Menu from '@/ui/components/Menu.jsx';
import DiscordNotification from '@/ui/components/DiscordNotification.jsx';
import { defaultSettings, settings, setUIRoot, markConfigLoaded } from '@/core/state.js';
import { ref_addEventListener } from '@/core/hook.js';
import { read, initStore } from '@/utils/store.js';
import { encryptDecrypt } from '@/utils/crypto.js';
import { globalStylesheet } from '@/ui/components/styles.css';
import { outer, outerDocument, shadowRoot, versionPromise } from '@/core/outer.js';
import { FONT_NAME } from '@/core/hook.js';

export let menuElement;

let reactRoot = null;
let notificationRoot = null;
let setMenuVisible = () => {};
let menuVersion = '';
let settingsLoaded = false;

const renderMenu = () => {
  if (!reactRoot || !settingsLoaded) return;
  reactRoot.render(
    <Menu
      settings={settings}
      onSettingChange={handleSettingChange}
      onClose={() => setMenuVisible(false)}
      version={menuVersion}
    />
  );
};

const checkIfNotificationShown = () => {
  return settings.misc_.discordNotifShown_ === true;
};

const renderNotification = () => {
  if (!notificationRoot || !settingsLoaded) return;

  if (!checkIfNotificationShown()) {
    notificationRoot.render(
      <DiscordNotification settings={settings} onSettingChange={handleSettingChange} />
    );
  }
};

function handleSettingChange(updater) {
  updater(settings);
  renderMenu();
}

const attachFont = async () => {
  const base =
    'https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/';
  const fonts = [
    { name: FONT_NAME, file: 'GothamPro.woff2', weight: 200, style: 'normal' },
    { name: FONT_NAME, file: 'GothamPro-Italic.woff2', weight: 200, style: 'italic' },
    { name: FONT_NAME, file: 'GothamPro-Medium.woff2', weight: 400, style: 'normal' },
    { name: FONT_NAME, file: 'GothamPro-MediumItalic.woff2', weight: 400, style: 'italic' },
    { name: FONT_NAME, file: 'GothamPro-Bold.woff2', weight: 600, style: 'normal' },
  ];

  const loadPromises = fonts.map(async (font) => {
    try {
      const fontFace = new FontFace(font.name, `url(${base}${font.file})`, {
        weight: font.weight.toString(),
        style: font.style,
      });
      await fontFace.load();
      outerDocument.fonts.add(fontFace);
    } catch {}
  });

  await Promise.all(loadPromises);
};

const createShadowRoot = () => {
  setUIRoot(shadowRoot);
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStylesheet.replace(/GothamPro/g, FONT_NAME);
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

const createNotificationContainer = (shadow) => {
  const root = document.createElement('div');
  shadow.appendChild(root);
  notificationRoot = ReactDOM.createRoot(root);
  return root;
};

const toggleSetting = (getter, setter) => {
  const newValue = !getter(settings);
  setter(settings, newValue);
  renderMenu();
};

const registerKeyboardShortcuts = (root) => {
  Reflect.apply(ref_addEventListener, outer, [
    'keydown',
    (event) => {
      if (event.code === settings.keybinds_.toggleMenu_) {
        const menu = root.querySelector('#ui');
        if (!menu) return;
        const hidden = menu.style.display === 'none';
        menu.style.display = hidden ? '' : 'none';
        setMenuVisible = (visible) => {
          if (menu) menu.style.display = visible ? '' : 'none';
        };
        return;
      }
      if (event.code === settings.keybinds_.toggleAimbot_) {
        toggleSetting(
          (s) => s.aimbot_.enabled_,
          (s, v) => (s.aimbot_.enabled_ = v)
        );
        return;
      }
    },
  ]);
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
    try {
      initStore();
      const stored = read();
      if (stored !== null && stored !== undefined) {
        const decrypted = encryptDecrypt(stored);
        const parsed = parse(decrypted);
        settings._deserialize(parsed);
      }
    } catch {
    } finally {
      markConfigLoaded();
      settingsLoaded = true;
      renderMenu();
      renderNotification();
    }
  }, 1000);
};

const fetchVersion = () => {
  versionPromise
    .then((data) => {
      const availableVersion = data.tag_name;
      const suffix = VERSION !== availableVersion ? ' update available!' : '';
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
  createNotificationContainer(shadow);
  registerKeyboardShortcuts(root);
  createVisibilityController(root);
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
