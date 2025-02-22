import { gameManager } from "./injector.js";
import { validate } from "./security.js";

export const tickers = [];

const ref_setInterval = validate(setInterval, true)

ref_setInterval(() => {
  if (gameManager?.game?.gameOver !== true) {
    tickers.forEach(ticker => {
      ticker();
    })
  } else {
    tickers.length = 0;
  }
}, 0)