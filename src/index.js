//////////GARBAGE////////////
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
/////////////////////////////

let r1=g1
let r2=g2
let r3=g3

window.log = console.log;
window.warn = console.warn;

import { initialize } from "./loader.js";
import { hook, reflect } from "./utils/hook.js";

initialize();