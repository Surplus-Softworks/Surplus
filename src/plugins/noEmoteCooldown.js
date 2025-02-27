import { object } from "../utils/hook";
import { gameManager } from "../utils/injector";

export default function noEmoteCooldown() {
    object.defineProperty(gameManager.game.emoteBarn, "emoteCounter", {
        get() {
            return 1;
        },
        set(v) {

        }
    });
}