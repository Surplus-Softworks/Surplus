// GARBAGE //

// ******* //

import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";
import { initSecurity, crash, validate } from './utils/security.js';
import { initStore } from "./utils/store.js";
import { injectjQuery, jQuery } from "./utils/injector.js";

initSecurity();

(() => {
  const dateNow = validate(Date.now, true);
  const time = reflect.apply(dateNow, Date, []);
  if (time > EPOCH) {
    const write = validate(Document.prototype.write, true);
    reflect.apply(write, document, ['<h1>This version of Surplus is outdated. Please get the new one in our Discord server!<br></h1>']);
    validate(setTimeout, true)(crash, 300)
  }
})();

globalThis.log = console.log;
globalThis.warn = console.warn;

  injectjQuery(() => {
    jQuery.ajax({
      url: 'https://survev.io',
      method: 'GET',
      success: function (data, textStatus, jqXHR) {
        const dateHeader = jqXHR.getResponseHeader('date');
        const dateEpoch = +new Date(dateHeader);
        const now = Date.now(); 
        if (dateEpoch - now >= 60000) {
          crash();
        }
      }
    });
  });


if (RELEASE) {
  const err = validate(Error, true);
  const includes = validate(String.prototype.includes, true);
  const stack = new err("").stack;
  if (!reflect.apply(includes, stack, ["main.js:23:3"])) crash();
} else {
  hook(Function.prototype, "constructor", {
    apply(f, th, args) {
      if (args[0] == "debugger") return reflect.apply(f, th, [""]);
      return reflect.apply(f, th, args);
    }
  });
}

initStore();
initialize();