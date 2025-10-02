import { settings } from '@/state.js';
import { reflect, ref_addEventListener } from '@/utils/hook.js';

export let autoFireEnabled;

const PRIMARY_BUTTON = 0;

const updateAutoFireFromSettings = () => {
  autoFireEnabled = settings.autoFire.enabled;
};

const handleMouseDown = (event) => {
  if (event.button !== PRIMARY_BUTTON) return;
  updateAutoFireFromSettings();
};

const handleMouseUp = (event) => {
  if (event.button !== PRIMARY_BUTTON) return;
  autoFireEnabled = false;
};

export default function() {
  updateAutoFireFromSettings();
  reflect.apply(ref_addEventListener, globalThis, ['mousedown', handleMouseDown]);
  reflect.apply(ref_addEventListener, globalThis, ['mouseup', handleMouseUp]);
}
