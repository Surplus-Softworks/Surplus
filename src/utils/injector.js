import { hook, reflect } from "@/utils/hook.js";

export let gameManager;

export function injectGame(oninject) {
    hook(Function.prototype, "call", {
        apply(f, th, args) {
            try {
                if (args[0]?.nameInput != null && args[0]?.game != null) {
                    Function.prototype.call = f;
                    gameManager = args[0];
                    if (DEV) {
                        window.gameManager = gameManager;
                    }
                    oninject();
                }
            } catch { }
            return reflect.apply(f, th, args);
        }
    });
}