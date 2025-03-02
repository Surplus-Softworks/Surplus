import { hook, reflect, object } from "./hook.js";
import { gameManager } from "./injector.js";

export const inputCommands = {
    MoveLeft: 0,
    MoveRight: 1,
    MoveUp: 2,
    MoveDown: 3,
    Fire: 4,
    Reload: 5,
    Cancel: 6,
    Interact: 7,
    Revive: 8,
    Use: 9,
    Loot: 10,
    EquipPrimary: 11,
    EquipSecondary: 12,
    EquipMelee: 13,
    EquipThrowable: 14,
    EquipFragGrenade: 15,
    EquipSmokeGrenade: 16,
    EquipNextWeap: 17,
    EquipPrevWeap: 18,
    EquipLastWeap: 19,
    EquipOtherGun: 20,
    EquipPrevScope: 21,
    EquipNextScope: 22,
    UseBandage: 23,
    UseHealthKit: 24,
    UseSoda: 25,
    UsePainkiller: 26,
    StowWeapons: 27,
    SwapWeapSlots: 28,
    ToggleMap: 29,
    CycleUIMode: 30,
    EmoteMenu: 31,
    TeamPingMenu: 32,
    Fullscreen: 33,
    HideUI: 34,
    TeamPingSingle: 35,
    Count: 36,
};

export const packetTypes = {
    None: 0,
    Join: 1,
    Disconnect: 2,
    Input: 3,
    Edit: 4,
    Joined: 5,
    Update: 6,
    Kill: 7,
    GameOver: 8,
    Pickup: 9,
    Map: 10,
    Spectate: 11,
    DropItem: 12,
    Emote: 13,
    PlayerStats: 14,
    AdStatus: 15,
    Loadout: 16,
    RoleAnnouncement: 17,
    Stats: 18,
    UpdatePass: 19,
    AliveCounts: 20,
    PerkModeRoleSelect: 21
};

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
        } catch {
            
         }
        return reflect.apply(f, th, args);
    }
});

export function findTeam(player) {
    return object.keys(obfuscatedNameTranslator.playerBarn.teamInfo).find(team => obfuscatedNameTranslator.playerBarn.teamInfo[team].playerIds.includes(player.__id));
}

export function findWeapon(player) {
    const weaponType = player.netData.activeWeapon;
    return weaponType && guns[weaponType] ? guns[weaponType] : null;
}

export function findBullet(weapon) {
    return weapon ? bullets[weapon.bulletType] : null;
}

export let PIXI = {
    Graphics: undefined,
    Container: undefined,
}