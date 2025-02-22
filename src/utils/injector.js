import { hook, reflect } from "./hook.js";

export let gameManager;
export let jQuery;

export function injectGame(oninject) {
    hook(Function.prototype, "bind", {
        apply(f, th, args) {
            try {
                if (args[0]?.nameInput != null && args[0]?.game != null) {
                    Function.prototype.bind = f;
                    gameManager = args[0];
                    if (!RELEASE) {
                        window.gameManager = gameManager;
                    }
                    oninject();
                }
            } catch { }
            return reflect.apply(f, th, args);
        }
    });
}

export function injectjQuery(oninject) {
    hook(Function.prototype, "call", {
        apply(f, th, args) {
            try {
                if (args[0].constructor.ajax != null) {
                    Function.prototype.call = f;
                    jQuery = args[0].constructor;
                    oninject();
                }
            } catch { }
            return reflect.apply(f,th,args);
        }
    });
}