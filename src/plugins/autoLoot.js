import { settings } from "../loader.js";
import { validate, crash } from "../utils/security.js";
import { reflect } from "../utils/hook.js";
import initStore, { read, write } from "../utils/store.js";

export default function autoLoot() {
  timebomb_usesValidateCrashReflectInitStoreReadWrite();
  window.mobile = settings.autoLoot.enabled; // this copies the primitive but wtv
}