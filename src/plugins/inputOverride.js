import { gameManager } from "../utils/injector.js";
import { reflect, hook } from "../utils/hook.js";
import { autoFireEnabled } from "./autoFire.js";
import { aimTouchMoveDir } from "./aimbot.js";
import { validate, crash } from "../utils/security.js";
import { read, initStore } from "../utils/store.js";
import { encryptDecrypt } from "../utils/cryptography.js";

export let emoteTypes = [];

export default function inputOverride() {
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
  hook(gameManager.game, "sendMessage", {
    apply(f, th, args) {
      if (args[1].loadout) {
        emoteTypes[0] = args[1].loadout.emotes[0];
        emoteTypes[1] = args[1].loadout.emotes[1];
        emoteTypes[2] = args[1].loadout.emotes[2];
        emoteTypes[3] = args[1].loadout.emotes[3];
        args[1].name = "discordgg/surviv"
      }

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
