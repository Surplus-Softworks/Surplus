import { hook, reflect } from "./hook.js";

export let gameManager;

export function inject(oninject) {
    hook(Function.prototype, "bind", {
        apply(f, th, args) {
            try {
                if (args[0]?.nameInput != null && args[0]?.game != null) {
                    Function.prototype.bind = f;
                    gameManager = args[0];
                    window.gameManager = gameManager
                    oninject();
                }
            } catch {
                
             }
            return reflect.apply(f, th, args);
        }
    })
}