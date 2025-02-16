import { settings } from "../loader.js";

export let autoFireEnabled;

export default function autoFire() {
  autoFireEnabled = settings.autoFire; // copied primitive

  window.addEventListener("mousedown", (event) => {
    if (event.button === 0) autoFireEnabled = true;
  });
  window.addEventListener("mouseup", (event) => {
    if (event.button === 0) autoFireEnabled = false;
  });
}
