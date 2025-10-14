import { hook } from '@/core/hook.js';
import { settings } from '@/core/state.js';
import { outer } from '@/core/outer.js';

const HIGHLIGHTS = {
  container_06: 0xd6c313,
  barn_01: 0x6a329f,
  stone_02: 0x191f1f,
  tree_03: 0xffffff,
  tree_03sp: 0x0000ff,
  stone_04: 0xeb175a,
  stone_05: 0xeb175a,
  crate_03: 0x51855d,
  bunker_storm_01: 0x6a329f,
  bunker_hydra_01: 0x990dd2,
  bunker_crossing_stairs_01b: 0xcf149a,
  bunker_crossing_stairs_01: 0xcf149a,
};

const SIZES = {
  container_06: 1,
  stone_02: 6,
  tree_03: 8,
  tree_03sp: 8,
  barn_01: 1,
  stone_04: 6,
  stone_05: 6,
  crate_03: 1.8,
  bunker_storm_01: 1.75,
  bunker_hydra_01: 1.75,
  bunker_crossing_stairs_01b: 2,
  bunker_crossing_stairs_01: 2,
};

const setTreeScale = (object) => {
  if (!settings.mapHighlights_.smallerTrees_) return;
  if (!object.obj.type.includes('tree')) return;
  object.shapes.forEach((shape) => {
    shape.scale = 1.8;
  });
};

const colorize = (map) => {
  map.forEach((object) => {
    setTreeScale(object);
    const color = HIGHLIGHTS[object.obj.type];
    const scale = SIZES[object.obj.type];
    if (!color || !scale) return;
    object.shapes.forEach((shape) => {
      shape.color = color;
      shape.scale = scale;
      object.zIdx = 999;
    });
  });
};

export default function () {
  hook(outer.Array.prototype, 'sort', {
    apply(original, context, args) {
      try {
        if (settings.mapHighlights_.enabled_ && context.some((entry) => entry?.obj?.ori != null)) {
          colorize(context);
        }
      } catch { }

      return Reflect.apply(original, context, args);
    },
  });
}
