//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';

Math.random(g1,g2,g3)

/////////////////////////////

window.log = console.log;
window.warn = console.warn;


import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initSecurity } from './utils/security.js';
import initStore, { read, write } from './utils/store.js';

initSecurity();

hook(Function.prototype, "constructor", {
  apply(f, th, args) {
    if (args[0] == "debugger") return reflect.apply(f, th, [""]);
    return reflect.apply(f, th, args);
  }
});

initStore();
initialize();