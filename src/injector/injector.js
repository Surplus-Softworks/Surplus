import { state } from "../index.js";
import { hook, reflect } from "./hook.js";

export function inject(oninject) {
    hook(Function.prototype, "bind", {
        apply(f, th, args) {
            try {
                if (args[0]?.nameInput != null) {
                    state.gameManager = args[0];
                    oninject();
                }
            } catch {}
            return Reflect.apply(f,th,args);
        }
    })
}