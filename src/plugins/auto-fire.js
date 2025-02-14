import { settings } from "../loader.js";

export function autoFire() {
  window.addEventListener("mousedown", (event) => {
    if (event.button === 0) settings.autoFire = true;
  });
  window.addEventListener("mouseup", (event) => {
    if (event.button === 0) settings.autoFire = false;
  });
}
