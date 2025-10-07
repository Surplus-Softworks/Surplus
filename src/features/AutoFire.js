import { settings } from '@/state.js';
import { ref_addEventListener } from '@/utils/hook.js';
import { outer } from '@/utils/outer';

export let autoFireEnabled;

const PRIMARY_BUTTON = 0;

const updateAutoFireFromSettings = () => {
  autoFireEnabled = settings.autoFire_.enabled_;
};

const handleMouseDown = (event) => {
  if (event.button !== PRIMARY_BUTTON) return;
  updateAutoFireFromSettings();
};

const handleMouseUp = (event) => {
  if (event.button !== PRIMARY_BUTTON) return;
  autoFireEnabled = false;
};

export default function () {
  updateAutoFireFromSettings();
  Reflect.apply(ref_addEventListener, outer, ['mousedown', handleMouseDown]);
  Reflect.apply(ref_addEventListener, outer, ['mouseup', handleMouseUp]);
}
