if (!(window.location.href.includes('surv'))) {
  (async () => await new Promise(() => {}))();
}

import * as loader from "./loader.js";
import * as utils from "./utils.js";

//* 
import * as g1 from 'pixi.js';
import * as g2 from 'react';
import * as g3 from 'chalk';
//*/

let state = {
  gameManager: undefined
};
loader.inject(state)