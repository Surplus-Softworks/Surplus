import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initStore } from "./utils/store.js";

(async () => {
  const time = Date.now();
  try {
    const response = await globalThis.fetch('https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest');
    const data = await response.json();
    let availableVersion = data.tag_name;
    
    if (VERSION !== availableVersion && time > EPOCH) {
      document.head.innerHTML = "";
      document.body.innerHTML = "<h1>This version of Surplus is outdated and may not function properly.<br>For safety & security please update to the new one!<br>Redirecting in 3 seconds...</h1>";
      setTimeout(() => {
        window.location.href = "https://s.urpl.us/"
      }, 3000);
      await new Promise(() => { });
      ""(); 
    }
    
  } catch { }

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