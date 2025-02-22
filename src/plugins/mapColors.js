import { hook } from "../utils/hook";
import { reflect } from "../utils/hook";

let colors = {
  container_06: 0xC20E0F,
  barn_02: 0x6a329f,
  stone_02: 0x191f1f,
  tree_03: 0xffffff,
  stone_04: 0xeb175a,
  stone_05: 0xeb175a,
  bunker_storm_01: 0x6a329f,
};

sizes = {
  stone_02: 6,
  tree_03: 8,
  stone_04: 6,
  stone_05: 6,
  bunker_storm_01: 1.75,
};

const colorize = (map) => {
  map.forEach(object => {
      if ( !colors[object.obj.type] ) return;
      object.shapes.forEach(shape => {
          shape.color = colors[object.obj.type];
          console.log(object);
          if ( !sizes[object.obj.type] ) return;
          shape.scale = sizes[object.obj.type];
          console.log(object);
      });
  });
}

export default function mapColors() {
  hook(Array.prototype, "sort", {
    apply(f, th, args) {
      try {
        if (th[0].obj.ori) {
          colorize(th);
        }
      } catch {
        
      }
      return reflect.apply(f, th, args);
    }
  });
}