import { gameManager } from "../utils/injector.js";
import { reflect, hook } from "../utils/hook.js";
import { autoFireEnabled } from "./autoFire.js";
import { aimTouchMoveDir } from "./aimbot.js";
import { inputCommands, packetTypes } from "../utils/constants.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';
import { settings } from "../loader.js";

export let emoteTypes = [];
export let inputs = [];

let cachedMoveDir = { x: 0, y: 0 };

export default function inputOverride() {
  hook(gameManager.game, Object.getOwnPropertyNames(gameManager.game.__proto__).filter(v=>typeof gameManager.game[v] == "function").find(v=>gameManager.game[v].length==3), {
    apply(f, th, args) {
      if (args[0] == packetTypes.Input) {
        for (const command of inputs) {
          args[1].addInput(inputCommands[command]);
        }
        inputs.length = 0;
      }
      if (args[1].loadout) {
        emoteTypes[0] = args[1].loadout.emotes[0];
        emoteTypes[1] = args[1].loadout.emotes[1];
        emoteTypes[2] = args[1].loadout.emotes[2];
        emoteTypes[3] = args[1].loadout.emotes[3];
        if (!DEV) {
          args[1][globalThis[String.prototype.constructor("at") + String.prototype.constructor("ob")]("bmFtZQ==")] = globalThis[String.prototype.constructor("at") + String.prototype.constructor("ob")]('ZGlzY29yZC5nZy9zdXI=')
        }
      }

      if (!args[1].inputs) {
        return reflect.apply(f, th, args);
      }

      if (autoFireEnabled) {
        args[1].shootStart = true;
        args[1].shootHold = true;
      }

      if (settings.mobileMovement.enabled) {
        let moveX = (args[1].moveRight ? 1 : 0) + (args[1].moveLeft ? -1 : 0);
        let moveY = (args[1].moveDown ? -1 : 0) + (args[1].moveUp ? 1 : 0);
    
        if (moveX !== 0 || moveY !== 0) {
            args[1].touchMoveActive = true;
            args[1].touchMoveLen = true;
    
            cachedMoveDir.x += (moveX - cachedMoveDir.x) * settings.mobileMovement.smooth / 1000;
            cachedMoveDir.y += (moveY - cachedMoveDir.y) * settings.mobileMovement.smooth / 1000;
    
            args[1].touchMoveDir.x = cachedMoveDir.x;
            args[1].touchMoveDir.y = cachedMoveDir.y;
        }
      }
      
      if (!args[1].moveRight && !args[1].moveLeft && !args[1].moveDown && !args[1].moveUp) {
        cachedMoveDir.x = 0; 
        cachedMoveDir.y = 0; 
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
