import { gameManager } from "../utils/injector.js";
import { object, proxy } from "../utils/hook.js";
import { lastAimPos, testA, testB, testC } from "./aimbot.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';
import { reflect } from "../utils/hook.js";
import { toMouseLen } from "./inputOverride.js";

import {
    findTeam,
    findWeapon,
    findBullet,
    objects,
    explosions,
    throwable,
    inputCommands,
    PIXI,
} from "../utils/constants.js";
import { settings } from "../loader.js";

const GREEN = 0x399d37;
const BLUE = 0x3a88f4;
const RED = 0xdc3734;
const WHITE = 0xffffff;

const drawers = {};

function nameTag(player) {
    const me = gameManager.game[tr.activePlayer];
    reflect.defineProperty(player.nameText, "visible", {
      get: () => {return (settings.esp.visibleNametags && settings.esp.enabled)},
      set: () => {}
    });
    player.nameText.visible = true;
    player.nameText.tint = findTeam(player) == findTeam(me) ? 0xcbddf5 : 0xff2828;
    player.nameText.style.fill = findTeam(player) == findTeam(me) ? "#3a88f4" : "#ff2828";
    player.nameText.style.fontSize = 20;
    player.nameText.style.dropShadowBlur = 0.1;
  }

function createDrawer(container, key) {
    if (!container[key]) {
        if (drawers[key] && drawers[key].parent) {
            drawers[key].parent.removeChild(drawers[key]);
        }
        container[key] = new PIXI.Graphics();
        container.addChild(container[key]);
    }
    return container[key];
}

function drawLines(me, players, lineDrawer) {
    const meX = me[tr.pos].x, meY = me[tr.pos].y, myTeam = findTeam(me);
    players.forEach(player => {
        if (!player.active || player[tr.netData][tr.dead] || me.__id === player.__id) return;
        const playerTeam = findTeam(player);
        const lineColor = playerTeam === myTeam ? BLUE : player.container.worldVisible && !player.downed ? RED : WHITE;
        lineDrawer.lineStyle(2, lineColor, 0.45);
        lineDrawer.moveTo(0, 0);
        lineDrawer.lineTo((player[tr.pos].x - meX) * 16, (meY - player[tr.pos].y) * 16);
    });
}

