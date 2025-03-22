import { gameManager } from "../utils/injector.js";
import { object, proxy, reflect } from "../utils/hook.js";
import { lastAimPos } from "./aimbot.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';
import { toMouseLen } from "./inputOverride.js";
import {
    findTeam,
    findWeapon,
    findBullet,
    gameObjects,
    inputCommands,
    PIXI,
} from "../utils/constants.js";
import { settings } from "../loader.js";

const COLORS = {
    GREEN: 0x399d37,
    BLUE: 0x3a88f4,
    RED: 0xdc3734,
    WHITE: 0xffffff
};

const GRENADE_COLORS = {
    DEFAULT: 0xff9900,
    SMOKE: 0xaaaaaa,
    FRAG: 0xff5500,
    MIRV: 0xff0000,
    MARTYR: 0xee3333
};

const graphicsCache = {};

function getGraphics(container, key) {
    if (!container[key]) {
        if (graphicsCache[key] && graphicsCache[key].parent) {
            graphicsCache[key].parent.removeChild(graphicsCache[key]);
        }
        container[key] = new PIXI.Graphics();
        container.addChild(container[key]);
    }
    return container[key];
}

function nameTag(player) {
    const localPlayer = gameManager.game[tr.activePlayer];
    const isSameTeam = findTeam(player) === findTeam(localPlayer);
    
    reflect.defineProperty(player.nameText, "visible", {
        get: () => (settings.esp.visibleNametags && settings.esp.enabled),
        set: () => {}
    });
    
    player.nameText.visible = true;
    player.nameText.tint = isSameTeam ? 0xcbddf5 : 0xff2828;
    player.nameText.style.fill = isSameTeam ? "#3a88f4" : "#ff2828";
    player.nameText.style.fontSize = 20;
    player.nameText.style.dropShadowBlur = 0.1;
}

function renderPlayerLines(localPlayer, players, graphics) {
    const playerX = localPlayer[tr.pos].x;
    const playerY = localPlayer[tr.pos].y;
    const playerTeam = findTeam(localPlayer);
    
    players.forEach(player => {
        if (!player.active || player[tr.netData][tr.dead] || localPlayer.__id === player.__id) return;
        
        const team = findTeam(player);
        const isVisible = player.container.worldVisible;
        const isDowned = player.downed;

        const lineColor = team === playerTeam ? COLORS.BLUE : 
                         (isVisible && !isDowned ? COLORS.RED : COLORS.WHITE);

        graphics.lineStyle(2, lineColor, 0.45);
        graphics.moveTo(0, 0);
        graphics.lineTo(
            (player[tr.pos].x - playerX) * 16, 
            (playerY - player[tr.pos].y) * 16
        );
    });
}

function renderGrenadeZones(localPlayer, graphics) {
    const playerX = localPlayer[tr.pos].x;
    const playerY = localPlayer[tr.pos].y;
    const playerLayer = localPlayer.layer;

    const grenades = object.values(gameManager.game[tr.objectCreator][tr.idToObj])
        .filter(obj => (obj.__type === 9 && obj.type !== "smoke") || 
                       (obj.smokeEmitter && obj.explodeParticle));
    
    grenades.forEach(grenade => {
        const opacity = grenade.layer !== playerLayer ? 0.2 : 0.1;
        const fillColor = grenade.layer !== playerLayer ? COLORS.WHITE : COLORS.RED;
        const radius = 13 * 16; 

        graphics.beginFill(fillColor, opacity);
        graphics.drawCircle(
            (grenade.pos.x - playerX) * 16,
            (playerY - grenade.pos.y) * 16,
            radius
        );
        graphics.endFill();

        graphics.lineStyle(2, 0x000000, 0.2);
        graphics.drawCircle(
            (grenade.pos.x - playerX) * 16,
            (playerY - grenade.pos.y) * 16,
            radius
        );
    });
}

