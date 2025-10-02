import { gameManager } from '@/utils/injector.js';
import { object, reflect } from '@/utils/hook.js';
import { aimState, inputState, settings } from '@/state.js';
import { translatedTable } from '@/utils/obfuscatedNameTranslator.js';
import {
    findTeam,
    findWeapon,
    findBullet,
    gameObjects,
    inputCommands,
    PIXI,
} from '@/utils/constants.js';
import { originalLayerValue, isLayerHackActive } from '@/features/LayerSpoofer.js';

const COLORS = {
    GREEN: 0x399d37,
    BLUE: 0x3a88f4,
    RED: 0xdc3734,
    WHITE: 0xffffff,
};

const GRENADE_COLORS = {
    DEFAULT: 0xff9900,
    SMOKE: 0xaaaaaa,
    FRAG: 0xff5500,
    MIRV: 0xff0000,
    MARTYR: 0xee3333,
};

const graphicsCache = {};
const isBypassLayer = (layer) => layer === 2 || layer === 3;

const getLocalLayer = (player) => {
    if (isBypassLayer(player.layer)) return player.layer;
    if (isLayerHackActive && originalLayerValue !== undefined) return originalLayerValue;
    return player.layer;
};

const meetsLayerCriteria = (targetLayer, localLayer, isLocalOnBypass) => {
    if (isBypassLayer(targetLayer) || isLocalOnBypass) return true;
    return targetLayer === localLayer;
};

const getGraphics = (container, key) => {
    if (!container[key]) {
        if (graphicsCache[key] && graphicsCache[key].parent) {
            graphicsCache[key].parent.removeChild(graphicsCache[key]);
        }
        container[key] = new PIXI.Graphics();
        container.addChild(container[key]);
    }
    return container[key];
};

function nameTag(player) {
    const localPlayer = gameManager.game[translatedTable.activePlayer];
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

const drawFlashlight = (localPlayer, player, bullet, weapon, graphics, color = 0x0000ff, opacity = 0.1) => {
    if (!bullet || !weapon) return;

    const center = {
        x: (player[translatedTable.pos].x - localPlayer[translatedTable.pos].x) * 16,
        y: (localPlayer[translatedTable.pos].y - player[translatedTable.pos].y) * 16,
    };

    const game = gameManager.game;
    const isLocalPlayer = player === localPlayer;
    const isSpectating = game[translatedTable.uiManager].spectating;
    const isAiming = game[translatedTable.touch].shotDetected || game[translatedTable.inputBinds].isBindDown(inputCommands.Fire);

    let aimAngle;
    if (isLocalPlayer && !isSpectating && (!aimState.lastAimPos || !isAiming)) {
        aimAngle = Math.atan2(game[translatedTable.input].mousePos._y - innerHeight / 2, game[translatedTable.input].mousePos._x - innerWidth / 2);
    } else if (isLocalPlayer && !isSpectating && aimState.lastAimPos) {
        const screenPos = game[translatedTable.camera][translatedTable.pointToScreen]({ x: player[translatedTable.pos].x, y: player[translatedTable.pos].y });
        aimAngle = Math.atan2(screenPos.y - aimState.lastAimPos.clientY, screenPos.x - aimState.lastAimPos.clientX) - Math.PI;
    } else {
        aimAngle = Math.atan2(player[translatedTable.dir].x, player[translatedTable.dir].y) - Math.PI / 2;
    }

    const spreadAngle = weapon.shotSpread * (Math.PI / 180);
    graphics.beginFill(color, opacity);
    graphics.moveTo(center.x, center.y);
    graphics.arc(
        center.x,
        center.y,
        bullet.distance * 16.25,
        aimAngle - spreadAngle / 2,
        aimAngle + spreadAngle / 2,
    );
    graphics.lineTo(center.x, center.y);
    graphics.endFill();
};

function renderPlayerLines(localPlayer, players, graphics) {
    const playerX = localPlayer[translatedTable.pos].x;
    const playerY = localPlayer[translatedTable.pos].y;
    const playerTeam = findTeam(localPlayer);
    const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
    const localLayer = getLocalLayer(localPlayer);

    players.forEach((player) => {
        if (!player.active || player[translatedTable.netData][translatedTable.dead] || localPlayer.__id === player.__id) return;

        const team = findTeam(player);
        const isOnEffectiveLayer = meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer);
        const isDowned = player.downed;
        const lineColor = team === playerTeam ? COLORS.BLUE : isOnEffectiveLayer && !isDowned ? COLORS.RED : COLORS.WHITE;

        graphics.lineStyle(2, lineColor, 0.45);
        graphics.moveTo(0, 0);
        graphics.lineTo((player[translatedTable.pos].x - playerX) * 16, (playerY - player[translatedTable.pos].y) * 16);
    });
}


function renderGrenadeZones(localPlayer, graphics) {
    const playerX = localPlayer[translatedTable.pos].x;
    const playerY = localPlayer[translatedTable.pos].y;
    const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
    const playerLayer = getLocalLayer(localPlayer);

    const idToObj = gameManager.game?.[translatedTable.objectCreator]?.[translatedTable.idToObj];
    if (!idToObj) return;

    const grenades = object.values(idToObj).filter(
        (obj) => (obj.__type === 9 && obj.type !== 'smoke') || (obj.smokeEmitter && obj.explodeParticle),
    );

    grenades.forEach((grenade) => {
        const effectiveMatch = meetsLayerCriteria(grenade.layer, playerLayer, isLocalOnBypassLayer);
        const opacity = effectiveMatch ? 0.1 : 0.2;
        const fillColor = effectiveMatch ? COLORS.RED : COLORS.WHITE;
        const radius = 13 * 16;

        graphics.beginFill(fillColor, opacity);
        graphics.drawCircle((grenade.pos.x - playerX) * 16, (playerY - grenade.pos.y) * 16, radius);
        graphics.endFill();

        graphics.lineStyle(2, 0x000000, 0.2);
        graphics.drawCircle((grenade.pos.x - playerX) * 16, (playerY - grenade.pos.y) * 16, radius);
    });
}


