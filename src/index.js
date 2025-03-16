import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initStore } from "./utils/store.js";

(async () => {
  const time = Date.now();
  if (time > EPOCH) {
    document.write('<h1>This version of Surplus is outdated and may not function properly.<br>For safety & security please update to the new one!<br>Redirecting in 5 seconds...</h1>');
    setTimeout(()=>{
      window.location.href = "https://s.urpl.us/"
    }, 5000)
    await new Promise(() => { });
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