function renderGrenadeTrajectory(localPlayer, graphics) {
    if (localPlayer[tr.localData][tr.curWeapIdx] !== 3) return; 
    
    const activeItem = localPlayer[tr.netData][tr.activeWeapon];
    if (!activeItem) return;

    const playerX = localPlayer[tr.pos].x;
    const playerY = localPlayer[tr.pos].y;
    const throwableMaxRange = 18;
    let dirX, dirY;
    
    const isSpectating = gameManager.game[tr.uiManager].spectating;
    const isAiming = gameManager.game[tr.touch].shotDetected || 
                    gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire);
    
    if (!isSpectating && (!lastAimPos || (lastAimPos && !isAiming))) {
        const mouseX = gameManager.game[tr.input].mousePos._x - innerWidth / 2;
        const mouseY = gameManager.game[tr.input].mousePos._y - innerHeight / 2;
        
        const magnitude = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        dirX = mouseX / magnitude;
        dirY = mouseY / magnitude;
    } else if (!isSpectating && lastAimPos) {
        const screenPos = gameManager.game[tr.camera][tr.pointToScreen]({ x: playerX, y: playerY });
        const aimX = lastAimPos.clientX - screenPos.x;
        const aimY = lastAimPos.clientY - screenPos.y;
        
        const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
        dirX = aimX / magnitude; 
        dirY = aimY / magnitude; 
    } else {
        dirX = localPlayer[tr.dir].x;
        dirY = localPlayer[tr.dir].y;
    }

    const offsetAngle = 2 * (Math.PI / 180); 
    const offsetDirX = dirX * Math.cos(offsetAngle) - dirY * Math.sin(offsetAngle);
    const offsetDirY = dirX * Math.sin(offsetAngle) + dirY * Math.cos(offsetAngle);
    dirX = offsetDirX;
    dirY = offsetDirY;

    const throwPower = Math.min(
        Math.max(toMouseLen, 0),
        throwableMaxRange * 1.8
    ) / 15;
    
    const isSmoke = activeItem.includes("smoke");
    const throwSpeed = isSmoke ? 11 : 15;
    const lineLength = throwPower * throwSpeed;

    const endX = playerX + dirX * lineLength;
    const endY = playerY - dirY * lineLength; 

    let lineColor = GRENADE_COLORS.DEFAULT;
    
    if (activeItem.includes("smoke")) {
        lineColor = GRENADE_COLORS.SMOKE;
    } else if (activeItem.includes("frag")) {
        lineColor = GRENADE_COLORS.FRAG;
    } else if (activeItem.includes("mirv")) {
        lineColor = GRENADE_COLORS.MIRV;
    } else if (activeItem.includes("martyr")) {
        lineColor = GRENADE_COLORS.MARTYR;
    }

    graphics.lineStyle(3, lineColor, 0.7);
    graphics.moveTo(0, 0);
    graphics.lineTo((endX - playerX) * 16, (playerY - endY) * 16);

    const grenadeType = activeItem.replace("_cook", "");
    const explosionType = gameObjects[grenadeType]?.explosionType;
    
    if (explosionType && gameObjects[explosionType]) {
        const radius = (gameObjects[explosionType].rad.max + 1) * 16;
        
        graphics.beginFill(lineColor, 0.2);
        graphics.drawCircle(
            (endX - playerX) * 16,
            (playerY - endY) * 16,
            radius
        );
        graphics.endFill();

        graphics.lineStyle(2, lineColor, 0.4);
        graphics.drawCircle(
            (endX - playerX) * 16,
            (playerY - endY) * 16,
            radius
        );
    }
}

