import { gameManager } from '../utils/injector.js';
import { settings } from '../loader.js';
import { guns, inputCommands } from '../utils/constants.js';
import { inputs } from './inputOverride.js';
import { reflect } from '../utils/hook.js';
import { translator } from '../utils/obfuscatedNameTranslator.js';

const arrayPush = Array.prototype.push;

const ammo = [
    {
        name: "",
        ammo: null,
        lastShotDate: Date.now()
    },
    {
        name: "",
        ammo: null,
        lastShotDate: Date.now()
    },
    {
        name: "",
        ammo: null,
    },
    {
        name: "",
        ammo: null,
    },
]
function autoSwitchTicker() {
    if (!(gameManager.game?.[translator.ws] && gameManager.game?.[translator.activePlayer]?.[translator.localData]?.[translator.curWeapIdx] != null && gameManager.game?.initialized)) return;

    if (!settings.autoSwitch.enabled) return;

    try {
        const curWeapIdx = gameManager.game[translator.activePlayer][translator.localData][translator.curWeapIdx];
        const weaps = gameManager.game[translator.activePlayer][translator.localData][translator.weapons];
        const curWeap = weaps[curWeapIdx];
        const shouldSwitch = gun => {
            let s = false;
            try {
                s =
                    (guns[gun].fireMode === "single"
                        || guns[gun].fireMode === "burst")
                    && guns[gun].fireDelay >= 0.45;
            }
            catch (e) {
            }
            return s;
        }
        const weapsEquip = ['EquipPrimary', 'EquipSecondary']
        if (curWeap.ammo !== ammo[curWeapIdx].ammo) {
            const otherWeapIdx = (curWeapIdx == 0) ? 1 : 0
            const otherWeap = weaps[otherWeapIdx]
            if ((curWeap.ammo < ammo[curWeapIdx].ammo || (ammo[curWeapIdx].ammo === 0 && curWeap.ammo > ammo[curWeapIdx].ammo && (gameManager.game[translator.touch].shotDetected || gameManager.game[translator.inputBinds].isBindDown(inputCommands.Fire)))) && shouldSwitch(curWeap.type) && curWeap.type == ammo[curWeapIdx].type) {
                ammo[curWeapIdx].lastShotDate = Date.now();
                //console.log("Switching weapon due to ammo change");
                if (shouldSwitch(otherWeap.type) && otherWeap.ammo && !settings.autoSwitch.useOneGun) { // && ammo[curWeapIdx].ammo !== 0
                    reflect.apply(arrayPush, inputs, [weapsEquip[otherWeapIdx]]);
                } else if (otherWeap.type !== "") {
                    reflect.apply(arrayPush, inputs, [weapsEquip[otherWeapIdx]]);
                    reflect.apply(arrayPush, inputs, [weapsEquip[curWeapIdx]]);
                } else {
                    reflect.apply(arrayPush, inputs, ['EquipMelee']);
                    reflect.apply(arrayPush, inputs, [weapsEquip[curWeapIdx]]);
                }
            }
            ammo[curWeapIdx].ammo = curWeap.ammo
            ammo[curWeapIdx].type = curWeap.type
        }
    } catch (err) {
        //console.error('autoswitch', err)
    }
}

export default function autoSwitch() {
    gameManager.pixi._ticker.add(autoSwitchTicker);
}