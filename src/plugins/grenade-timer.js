import { gameManager } from "../utils/injector.js";

let lastTime = Date.now();
let showing = false;
let timer = null;

function createTimer(time) {
    if (timer) timer.destroy();
    timer = new gameManager.game.uiManager.pieTimer.constructor();
    gameManager.game.pixi.stage.addChild(timer.container);
    timer.start("Grenade", 0, time);
    showing = true;
    lastTime = Date.now();
}

function grenadeTimerTicker() {
    const game = gameManager.game;
    const player = game?.activePlayer;
    const activeItem = player?.netData?.activeWeapon;

    if (!game?.ws || player?.localData?.curWeapIdx == null || activeItem == null) return;
    
    const elapsed = (Date.now() - lastTime) / 1000;
    const grenadeTime = 4;
    
    if (
        player.localData.curWeapIdx !== 3 || 
        player.throwableState !== "cook" || 
        (!activeItem.includes("frag") && !activeItem.includes("mirv") && !activeItem.includes("martyr_nade"))
    ) {
        showing = false;
        if (timer) timer.destroy();
        timer = null;
        return;
    }
    
    if (elapsed > grenadeTime) {
        showing = false;
        return;
    }
    
    if (!showing) {
        createTimer(grenadeTime);
        return;
    }
    
    timer.update(elapsed - timer.elapsed, game.camera);
}

export function grenadeTimer() {
    gameManager.game.pixi._ticker.add(grenadeTimerTicker);
}