function renderFlashlights(localPlayer, players, graphics) {
    function drawFlashlight(player, bullet, weapon, color = 0x0000ff, opacity = 0.1) {
        if (!bullet) return;

        const center = { 
            x: (player[tr.pos].x - localPlayer[tr.pos].x) * 16, 
            y: (localPlayer[tr.pos].y - player[tr.pos].y) * 16 
        };

        let aimAngle;
        const isLocalPlayer = player === localPlayer;
        const isSpectating = gameManager.game[tr.uiManager].spectating;
        const isAiming = gameManager.game[tr.touch].shotDetected || 
                         gameManager.game[tr.inputBinds].isBindDown(inputCommands.Fire);
        
        if (isLocalPlayer && !isSpectating && (!lastAimPos || (lastAimPos && !isAiming))) {
            aimAngle = Math.atan2(
                gameManager.game[tr.input].mousePos._y - innerHeight / 2,
                gameManager.game[tr.input].mousePos._x - innerWidth / 2
            );
        } else if (isLocalPlayer && !isSpectating && lastAimPos) {
            const screenPos = gameManager.game[tr.camera][tr.pointToScreen]({ 
                x: player[tr.pos].x, 
                y: player[tr.pos].y 
            });
            aimAngle = Math.atan2(
                screenPos.y - lastAimPos.clientY,
                screenPos.x - lastAimPos.clientX
            ) - Math.PI;
        } else {
            aimAngle = Math.atan2(player[tr.dir].x, player[tr.dir].y) - Math.PI / 2;
        }

        const spreadAngle = weapon.shotSpread * 0.01745329252; 
        graphics.beginFill(color, opacity);
        graphics.moveTo(center.x, center.y);
        graphics.arc(
            center.x, 
            center.y, 
            bullet.distance * 16.25, 
            aimAngle - spreadAngle / 2, 
            aimAngle + spreadAngle / 2
        );
        graphics.lineTo(center.x, center.y);
        graphics.endFill();
    }

    const localWeapon = findWeapon(localPlayer);
    const localBullet = findBullet(localWeapon);
    
    if (settings.esp.flashlights.own) {
        drawFlashlight(localPlayer, localBullet, localWeapon);
    }

    if (settings.esp.flashlights.others) {
        const enemies = players.filter(player => 
            player.active && 
            !player[tr.netData][tr.dead] && 
            localPlayer.__id !== player.__id && 
            player.container.worldVisible && 
            findTeam(player) !== findTeam(localPlayer)
        );
        
        enemies.forEach(enemy => {
            const enemyWeapon = findWeapon(enemy);
            const enemyBullet = findBullet(enemyWeapon);
            drawFlashlight(enemy, enemyBullet, enemyWeapon, 0, 0.05);
        });
    }
}

function renderESP() {
    const pixi = gameManager.pixi;
    const localPlayer = gameManager.game[tr.activePlayer];
    const players = gameManager.game[tr.playerBarn].playerPool[tr.pool];

    if (!pixi || !localPlayer || !localPlayer.container || !gameManager.game?.initialized) return;

    const lineGraphics = getGraphics(localPlayer.container, 'playerLines');
    lineGraphics.clear();
    if (settings.esp.enabled && settings.esp.players) {
        renderPlayerLines(localPlayer, players, lineGraphics);
    }

    const grenadeGraphics = getGraphics(localPlayer.container, 'grenadeDangerZones');
    grenadeGraphics.clear();
    if (settings.esp.enabled && settings.esp.grenades.explosions) {
        renderGrenadeZones(localPlayer, grenadeGraphics);
    }

    const trajectoryGraphics = getGraphics(localPlayer.container, 'grenadeTrajectory');
    trajectoryGraphics.clear();
    if (settings.esp.enabled && settings.esp.grenades.trajectories) {
        renderGrenadeTrajectory(localPlayer, trajectoryGraphics);
    }

    const flashlightGraphics = getGraphics(localPlayer.container, 'flashlights');
    flashlightGraphics.clear();
    if (settings.esp.enabled && (settings.esp.flashlights.others || settings.esp.flashlights.own)) {
        renderFlashlights(localPlayer, players, flashlightGraphics);
    }

    players.forEach(nameTag);
}

export default function() {
    gameManager.pixi._ticker.add(renderESP);
}