import { settings } from "../loader.js";
import { validate } from "../utils/security.js";

export let autoFireEnabled;

const _addEventListener = validate(addEventListener, true);

export default function autoFire() {
  autoFireEnabled = settings.autoFire.enabled; // copied primitive

  _addEventListener("mousedown", (event) => {
    if (event.button === 0) autoFireEnabled = settings.autoFire.enabled;
  });
  _addEventListener("mouseup", (event) => {
    if (event.button === 0) autoFireEnabled = false;
  });
}
