import { settings } from "@/state/settings.js";
import { reflect } from "@/utils/hook.js";
import { ref_addEventListener } from "@/utils/hook.js";
import { tr } from '@/utils/obfuscatedNameTranslator.js';

export let autoFireEnabled;

export default function() {
  autoFireEnabled = settings.autoFire.enabled;

  reflect.apply(ref_addEventListener, globalThis, ["mousedown", (event) => {
    if (event.button === 0) autoFireEnabled = settings.autoFire.enabled;
  }]);

  reflect.apply(ref_addEventListener, globalThis, ["mouseup", (event) => {
    if (event.button === 0) autoFireEnabled = false;
  }]);
}