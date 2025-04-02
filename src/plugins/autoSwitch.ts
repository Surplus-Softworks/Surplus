import { gameManager } from '../utils/injector.js';
import { settings } from '../loader.js';
import { gameObjects, inputCommands, isGameReady } from '../utils/constants.js';
import { inputs } from './inputOverride.js';
import { reflect } from '../utils/hook.js';
import { tr } from '../utils/obfuscatedNameTranslator.js';

const arrayPush = Array.prototype.push;
const WEAPON_COMMANDS = ['EquipPrimary', 'EquipSecondary'];

const weaponState = [
    { name: "", ammo: null, lastShotDate: Date.now(), type: "" },
    { name: "", ammo: null, lastShotDate: Date.now(), type: "" },
    { name: "", ammo: null, type: "" },
    { name: "", ammo: null, type: "" }
];

function updateWeaponSwitch() {
    if (!isGameReady() || !settings.autoSwitch.enabled) return;

    try {
        const currentWeaponIndex = gameManager.game[tr.activePlayer][tr.localData][tr.curWeapIdx];
        const weapons = gameManager.game[tr.activePlayer][tr.localData][tr.weapons];
        const currentWeapon = weapons[currentWeaponIndex];
        const currentWeaponState = weaponState[currentWeaponIndex];

        if (currentWeapon.ammo === currentWeaponState.ammo) return;

        const otherWeaponIndex = currentWeaponIndex === 0 ? 1 : 0;
        const otherWeapon = weapons[otherWeaponIndex];
        
        const shouldSwitchFromCurrentWeapon = 
            isSlowFiringWeapon(currentWeapon.type) && 
            currentWeapon.type === currentWeaponState.type &&
            (currentWeapon.ammo < currentWeaponState.ammo || 
             (currentWeaponState.ammo === 0 && 
              currentWeapon.ammo > currentWeaponState.ammo && 
              isPlayerFiring()));

        if (shouldSwitchFromCurrentWeapon) {
            currentWeaponState.lastShotDate = Date.now();
            
            if (isSlowFiringWeapon(otherWeapon.type) && 
                otherWeapon.ammo && 
                !settings.autoSwitch.useOneGun) {
                queueWeaponSwitch(otherWeaponIndex);
            } else if (otherWeapon.type !== "") {
                queueWeaponCycleAndBack(otherWeaponIndex, currentWeaponIndex);
            } else {
                queueMeleeCycleAndBack(currentWeaponIndex);
            }
        }
        
        currentWeaponState.ammo = currentWeapon.ammo;
        currentWeaponState.type = currentWeapon.type;
    } catch { }
}

function isSlowFiringWeapon(weaponType) {
    try {
        const weapon = gameObjects[weaponType];
        return (weapon.fireMode === "single" || weapon.fireMode === "burst") && 
               weapon.fireDelay >= 0.45;
    } catch {
        return false;
    }
}

function isPlayerFiring() {
    return gameManager.game[tr.touch].shotDetected || 
           gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire);
}

function queueWeaponSwitch(weaponIndex) {
    reflect.apply(arrayPush, inputs, [WEAPON_COMMANDS[weaponIndex]]);
}

function queueWeaponCycleAndBack(firstIndex, secondIndex) {
    queueWeaponSwitch(firstIndex);
    queueWeaponSwitch(secondIndex);
}

function queueMeleeCycleAndBack(weaponIndex) {
    reflect.apply(arrayPush, inputs, ['EquipMelee']);
    queueWeaponSwitch(weaponIndex);
}

export default function() {
    gameManager.pixi._ticker.add(updateWeaponSwitch);
}