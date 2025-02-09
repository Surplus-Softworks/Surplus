import { hook, reflect } from "./hook.js";

export let gameManager;

export function inject(oninject) {
    hook(Function.prototype, "bind", {
        apply(f, th, args) {
            try {
                if (args[0]?.nameInput != null) {
                    gameManager = args[0];
                    oninject();
                }
            } catch { }
            return reflect.apply(f, th, args);
        }
    })
}