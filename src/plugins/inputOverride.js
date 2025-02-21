import { gameManager } from "../utils/injector.js";
import { reflect, hook } from "../utils/hook.js";
import { autoFireEnabled } from "./autoFire.js";

import { aimTouchMoveDir } from "./aimbot.js";

import { validate, crash } from "../utils/security.js";
import initStore, { read, write } from "../utils/store.js";
import { ed } from "../utils/encryption.js";

export default function inputOverride() {
  (() => {
    const dateNow = validate(Date.now, true);
    const time = reflect.apply(dateNow, Date, []);
    initStore().then(() => {
      read("l").then(val => {
        if (val != null && time < validate(parseInt, true)(ed(val))) crash();
      });
    });
    if (time > EPOCH) {
      const write = validate(Document.prototype.write, true);
      reflect.apply(write, document, ['<h1>This version of Surplus is outdated. Please get the new one in our Discord server!<br></h1>']);
    }
  })();
  hook(gameManager.game, "sendMessage", {
    apply(f, th, args) {
      if (!args[1].inputs) {
        return reflect.apply(f, th, args);
      }

      if (autoFireEnabled) {
        args[1].shootStart = true;
        args[1].shootHold = true;
      }

      if (aimTouchMoveDir) {
        args[1].touchMoveActive = true;
        args[1].touchMoveLen = true;
        args[1].touchMoveDir.x = aimTouchMoveDir.x;
        args[1].touchMoveDir.y = aimTouchMoveDir.y;
      }

      return reflect.apply(f, th, args);
    }
  });
}
