import { gameManager } from '@/utils/injector.js';
import { translatedTable } from '@/utils/obfuscatedNameTranslator.js';

const GRENADE_TYPES = ['frag', 'mirv', 'martyr_nade'];
const MAX_TIMER_DURATION = 4;

let lastTimestamp = Date.now();
let timerActive = false;
let timerUI = null;

const isGameInitialized = () => {
    const game = gameManager.game;
    if (!game?.initialized) return false;
    const player = game[translatedTable.activePlayer];
    return (
        player?.[translatedTable.localData]?.[translatedTable.curWeapIdx] != null &&
        player?.[translatedTable.netData]?.[translatedTable.activeWeapon] != null
    );
};

const isPlayerHoldingGrenade = () => {
    const game = gameManager.game;
    return game[translatedTable.activePlayer][translatedTable.localData][translatedTable.curWeapIdx] === 3;
};

const isValidCookingState = (player) => player.throwableState === 'cook';

const isExplosiveGrenade = (weapon) => GRENADE_TYPES.some((type) => weapon.includes(type));

const resetTimer = () => {
    timerActive = false;
    if (timerUI) {
        timerUI.destroy();
        timerUI = null;
    }
};

const createNewTimer = () => {
    resetTimer();
    const PieTimer = gameManager.game[translatedTable.uiManager][translatedTable.pieTimer].constructor;
    timerUI = new PieTimer();
    gameManager.pixi.stage.addChild(timerUI.container);
    timerUI.start('Grenade', 0, MAX_TIMER_DURATION);
    timerActive = true;
    lastTimestamp = Date.now();
};

const updateGrenadeTimer = () => {
    if (!isGameInitialized() || !isPlayerHoldingGrenade()) return;

    try {
        const game = gameManager.game;
        const player = game[translatedTable.activePlayer];
        const activeWeapon = player[translatedTable.netData][translatedTable.activeWeapon];
        const secondsElapsed = (Date.now() - lastTimestamp) / 1000;

        if (!isValidCookingState(player) || !isExplosiveGrenade(activeWeapon)) {
            resetTimer();
            return;
        }

        if (secondsElapsed > MAX_TIMER_DURATION) timerActive = false;

        if (!timerActive) {
            createNewTimer();
            return;
        }

        timerUI.update(secondsElapsed - timerUI.elapsed, game[translatedTable.camera]);
    } catch {}
};

export default function initGrenadeTimer() {
    gameManager.pixi._ticker.add(updateGrenadeTimer);
}
