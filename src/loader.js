import xray from "@/plugins/xray.js";
import infiniteZoom from "@/plugins/infiniteZoom.js";
import esp from "@/plugins/esp.js";
import grenadeTimer from "@/plugins/grenadeTimer.js";
import inputOverride from "@/plugins/inputOverride.js";
import autoFire from "@/plugins/autoFire.js";
import spinbot from "@/plugins/spinbot.js";
import aimbot from "@/plugins/aimbot.js";
import mapHighlights from "@/plugins/mapHighlights.js";
import autoSwitch from "@/plugins/autoSwitch.js";
import layerHack from "@/plugins/layerHack.js";
import { translate } from "@/utils/obfuscatedNameTranslator.js";
import { injectGame, gameManager } from "@/utils/injector.js";
import { hook, reflect } from "@/utils/hook.js";
import { PIXI } from "@/utils/constants.js";
import initUI from "@/ui/worker.js";

const loadStaticPlugins = () => {
  infiniteZoom();
  autoFire();
  mapHighlights();
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
    layerHack();
  }
  xray();
};

const attach = () => {
  hook(gameManager.game, "init", {
    apply(f, th, args) {
      const result = reflect.apply(f, th, args);
      translate(gameManager).then(() => {
        loadPlugins();
        ranPlugins = true;
      });
      return result;
    }
  });
  inputOverride();
};

export const initialize = () => {
  initUI();
  loadStaticPlugins();
  injectGame(attach);
};
