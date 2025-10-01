import { hook, reflect, object } from "@/utils/hook.js";
import { gameManager } from "@/utils/injector.js";
import { tr } from "@/utils/obfuscatedNameTranslator.js";

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

export let gameObjects;

hook(Object, "keys", {
    apply(f, th, args) {
        try {
            if (args[0]?.bullet_mp5?.type == "bullet" && args[0]?.explosion_frag?.type == "explosion" && args[0]?.mp5?.type == "gun" && args[0]?.frag?.type == "throwable") {
                gameObjects = args[0];
                Object.keys = f;
            }
        } catch {

        }
        return reflect.apply(f, th, args);
    }
});

export function isGameReady() {
    return gameManager.game?.[tr.ws] && 
           gameManager.game?.[tr.activePlayer]?.[tr.localData]?.[tr.curWeapIdx] != null && 
           gameManager.game?.initialized;
}

export function findTeam(player) {
    return object.keys(gameManager.game[tr.playerBarn].teamInfo).find(team => gameManager.game[tr.playerBarn].teamInfo[team].playerIds.includes(player.__id));
}

export function findWeapon(player) {
    const weaponType = player[tr.netData][tr.activeWeapon];
    return weaponType && gameObjects[weaponType] ? gameObjects[weaponType] : null;
}

export function findBullet(weapon) {
    return weapon ? gameObjects[weapon.bulletType] : null;
}

export let PIXI = {
    Graphics: undefined,
    Container: undefined,
}