function renderGrenadeTrajectory(localPlayer, graphics) {
    if (localPlayer[translatedTable.localData][translatedTable.curWeapIdx] !== 3) return;

    const activeItem = localPlayer[translatedTable.netData][translatedTable.activeWeapon];
    if (!activeItem) return;

    const game = gameManager.game;
    const playerX = localPlayer[translatedTable.pos].x;
    const playerY = localPlayer[translatedTable.pos].y;
    const throwableMaxRange = 18;
    let dirX;
    let dirY;

    const isSpectating = game[translatedTable.uiManager].spectating;
    const isAiming = game[translatedTable.touch].shotDetected || game[translatedTable.inputBinds].isBindDown(inputCommands.Fire);

    if (!isSpectating && (!aimState.lastAimPos || !isAiming)) {
        const mouseX = game[translatedTable.input].mousePos._x - innerWidth / 2;
        const mouseY = game[translatedTable.input].mousePos._y - innerHeight / 2;
        const magnitude = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        dirX = mouseX / magnitude;
        dirY = mouseY / magnitude;
    } else if (!isSpectating && aimState.lastAimPos) {
        const screenPos = game[translatedTable.camera][translatedTable.pointToScreen]({ x: playerX, y: playerY });
        const aimX = aimState.lastAimPos.clientX - screenPos.x;
        const aimY = aimState.lastAimPos.clientY - screenPos.y;
        const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
        dirX = aimX / magnitude;
        dirY = aimY / magnitude;
    } else {
        dirX = localPlayer[translatedTable.dir].x;
        dirY = localPlayer[translatedTable.dir].y;
    }

    const offsetAngle = 2 * (Math.PI / 180);
    const offsetDirX = dirX * Math.cos(offsetAngle) - dirY * Math.sin(offsetAngle);
    const offsetDirY = dirX * Math.sin(offsetAngle) + dirY * Math.cos(offsetAngle);
    dirX = offsetDirX;
    dirY = offsetDirY;

    const throwPower = Math.min(Math.max(inputState.toMouseLen, 0), throwableMaxRange * 1.8) / 15;
    const isSmoke = activeItem.includes('smoke');
    const throwSpeed = isSmoke ? 11 : 15;
    const lineLength = throwPower * throwSpeed;

    const endX = playerX + dirX * lineLength;
    const endY = playerY - dirY * lineLength;

    let lineColor = GRENADE_COLORS.DEFAULT;
    if (activeItem.includes('smoke')) {
        lineColor = GRENADE_COLORS.SMOKE;
    } else if (activeItem.includes('frag')) {
        lineColor = GRENADE_COLORS.FRAG;
    } else if (activeItem.includes('mirv')) {
        lineColor = GRENADE_COLORS.MIRV;
    } else if (activeItem.includes('martyr')) {
        lineColor = GRENADE_COLORS.MARTYR;
    }

    graphics.lineStyle(3, lineColor, 0.7);
    graphics.moveTo(0, 0);
    graphics.lineTo((endX - playerX) * 16, (playerY - endY) * 16);

    const grenadeType = activeItem.replace('_cook', '');
    const explosionType = gameObjects[grenadeType]?.explosionType;

    if (explosionType && gameObjects[explosionType]) {
        const radius = (gameObjects[explosionType].rad.max + 1) * 16;
        graphics.beginFill(lineColor, 0.2);
        graphics.drawCircle((endX - playerX) * 16, (playerY - endY) * 16, radius);
        graphics.endFill();

        graphics.lineStyle(2, lineColor, 0.4);
        graphics.drawCircle((endX - playerX) * 16, (playerY - endY) * 16, radius);
    }
}


function renderFlashlights(localPlayer, players, graphics) {
    const localWeapon = findWeapon(localPlayer);
    const localBullet = findBullet(localWeapon);
    const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
    const localLayer = getLocalLayer(localPlayer);

    if (settings.esp.flashlights.own) {
        drawFlashlight(localPlayer, localPlayer, localBullet, localWeapon, graphics);
    }

    if (!settings.esp.flashlights.others) return;

    const enemies = players.filter((player) => {
        if (!player.active) return false;
        if (player[translatedTable.netData][translatedTable.dead]) return false;
        if (localPlayer.__id === player.__id) return false;
        if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) return false;
        if (!player.container.worldVisible) return false;
        return findTeam(player) !== findTeam(localPlayer);
    });

    enemies.forEach((enemy) => {
        const enemyWeapon = findWeapon(enemy);
        const enemyBullet = findBullet(enemyWeapon);
        drawFlashlight(localPlayer, enemy, enemyBullet, enemyWeapon, graphics, 0, 0.05);
    });
}

function renderESP() {
    const pixi = gameManager.pixi;
    const localPlayer = gameManager.game[translatedTable.activePlayer];
    const players = gameManager.game[translatedTable.playerBarn].playerPool[translatedTable.pool];

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
