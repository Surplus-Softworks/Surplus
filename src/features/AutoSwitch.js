import { gameManager } from '@/state.js';
import { settings, inputState } from '@/state.js';
import { gameObjects, inputCommands, isGameReady } from '@/utils/constants.js';
import { translations } from '@/utils/obfuscatedNameTranslator.js';
import { autoFireEnabled } from '@/features/AutoFire.js';

const WEAPON_COMMANDS = [inputCommands.EquipPrimary_, inputCommands.EquipSecondary_];

const weaponState = [
  { name_: '', ammo_: null, lastShotDate_: Date.now(), type_: '' },
  { name_: '', ammo_: null, lastShotDate_: Date.now(), type_: '' },
  { name_: '', ammo_: null, type_: '' },
  { name_: '', ammo_: null, type_: '' },
];

const queueInput = (command) => inputState.queuedInputs_.push(command);

const shouldQuickSwitch = (weaponType) => {
  try {
    const weapon = gameObjects[weaponType];
    const isSemiAuto = weapon.fireMode === 'single' || weapon.fireMode === 'burst';

    if (!isSemiAuto) return false;

    if (autoFireEnabled) {
      return weapon.fireDelay >= 0.6;
    }

    return weapon.fireDelay >= 0.3;
  } catch {
    return false;
  }
};

const isSlowFiringWeapon = (weaponType) => {
  try {
    const weapon = gameObjects[weaponType];
    const isSemiAuto = weapon.fireMode === 'single' || weapon.fireMode === 'burst';

    if (!isSemiAuto) return false;

    if (autoFireEnabled) {
      return weapon.fireDelay >= 0.75;
    }

    return weapon.fireDelay >= 0.45;
  } catch {
    return false;
  }
};

const isPlayerFiring = () =>
  gameManager.game[translations.touch_].shotDetected ||
  gameManager.game[translations.inputBinds_].isBindDown(inputCommands.Fire_);

const queueWeaponSwitch = (weaponIndex) => {
  queueInput(WEAPON_COMMANDS[weaponIndex]);
};

const queueWeaponCycleAndBack = (firstIndex, secondIndex) => {
  queueWeaponSwitch(firstIndex);
  queueWeaponSwitch(secondIndex);
};

const queueMeleeCycleAndBack = (weaponIndex) => {
  queueInput(inputCommands.EquipMelee_);
  queueWeaponSwitch(weaponIndex);
};

const getAlternateWeaponIndex = (index) => (index === 0 ? 1 : 0);

const handleWeaponSwitch = () => {
  if (!isGameReady() || !settings.autoSwitch_.enabled_) return;

  try {
    const game = gameManager.game;
    const player = game[translations.activePlayer_];
    const localData = player[translations.localData_];
    const currentWeaponIndex = localData[translations.curWeapIdx_];
    const weapons = localData[translations.weapons_];
    const currentWeapon = weapons[currentWeaponIndex];
    const currentWeaponState = weaponState[currentWeaponIndex];

    if (currentWeapon.ammo === currentWeaponState.ammo_) return;

    const shotFired =
      currentWeapon.type === currentWeaponState.type_ &&
      (currentWeapon.ammo < currentWeaponState.ammo_ ||
        (currentWeaponState.ammo_ === 0 &&
          currentWeapon.ammo > currentWeaponState.ammo_ &&
          isPlayerFiring()));

    if (shotFired) {
      currentWeaponState.lastShotDate_ = Date.now();

      if (shouldQuickSwitch(currentWeapon.type)) {
        queueMeleeCycleAndBack(currentWeaponIndex);
      }

      else if (isSlowFiringWeapon(currentWeapon.type)) {
        const otherWeaponIndex = getAlternateWeaponIndex(currentWeaponIndex);
        const otherWeapon = weapons[otherWeaponIndex];

        if (
          isSlowFiringWeapon(otherWeapon.type) &&
          otherWeapon.ammo &&
          !settings.autoSwitch_.useOneGun_
        ) {
          queueWeaponSwitch(otherWeaponIndex);
        } else if (otherWeapon.type !== '') {
          queueWeaponCycleAndBack(otherWeaponIndex, currentWeaponIndex);
        } else {
          queueMeleeCycleAndBack(currentWeaponIndex);
        }
      }
    }

    currentWeaponState.ammo_ = currentWeapon.ammo;
    currentWeaponState.type_ = currentWeapon.type;
  } catch { }
};

export default function () {
  gameManager.pixi._ticker.add(handleWeaponSwitch);
}
