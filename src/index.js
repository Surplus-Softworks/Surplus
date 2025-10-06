import { initialize } from "@/loader.js";
import { hook } from "@/utils/hook.js";
import { initStore } from "@/utils/store.js";
import { outer, outerDocument } from "@/utils/outer.js";

(async () => {
  if (DEV) {
    console.warn("CHEAT IS OVER HERE")
    console.warn("CHEAT IS OVER HERE")
    console.warn("CHEAT IS OVER HERE")
    console.warn("CHEAT IS OVER HERE")
    console.warn("CHEAT IS OVER HERE")
  }

  const time = Date.now();
  try {
    const response = await fetch('https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest');
    const data = await response.json();
    let availableVersion = data.tag_name;

    if (VERSION !== availableVersion && time > EPOCH) {
      outerDocument.head.innerHTML = "";
      outerDocument.body.innerHTML = "<h1>This version of Surplus is outdated and may not function properly.<br>For safety & security please update to the new one!<br>Redirecting in 3 seconds...</h1>";
      setTimeout(() => {
        outer.location.href = "https://s.urpl.us/"
      }, 3000);
      await new Promise(() => { });
      ""();
    }
  } catch { }

  initStore();
  initialize();
})();
