import { settings } from "../loader.js";
import { reflect } from "../utils/hook.js";
import { ref_addEventListener } from "../utils/hook.js";

export let autoFireEnabled;

export default function autoFire() {
  autoFireEnabled = settings.autoFire.enabled;

  reflect.apply(ref_addEventListener, window, ["mousedown", (event) => {
    if (event.button === 0) autoFireEnabled = settings.autoFire.enabled;
  }]);

  reflect.apply(ref_addEventListener, window, ["mouseup", (event) => {
    if (event.button === 0) autoFireEnabled = false;
  }]);
}