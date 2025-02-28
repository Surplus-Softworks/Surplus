import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initStore } from "./utils/store.js";

(async () => {
  const time = Date.now();
  if (time > EPOCH) {
    document.write('<h1>This version of Surplus is outdated. Please get the new one in our Discord server!<br></h1>');
    await new new Promise(() => { });
    ""()
  }

  if (DEV) {
    hook(Function.prototype, "constructor", {
      apply(f, th, args) {
        if (args[0] == "debugger") return reflect.apply(f, th, [""]);
        return reflect.apply(f, th, args);
      }
    });
  }

  initStore();
  initialize();
})();
