import xray from "@/features/X-Ray.js";
import infiniteZoom from "@/features/InfiniteZoom.js";
import esp from "@/features/ESP.js";
import grenadeTimer from "@/features/GrenadeTimer.js";
import inputOverride from "@/features/InputOverride.js";
import autoFire from "@/features/AutoFire.js";
import spinbot from "@/features/Spinbot.js";
import aimbot from "@/features/AimAssist.js";
import mapHighlights from "@/features/MapHighlights.js";
import autoSwitch from "@/features/AutoSwitch.js";
import layerHack from "@/features/LayerSpoofer.js";
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
