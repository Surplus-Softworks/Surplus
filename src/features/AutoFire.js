import { settings } from '@/core/state.js';
import { ref_addEventListener } from '@/core/hook.js';
import { outer } from '@/core/outer';

export let autoFireEnabled;

const PRIMARY_BUTTON = 0;

const update = () => {
  autoFireEnabled = settings.autoFire_.enabled_;
};

const handleMouseDown = (event) => {
  if (event.button !== PRIMARY_BUTTON) return;
  update();
};

const handleMouseUp = (event) => {
  if (event.button !== PRIMARY_BUTTON) return;
  autoFireEnabled = false;
};

export default function () {
  update();
  Reflect.apply(ref_addEventListener, outer, ['mousedown', handleMouseDown]);
  Reflect.apply(ref_addEventListener, outer, ['mouseup', handleMouseUp]);
}