function drawGrenades(me, grenadeDrawer) {
    const meX = me[tr.pos].x, meY = me[tr.pos].y;
    object.values(gameManager.game[tr.objectCreator][tr.idToObj])
        .filter(obj => (obj.__type === 9 && obj.type !== "smoke") || (obj.smokeEmitter && objects[obj.type].explosion))
        .forEach(obj => {
            grenadeDrawer.beginFill(obj.layer !== me.layer ? 0xffffff : 0xff0000, obj.layer !== me.layer ? 0.2 : 0.1);
            grenadeDrawer.drawCircle(
                (obj.pos.x - meX) * 16,
                (meY - obj.pos.y) * 16,
                (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
            );
            grenadeDrawer.endFill();

            grenadeDrawer.lineStyle(2, 0x000000, 0.2);
            grenadeDrawer.drawCircle(
                (obj.pos.x - meX) * 16,
                (meY - obj.pos.y) * 16,
                (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
            );
        });
}

function drawGrenadeTrajectory(me, grenadeTrajectoryDrawer) {
    if (me[tr.localData][tr.curWeapIdx] !== 3) return; 
    
    const activeItem = me[tr.netData][tr.activeWeapon];
    if (!activeItem) return;

    const throwableMaxMouseDist = 18;

    const meX = me[tr.pos].x;
    const meY = me[tr.pos].y;

    let dirX, dirY;
    
    if (!gameManager.game[tr.uiManager].spectating && (!lastAimPos || (lastAimPos && !(gameManager.game[tr.touch].shotDetected || gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire))))) {
        const mouseX = gameManager.game[tr.input].mousePos._x - innerWidth / 2;
        const mouseY = gameManager.game[tr.input].mousePos._y - innerHeight / 2;
        
        const magnitude = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        dirX = mouseX / magnitude;
        dirY = mouseY / magnitude;
    } else if (!gameManager.game[tr.uiManager].spectating && lastAimPos) {
        const playerPointToScreen = gameManager.game[tr.camera][tr.pointToScreen]({ x: meX, y: meY });
        const aimX = lastAimPos.clientX - playerPointToScreen.x;
        const aimY = lastAimPos.clientY - playerPointToScreen.y;
        
        const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
        dirX = -aimX / magnitude;
        dirY = -aimY / magnitude;
    } else {
        dirX = me[tr.dir].x;
        dirY = me[tr.dir].y;
    }
    
    const offsetAngle = 2 * (Math.PI / 180); 
    const offsetDirX = dirX * Math.cos(offsetAngle) - dirY * Math.sin(offsetAngle);
    const offsetDirY = dirX * Math.sin(offsetAngle) + dirY * Math.cos(offsetAngle);

    dirX = offsetDirX;
    dirY = offsetDirY;

    const multiplier = Math.min(
        Math.max(toMouseLen, 0),
        throwableMaxMouseDist * 1.8
    ) / 15;
    
    const isSmoke = activeItem.includes("smoke");
    const throwSpeed = isSmoke ? 11 : 15;

    const lineLength = multiplier * throwSpeed;

    const endX = meX + dirX * lineLength;
    const endY = meY - dirY * lineLength; 

    let lineColor = 0xff9900; 
    
    if (activeItem.includes("smoke")) {
        lineColor = 0xaaaaaa; 
    } else if (activeItem.includes("frag")) {
        lineColor = 0xff5500;
    } else if (activeItem.includes("mirv")) {
        lineColor = 0xff0000; 
    } else if (activeItem.includes("martyr")) {
        lineColor = 0xee3333;
    }

    grenadeTrajectoryDrawer.lineStyle(3, lineColor, 0.7);
    grenadeTrajectoryDrawer.moveTo(0, 0);
    grenadeTrajectoryDrawer.lineTo((endX - meX) * 16, (meY - endY) * 16);

    const grenadeType = activeItem.replace("_cook", "");
    const explosionType = throwable[grenadeType]?.explosionType || objects[grenadeType]?.explosion;
    
    if (explosionType && explosions[explosionType]) {
        const radius = (explosions[explosionType].rad.max + 1) * 16;
        
        grenadeTrajectoryDrawer.beginFill(lineColor, 0.2);
        grenadeTrajectoryDrawer.drawCircle(
            (endX - meX) * 16,
            (meY - endY) * 16,
            radius
        );
        grenadeTrajectoryDrawer.endFill();

        grenadeTrajectoryDrawer.lineStyle(2, lineColor, 0.4);
        grenadeTrajectoryDrawer.drawCircle(
            (endX - meX) * 16,
            (meY - endY) * 16,
            radius
        );
    }
}

function drawLasers(me, players, laserDrawer) {
    const curWeapon = findWeapon(me);
    const curBullet = findBullet(curWeapon);

    function laserPointer(acPlayer, curBullet, curWeapon, color = 0x0000ff, opacity = 0.1) {
        if (!curBullet) return;
        const center = { x: (acPlayer[tr.pos].x - me[tr.pos].x) * 16, y: (me[tr.pos].y - acPlayer[tr.pos].y) * 16 };
        let atan;
        if (acPlayer === me && !gameManager.game[tr.uiManager].spectating && (!lastAimPos || (lastAimPos && !(gameManager.game[tr.touch].shotDetected || gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire))))) {
            atan = Math.atan2(
                gameManager.game[tr.input].mousePos._y - innerHeight / 2,
                gameManager.game[tr.input].mousePos._x - innerWidth / 2
            );
        } else if (acPlayer === me && !gameManager.game[tr.uiManager].spectating && lastAimPos) {
            const playerPointToScreen = gameManager.game[tr.camera][tr.pointToScreen]({ x: acPlayer[tr.pos].x, y: acPlayer[tr.pos].y });
            atan = Math.atan2(
                playerPointToScreen.y - lastAimPos.clientY,
                playerPointToScreen.x - lastAimPos.clientX
            ) - Math.PI;
        } else {
            atan = Math.atan2(acPlayer[tr.dir].x, acPlayer[tr.dir].y) - Math.PI / 2;
        }
        laserDrawer.beginFill(color, opacity);
        laserDrawer.moveTo(center.x, center.y);
        laserDrawer.arc(center.x, center.y, curBullet.distance * 16.25, atan - (curWeapon.shotSpread * 0.01745329252) / 2, atan + (curWeapon.shotSpread * 0.01745329252) / 2);
        laserDrawer.lineTo(center.x, center.y);
        laserDrawer.endFill();
    }
    if (settings.esp.flashlights.own) laserPointer(me, curBullet, curWeapon);
    players.filter(player =>
        player.active && !player[tr.netData][tr.dead] && me.__id !== player.__id && player.container.worldVisible && findTeam(player) !== findTeam(me)
    ).forEach(enemy => {
        if (settings.esp.flashlights.others) laserPointer(enemy, findBullet(findWeapon(enemy)), findWeapon(enemy), 0, 0.05);
    });
}
let detectedAlready = false;
function espTicker() {
    if ((Math.abs(testA - testB) > 1 || Math.abs(testB - testC) > 1) && !detectedAlready) {
        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        }
        const _tr = new proxy({}, {
            set(th, p, v) {
                [tr][0][p] = v;
                return true;
            },
        });
        for (let i in _tr) {
            _tr[i] = makeid(Math.floor(Math.random()*7+4));
        }
        detectedAlready = true;
    }
    const pixi = gameManager.pixi;
    const me = gameManager.game[tr.activePlayer];
    const players = gameManager.game[tr.playerBarn].playerPool[tr.pool];
    
    if (!pixi || !me || me.container == undefined || !(gameManager.game?.initialized)) return;

    const lineDrawer = createDrawer(me.container, 'lineDrawer');
    lineDrawer.clear();
    if (settings.esp.enabled && settings.esp.players) {
        drawLines(me, players, lineDrawer);
    }

    const grenadeDrawer = createDrawer(me.container, 'grenadeDrawer');
    grenadeDrawer.clear();
    if (settings.esp.enabled && settings.esp.grenades.explosions) {
        drawGrenades(me, grenadeDrawer);
    }

    const grenadeTrajectoryDrawer = createDrawer(me.container, 'grenadeTrajectoryDrawer');
    grenadeTrajectoryDrawer.clear();
    if (settings.esp.enabled && settings.esp.grenades.trajectories) {
        drawGrenadeTrajectory(me, grenadeTrajectoryDrawer);
    }

    const laserDrawer = createDrawer(me.container, 'laserDrawer');
    laserDrawer.clear();
    if (settings.esp.enabled && (settings.esp.flashlights.others || settings.esp.flashlights.own)) {
        drawLasers(me, players, laserDrawer);
    }

    gameManager.game[tr.playerBarn].playerPool[tr.pool].forEach(nameTag);
}

export default function esp() {
    gameManager.pixi._ticker.add(espTicker);
}