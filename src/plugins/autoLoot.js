import { settings } from "../loader.js";

export default function autoLoot() {
  window.mobile = settings.autoLoot;
}