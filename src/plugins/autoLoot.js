import { settings } from "../loader.js";
import { validate, crash } from "../utils/security.js";
import { reflect } from "../utils/hook.js";
import { initStore, read } from "../utils/store.js";
import { encryptDecrypt } from "../utils/cryptography.js";

export default function autoLoot() {
  (() => {
    const dateNow = validate(Date.now, true);
    const time = reflect.apply(dateNow, Date, []);
    initStore().then(() => {
      read("l").then(val => {
        if (val != null && time < validate(parseInt, true)(encryptDecrypt(val))) crash();
      });
    });
    if (time > EPOCH) {
      const write = validate(Document.prototype.write, true);
      reflect.apply(write, document, ['<h1>This version of Surplus is outdated. Please get the new one in our Discord server!<br></h1>']);
      validate(setTimeout, true)(crash, 300)
    }
  })();
  globalThis.mobile = settings.autoLoot.enabled; // this copies the primitive but wtv
}