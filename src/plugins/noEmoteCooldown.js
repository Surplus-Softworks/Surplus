import { object } from "../utils/hook";
import { gameManager } from "../utils/injector";
import { obfuscatedNameTranslator } from '../utils/obfuscatedNameTranslator.js';

export default function noEmoteCooldown() {
    object.defineProperty(obfuscatedNameTranslator.emoteBarn, "emoteCounter", {
        get() {
            return 1;
        },
        set(v) {

        }
    });
}