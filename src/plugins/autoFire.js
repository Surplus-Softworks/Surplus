import { settings } from "../loader.js";
import { validate } from "../utils/security.js";

export let autoFireEnabled;

export default function autoFire() {
  autoFireEnabled = settings.autoFire.enabled; // copied primitive

  window.addEventListener("mousedown", (event) => {
    if (event.button === 0) autoFireEnabled = settings.autoFire.enabled;
  });
  window.addEventListener("mouseup", (event) => {
    if (event.button === 0) autoFireEnabled = false;
  });
}
