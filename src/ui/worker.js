import React from 'react';
import ReactDOM from 'react-dom/client';
import Menu from '@/ui/components/Menu.jsx';
import { defaultSettings, settings, setUIRoot, markConfigLoaded } from '@/state/settings.js';
import { object, reflect, ref_addEventListener } from '@/utils/hook.js';
import { read } from '@/utils/store.js';
import { encryptDecrypt } from '@/utils/encryption.js';
import { globalStylesheet } from '@/ui/components/globalStyles.js';

let uiShadow;
export let menuElement;

// React state management
let reactRoot = null;
let currentSettings = {};
let setMenuVisible = null;
let menuVersion = '';

const updateReactUI = () => {
  if (reactRoot && currentSettings) {
    reactRoot.render(
      <Menu
        settings={currentSettings}
        onSettingChange={handleSettingChange}
        onClose={() => setMenuVisible(false)}
        version={menuVersion}
      />
    );
  }
};

const handleSettingChange = (path, value) => {
  const keys = path.split('.');
  let current = settings;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;

  // Update local state for React
  let currentLocal = currentSettings;
  for (let i = 0; i < keys.length - 1; i++) {
    currentLocal = currentLocal[keys[i]];
  }
  currentLocal[keys[keys.length - 1]] = value;

  updateReactUI();
};

function buildUI() {
  const parse = JSON.parse;

  // Add Gotham font to main document head
  const link = document.createElement('link');
  link.href = 'https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/gotham.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // Create container with Shadow DOM
  const div = document.createElement('div');
  const shadow = div.attachShadow({ mode: 'closed' });
  uiShadow = shadow;
  setUIRoot(shadow);
  document.body.appendChild(div);

  // Inject global styles into shadow DOM
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStylesheet;
  shadow.appendChild(styleElement);

  // Create root container for React
  const rootContainer = document.createElement('div');
  shadow.appendChild(rootContainer);

  // Initialize React root
  reactRoot = ReactDOM.createRoot(rootContainer);
  menuElement = rootContainer;

  // Setup keyboard shortcuts
  reflect.apply(ref_addEventListener, globalThis, ["keydown", (event) => {
    const menuDiv = rootContainer.querySelector('#ui');

    switch (event.code) {
      case "ShiftRight":
        if (menuDiv) {
          const isVisible = menuDiv.style.display !== 'none';
          menuDiv.style.display = isVisible ? 'none' : '';
          setMenuVisible = (visible) => {
            if (menuDiv) {
              menuDiv.style.display = visible ? '' : 'none';
            }
          };
        }
        break;
      case "KeyB":
        settings.aimbot.enabled = !settings.aimbot.enabled;
        currentSettings.aimbot.enabled = settings.aimbot.enabled;
        updateReactUI();
        break;
      case "KeyH":
        settings.spinbot.enabled = !settings.spinbot.enabled;
        currentSettings.spinbot.enabled = settings.spinbot.enabled;
        updateReactUI();
        break;
    }
  }]);

  // Initialize visibility toggle
  setMenuVisible = (visible) => {
    const menuDiv = rootContainer.querySelector('#ui');
    if (menuDiv) {
      menuDiv.style.display = visible ? '' : 'none';
    }
  };

  const readConfig = (config, mapping = currentSettings, settingsMapping = settings) => {
    if (!config || typeof config !== "object") return;
    object.entries(config).forEach(([key, value]) => {
      if (value && typeof value === "object" && mapping && mapping[key]) {
        readConfig(value, mapping[key], settingsMapping[key]);
      } else if (typeof value === typeof mapping[key]) {
        mapping[key] = value;
        if (settingsMapping && settingsMapping[key] !== undefined) {
          settingsMapping[key] = value;
        }
      }
    });
  };

  // Deep clone default settings for React state
  const cloneSettings = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    const clone = {};
    object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        clone[key] = cloneSettings(value);
      } else {
        clone[key] = value;
      }
    });
    return clone;
  };

  currentSettings = cloneSettings(defaultSettings);

  setTimeout(() => {
    readConfig(defaultSettings);
    read("c")
      .then(v => !v ? defaultSettings : parse(encryptDecrypt(v)))
      .then(config => {
        readConfig(config);
        markConfigLoaded();
        updateReactUI();
      });
  }, 1000);

  // Fetch version from GitHub
  globalThis.fetch('https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest')
    .then(response => response.json())
    .then(response => {
      let availableVersion = response.tag_name;
      let message = VERSION !== availableVersion ? " (update available!)" : "";
      menuVersion = VERSION + message;
      updateReactUI();
    })
    .catch(() => {
      menuVersion = VERSION;
      updateReactUI();
    });

  // Initial render
  updateReactUI();
}

export default function() {
  if (document.readyState === "loading") {
    reflect.apply(ref_addEventListener, document, ["DOMContentLoaded", () => {
      buildUI();
    }]);
  } else {
    buildUI();
  }
}
