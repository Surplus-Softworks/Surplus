import { gameManager } from "@/utils/injector.js";
import { tr } from '@/utils/obfuscatedNameTranslator.js';

const GRENADE_TYPES = ["frag", "mirv", "martyr_nade"];
const MAX_TIMER_DURATION = 4; 

let lastTimeStamp = Date.now();
let timerActive = false;
let timerUI = null;

function updateGrenadeTimer() {
    if (!isGameInitialized() || !isPlayerHoldingGrenade()) {
        return;
    }

    try {
        const secondsElapsed = (Date.now() - lastTimeStamp) / 1000;
        const player = gameManager.game[tr.activePlayer];
        const activeWeapon = player[tr.netData][tr.activeWeapon];

        if (!isValidCookingState(player) || !isExplosiveGrenade(activeWeapon)) {
            resetTimer();
            return;
        }

        if (secondsElapsed > MAX_TIMER_DURATION) {
            timerActive = false;
        }

        if (!timerActive) {
            createNewTimer();
            return;
        }
        
        timerUI.update(secondsElapsed - timerUI.elapsed, gameManager.game[tr.camera]);
    } catch { }
}

function isGameInitialized() {
    return gameManager.game?.initialized &&
           gameManager.game?.[tr.activePlayer]?.[tr.localData]?.[tr.curWeapIdx] != null &&
           gameManager.game?.[tr.activePlayer]?.[tr.netData]?.[tr.activeWeapon] != null;
}

function isPlayerHoldingGrenade() {
    return gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx] === 3;
}

function isValidCookingState(player) {
    return player.throwableState === "cook";
}

function isExplosiveGrenade(weapon) {
    return GRENADE_TYPES.some(type => weapon.includes(type));
}

function resetTimer() {
    timerActive = false;
    
    if (timerUI) {
        timerUI.destroy();
        timerUI = null;
    }
}

function createNewTimer() {
    resetTimer();
    
    timerUI = new gameManager.game[tr.uiManager][tr.pieTimer].constructor;
    gameManager.pixi.stage.addChild(timerUI.container);
    timerUI.start("Grenade", 0, MAX_TIMER_DURATION);
    
    timerActive = true;
    lastTimeStamp = Date.now();
}

export default function() {
    gameManager.pixi._ticker.add(updateGrenadeTimer);
}