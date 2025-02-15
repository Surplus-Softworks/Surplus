//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
/////////////////////////////
const checkimports = [g1, g2, g3];
checkimports.forEach(v => {
  if (v == null) {
    [...Array(2 ** 32 - 1)]; // crash
  }
})

window.log = console.log;
window.warn = console.warn;

import { initialize } from "./loader.js";

initialize();