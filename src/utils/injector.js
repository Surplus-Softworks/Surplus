import { hook, reflect } from "./hook.js";

export let gameManager;
export let jQuery;

export function inject(oninject) {
    hook(Function.prototype, "bind", {
        apply(f, th, args) {
            try {
                if (args[0]?.nameInput != null && args[0]?.game != null) {
                    Function.prototype.bind = f;
                    gameManager = args[0];
                    window.gameManager = gameManager;
                    oninject();
                }
            } catch { }
            return reflect.apply(f, th, args);
        }
    });
    hook(Function.prototype, "call", {
        apply(f, th, args) {
            try {
                if (args[0].constructor.ajax != null) {
                    Function.prototype.call = f;
                    jQuery = args[0].constructor;
                }
            } catch { }
            return reflect.apply(f,th,args);
        }
    });
}
