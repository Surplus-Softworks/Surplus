if (!(window.location.href.includes('surv'))) {
  (async () => await new Promise(() => { }))();
}

window.log = console.log

import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";

//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
/////////////////////////////

hook(Function.prototype, "constructor", {
  apply(f, th, args) {
    if (args[0] == "debugger") return reflect.apply(f, th, [""]);
    return reflect.apply(f, th, args);
  }
});

initialize();