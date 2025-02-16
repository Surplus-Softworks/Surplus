//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
const r1=g1
const r2=g2
const r3=g3
/////////////////////////////

window.log = console.log;
window.warn = console.warn;

import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";

hook(Function.prototype, "constructor", {
  apply(f, th, args) {
    if (args[0] == "debugger") return reflect.apply(f, th, [""]);
    return reflect.apply(f, th, args);
  }
});

initialize();