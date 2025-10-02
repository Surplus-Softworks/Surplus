import { gameManager } from '@/utils/injector.js';
import { settings, inputState } from '@/state.js';
import { gameObjects, inputCommands, isGameReady } from '@/utils/constants.js';
import { reflect } from '@/utils/hook.js';
import { translatedTable } from '@/utils/obfuscatedNameTranslator.js';

const arrayPush = Array.prototype.push;
const WEAPON_COMMANDS = ['EquipPrimary', 'EquipSecondary'];

const weaponState = [
    { name: '', ammo: null, lastShotDate: Date.now(), type: '' },
    { name: '', ammo: null, lastShotDate: Date.now(), type: '' },
    { name: '', ammo: null, type: '' },
    { name: '', ammo: null, type: '' },
];

const queueInput = (command) => reflect.apply(arrayPush, inputState.queuedInputs, [command]);

const isSlowFiringWeapon = (weaponType) => {
    try {
        const weapon = gameObjects[weaponType];
        return (weapon.fireMode === 'single' || weapon.fireMode === 'burst') && weapon.fireDelay >= 0.45;
    } catch {
        return false;
    }
};

const isPlayerFiring = () =>
    gameManager.game[translatedTable.touch].shotDetected || gameManager.game[translatedTable.inputBinds].isBindDown(inputCommands.Fire);

const queueWeaponSwitch = (weaponIndex) => {
    queueInput(WEAPON_COMMANDS[weaponIndex]);
};

const queueWeaponCycleAndBack = (firstIndex, secondIndex) => {
    queueWeaponSwitch(firstIndex);
    queueWeaponSwitch(secondIndex);
};

const queueMeleeCycleAndBack = (weaponIndex) => {
    queueInput('EquipMelee');
    queueWeaponSwitch(weaponIndex);
};

const getAlternateWeaponIndex = (index) => (index === 0 ? 1 : 0);

const handleWeaponSwitch = () => {
    if (!isGameReady() || !settings.autoSwitch.enabled) return;

    try {
        const game = gameManager.game;
        const player = game[translatedTable.activePlayer];
        const localData = player[translatedTable.localData];
        const currentWeaponIndex = localData[translatedTable.curWeapIdx];
        const weapons = localData[translatedTable.weapons];
        const currentWeapon = weapons[currentWeaponIndex];
        const currentWeaponState = weaponState[currentWeaponIndex];

        if (currentWeapon.ammo === currentWeaponState.ammo) return;

        const otherWeaponIndex = getAlternateWeaponIndex(currentWeaponIndex);
        const otherWeapon = weapons[otherWeaponIndex];

        const shouldSwitch =
            isSlowFiringWeapon(currentWeapon.type) &&
            currentWeapon.type === currentWeaponState.type &&
            (currentWeapon.ammo < currentWeaponState.ammo ||
                (currentWeaponState.ammo === 0 && currentWeapon.ammo > currentWeaponState.ammo && isPlayerFiring()));

        if (shouldSwitch) {
            currentWeaponState.lastShotDate = Date.now();

            if (isSlowFiringWeapon(otherWeapon.type) && otherWeapon.ammo && !settings.autoSwitch.useOneGun) {
                queueWeaponSwitch(otherWeaponIndex);
            } else if (otherWeapon.type !== '') {
                queueWeaponCycleAndBack(otherWeaponIndex, currentWeaponIndex);
            } else {
                queueMeleeCycleAndBack(currentWeaponIndex);
            }
        }

        currentWeaponState.ammo = currentWeapon.ammo;
        currentWeaponState.type = currentWeapon.type;
    } catch {}
};

export default function initAutoSwitch() {
    gameManager.pixi._ticker.add(handleWeaponSwitch);
}
