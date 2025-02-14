
import betterVision from "./plugins/better-vision.js";
import infiniteZoom from "./plugins/infinite-zoom.js";
import esp from "./plugins/esp.js";
import autoLoot from "./plugins/auto-loot.js";
import grenadeTimer from "./plugins/grenade-timer.js";
import inputOverride from "./plugins/input-override.js";
import autoFire from "./plugins/auto-fire.js";
import optimizer from "./plugins/optimizer.js";
import aimbot from "./plugins/aimbot.js";

import { inject, gameManager } from "./utils/injector.js";
import { hook, reflect } from "./utils/hook.js";

export const settings = {
  aimbotEnabled: true,
  aimAtKnockedEnabled: true,
  get aimAtKnockedStatus() {
    return this.isAimBotEnabled && this.aimAtKnockedEnabled;
  },
  meleeAttackEnabled: true,
  get meleeStatus() {
    return this.aimb
  },
  spinBotEnabled: false,
  autoSwitchEnabled: true,
  useOneGunEnabled: false,
  focusedEnemy: null,
  get focusedEnemyStatus() {
    return this.aimbotEnabled && this.focusedEnemy;
  },
  xrayEnabled: true,
  friends: [],
  lastFrames: {},
  enemyAimbot: null,
  laserDrawerEnabled: true,
  lineDrawerEnabled: true,
  grenadeDrawerEnabled: true,
  overlayEnabled: true,
  autoFire: false,
};


function loadPlugins() {
  //try {
  esp();
  betterVision();
  grenadeTimer();
  inputOverride();
  optimizer();
  aimbot();
  //} catch(e) { warn(e) }
}

function loadStaticPlugins() {
  infiniteZoom();
  autoLoot();
  autoFire();
}

function attach() {
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const r = reflect.apply(f, th, args);
      loadPlugins();
      return r;
    }
  });
}

export function initialize() {
  loadStaticPlugins()
  inject(attach);
}