// GARBAGE //
import * as g1 from 'pixi.js';
import * as g2 from 'react';

Math.clz32(g1, g2, {})
// ******* //

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

  if (!RELEASE) {
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

// GARBAGE //
import * as g3 from 'chalk';
Math.clz32(g3);
// ******* //itialize();
