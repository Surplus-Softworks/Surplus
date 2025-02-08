if (!(window.location.href.includes('surv'))) {
  (async () => await new Promise(() => { }))();
}

import { initScripts } from "./cheats.js";
import * as utils from "./utils.js";

//* 
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
import { hook, reflect } from "./injector/hook.js";
//*/

hook(Function.prototype, "constructor", {
  apply(f, th, args) {
    if (args[0] == "debugger") return reflect.apply(f, th, [""]);
    return reflect.apply(f, th, args);
  }
});

initScripts();