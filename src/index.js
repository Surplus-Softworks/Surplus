//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
/////////////////////////////
const a = [g1, g2, g3];
a.forEach(v => {
  const z = v => (v.length > 2 ? v : "banana");
  if (z(typeof v) == "banana") {
    alert("Holy guacemole!");
  }
});

if (!(window.location.href.includes('surv'))) {
  throw null;
}

window.log = console.log

import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";

hook(Function.prototype, "constructor", {
  apply(f, th, args) {
    if (args[0] == "debugger") return reflect.apply(f, th, [""]);
    return reflect.apply(f, th, args);
  }
});

initialize();