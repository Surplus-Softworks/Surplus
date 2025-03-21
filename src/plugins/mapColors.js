import { hook } from "../utils/hook";
import { reflect } from "../utils/hook";
import { tr } from '../utils/obfuscatedNameTranslator.js';
import { settings } from "../loader.js";

let colors = {
  container_06: 0xd6c313,
  barn_01: 0x6a329f,
  stone_02: 0x191f1f,
  tree_03: 0xffffff,
  stone_04: 0xeb175a,
  stone_05: 0xeb175a,
  crate_03: 0x51855d,
  bunker_storm_01: 0x6a329f,
  bunker_hydra_01: 0x990dd2,

  bunker_crossing_stairs_01b: 0xcf149a,
  bunker_crossing_stairs_01: 0xcf149a,
};

let sizes = {
  container_06: 1,
  stone_02: 6,
  tree_03: 8,
  barn_01: 1,
  stone_04: 6,
  stone_05: 6,
  crate_03: 1.8,
  bunker_storm_01: 1.75,
  bunker_hydra_01: 1.75,

  bunker_crossing_stairs_01b: 2,
  bunker_crossing_stairs_01: 2,
};

const colorize = (map) => {
  map.forEach(object => {
    if (settings.mapHighlights.smallerTrees) {
      object.shapes.forEach(shape => {
        if (object.obj.type.includes("tree")) {
          shape.scale = 1.8
        };
      });
    }
    if (!colors[object.obj.type]) return;
    object.shapes.forEach(shape => {
      if (!sizes[object.obj.type]) return;
      shape.color = colors[object.obj.type];
      shape.scale = sizes[object.obj.type];
      object.zIdx = 999
    });
  });
}

export default function mapColors() {
  hook(Array.prototype, "sort", {
    apply(f, th, args) {
      try {
        if (th.some(v=>v?.obj?.ori != null) && settings.mapHighlights.enabled) {
          colorize(th);
        }
      } catch {

      }
      return reflect.apply(f, th, args);
    }
  });
}