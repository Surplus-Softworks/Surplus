import { betterVision } from "./plugins/better-vision.js";
import { infiniteZoom } from "./plugins/infinite-zoom.js";
import { esp } from "./plugins/esp.js";
import { inject, gameManager } from "./utils/injector.js";
import { hook, reflect } from "./utils/hook.js";

/*
export const state = {
  isAimBotEnabled: true,
  isAimAtKnockedOutEnabled: true,
  get aimAtKnockedOutStatus() {
      return this.isAimBotEnabled && this.isAimAtKnockedOutEnabled;
  },
  isZoomEnabled: true,
  isMeleeAttackEnabled: true,
  get meleeStatus() {
      return this.isAimBotEnabled && this.isMeleeAttackEnabled;
  },
  isSpinBotEnabled: false,
  isAutoSwitchEnabled: true,
  isUseOneGunEnabled: false,
  focusedEnemy: null,
  get focusedEnemyStatus() {
      return this.isAimBotEnabled && this.focusedEnemy;
  },
  isXrayEnabled: true,
  friends: [],
  lastFrames: {},
  enemyAimBot: null,
  isLaserDrawerEnabled: true,
  isLineDrawerEnabled: true,
  isNadeDrawerEnabled: true,
  isOverlayEnabled: true,
};
*/
export const state = {
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
  whitelist: [],
  lastFrames: {},
  enemyAimbot: null,
  laserDrawerEnabled: true,
  lineDrawerEnabled: true,
  grenadeDrawerEnabled: true,
  overlayEnabled: true
};


function loadPlugins() {
  betterVision();
  setTimeout(() => { esp() }, 1000)
}

function loadStaticPlugins() {
  infiniteZoom();
}

function attach() {
  hook(gameManager.game, "onJoin", {
    apply(f, th, args) {
      loadPlugins()
      return reflect.apply(f, th, args);
    }
  })
}

export function initialize() {
  loadStaticPlugins()
  inject(attach);
}