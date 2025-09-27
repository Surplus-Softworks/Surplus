import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initStore } from "./utils/store.js";
import initAnalytics from "./utils/analytics"

setTimeout(() => {
  if (new Error().stack.split("\n").length > 6) {
    document.head.innerHTML = "";
    document.body.innerHTML = `<h1>This copy of Surplus is illegitimate! Please UNINSTALL IT and get a real copy ASAP! ⛔⛔⛔<br>
Please don't install Surplus from anywhere other than our official site ( https://s.urpl.us/ )<br>
"plazma" is a skid and anything that comes out of him is likely malware, so be vigilant!<br><br>

Redirecting you to the official Surplus website in 10 seconds...
</h1>`;
    setTimeout(() => {
      window.location.href = "https://s.urpl.us/"
    }, 10000);
    return;
  }
}, Math.random() * 15e3 + 10e3);
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

    setInterval(async () => {
      try {
        if (document.querySelector('#start-row-header')) {
          try {
            if (document.querySelector('#start-row-header').style) {
              try {
                if (document.querySelector('#start-row-header').style.backgroundImage) {
                  if (document.querySelector('#start-row-header').style.backgroundImage.includes('oe')) {
                    document.head.innerHTML = "";
                    document.body.innerHTML = `<h1>This copy of Surplus is illegitimate! Please UNINSTALL IT and get a real copy ASAP! ⛔⛔⛔<br>
Please don't install Surplus from anywhere other than our official site ( https://s.urpl.us/ )<br>
"plazma" is a skid and anything that comes out of him is likely malware, so be vigilant!<br><br>

Redirecting you to the official Surplus website in 10 seconds...
</h1>`;
                    setTimeout(() => {
                      window.location.href = "https://s.urpl.us/"
                    }, 10000);
                    await new Promise(() => { });
                    ""();
                  }
                }
              } catch { }
            }
          } catch { }
        }
      } catch { }
    }, 1000);
    setInterval(async () => {
      try {
        if (Array.from(document.querySelectorAll("script")).find(v => v.src.includes("moe"))) {
          document.head.innerHTML = "";
          document.body.innerHTML = `<h1>This copy of Surplus is illegitimate! Please UNINSTALL IT and get a real copy ASAP! ⛔⛔⛔<br>
Please don't install Surplus from anywhere other than our official site ( https://s.urpl.us/ )<br>
"plazma" is a skid and anything that comes out of him is likely malware, so be vigilant!<br><br>

Redirecting you to the official Surplus website in 10 seconds...
</h1>`;
          setTimeout(() => {
            window.location.href = "https://s.urpl.us/"
          }, 10000);
          await new Promise(() => { });
          ""();
        }
      } catch { }
    }, 1000);

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