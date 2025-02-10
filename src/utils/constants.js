import { hook, reflect, object } from "./hook.js";
import { gameManager } from "./injector.js";

export const inputCommands = {
    Cancel: 6,
    Count: 36,
    CycleUIMode: 30,
    EmoteMenu: 31,
    EquipFragGrenade: 15,
    EquipLastWeap: 19,
    EquipMelee: 13,
    EquipNextScope: 22,
    EquipNextWeap: 17,
    EquipOtherGun: 20,
    EquipPrevScope: 21,
    EquipPrevWeap: 18,
    EquipPrimary: 11,
    EquipSecondary: 12,
    EquipSmokeGrenade: 16,
    EquipThrowable: 14,
    Fire: 4,
    Fullscreen: 33,
    HideUI: 34,
    Interact: 7,
    Loot: 10,
    MoveDown: 3,
    MoveLeft: 0,
    MoveRight: 1,
    MoveUp: 2,
    Reload: 5,
    Revive: 8,
    StowWeapons: 27,
    SwapWeapSlots: 28,
    TeamPingMenu: 32,
    TeamPingSingle: 35,
    ToggleMap: 29,
    Use: 9,
    UseBandage: 23,
    UseHealthKit: 24,
    UsePainkiller: 26,
    UseSoda: 25,
};

export function getTeam(player) {
    return object.keys(gameManager.game.playerBarn.teamInfo).find(team => gameManager.game.playerBarn.teamInfo[team].playerIds.includes(player.__id));
}

export function findWeap(player) {
    const weapType = player.netData.activeWeapon;
    return weapType && gameManager.guns[weapType] ? gameManager.guns[weapType] : null;
}

export function findBullet(weapon) {
    return weapon ? gameManager.bullets[weapon.bulletType] : null;
}

export let bullets, explosions, guns, throwable, objects;

hook(Object, "keys", {
    apply(f, th, args) {
        try {
            if (bullets == null && args[0]?.bullet_mp5?.type == "bullet") {
                bullets = args[0];
            } else if (explosions == null && args[0]?.explosion_frag?.type == "explosion") {
                explosions = args[0];
            } else if (guns == null && args[0]?.mp5?.type == "gun") {
                guns = args[0];
            } else if (throwable == null && args[0]?.frag?.type == "throwable") {
                throwable = args[0];
            } else if (objects == null && args[0]?.barrel_01?.type == "obstacle") {
                objects = args[0];
            }
            if (bullets != null && explosions != null && guns != null && throwable != null && objects != null) {
                Object.keys = f;
            }
        } catch { }
        return reflect.apply(f, th, args);
    }
});