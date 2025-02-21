//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';

Math.random(g1, g2, g3)

/////////////////////////////


import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initSecurity, crash, validate } from './utils/security.js';
import initStore, { read, write } from "./utils/store.js";
import { ed } from './utils/encryption.js';

initSecurity();

(() => {
  const dateNow = validate(Date.now, true);
  const time = reflect.apply(dateNow, Date, []);
  initStore().then(() => {
    read("l").then(val => {
      if (val != null && time < validate(parseInt, true)(ed(val))) crash();
    });
  });
  if (time > EPOCH) {
    const write = validate(Document.prototype.write, true);
    reflect.apply(write, document, ['This version of Surplus is outdated. Please get the new one in our Discord server!']);
    crash();
  }
})();

(() => {
  const dateNow = validate(Date.now, true);
  const time = reflect.apply(dateNow, Date, []);
  initStore().then(() => {
    write("l", ed(time + ""));
  });
})();

window.log = console.log;
window.warn = console.warn;

if (RELEASE) {
  const err = validate(Error, true);
  const includes = validate(String.prototype.includes, true);
  const stack = new err("").stack;
  if (!reflect.apply(includes, stack, ["main.js:23:3"])) crash();
}

hook(Function.prototype, "constructor", {
  apply(f, th, args) {
    if (args[0] == "debugger") return reflect.apply(f, th, [""]);
    return reflect.apply(f, th, args);
  }
});

initStore();
initialize();