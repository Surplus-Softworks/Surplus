import { gameManager } from '@/state.js';
import { aimState, inputState, settings } from '@/state.js';
import { translations } from '@/utils/obfuscatedNameTranslator.js';
import {
    findTeam,
    findWeapon,
    findBullet,
    gameObjects,
    inputCommands,
    PIXI,
} from '@/utils/constants.js';
import { originalLayerValue, isLayerSpoofActive } from '@/features/LayerSpoofer.js';
import { getCurrentAimPosition, isAimInterpolating } from '@/utils/aimController.js';
import { outer } from '@/utils/outer.js';

const COLORS = {
    GREEN_: 0x399d37,
    BLUE_: 0x3a88f4,
    RED_: 0xdc3734,
    WHITE_: 0xffffff,
};

const GRENADE_COLORS = {
    DEFAULT_: 0xff9900,
    SMOKE_: 0xaaaaaa,
    FRAG_: 0xff5500,
    MIRV_: 0xff0000,
    MARTYR_: 0xee3333,
};

const graphicsCache = {};
const isBypassLayer = (layer) => layer === 2 || layer === 3;

const getLocalLayer = (player) => {
    if (isBypassLayer(player.layer)) return player.layer;
    if (isLayerSpoofActive && originalLayerValue !== undefined) return originalLayerValue;
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
        container[key] = new PIXI.Graphics_();
        container.addChild(container[key]);
    }
    return container[key];
};

function nameTag(player) {
    const localPlayer = gameManager.game[translations.activePlayer];
    const isSameTeam = findTeam(player) === findTeam(localPlayer);

    Reflect.defineProperty(player.nameText, "visible", {
        get: () => (settings.esp_.visibleNametags_ && settings.esp_.enabled_),
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
        x: (player[translations.pos].x - localPlayer[translations.pos].x) * 16,
        y: (localPlayer[translations.pos].y - player[translations.pos].y) * 16,
    };

    const game = gameManager.game;
    const isLocalPlayer = player === localPlayer;
    const isSpectating = game[translations.uiManager].spectating;
    const isAiming = game[translations.touch].shotDetected || game[translations.inputBinds].isBindDown(inputCommands.Fire);

    let aimAngle;
    const currentAimPos = isLocalPlayer && !isSpectating ? getCurrentAimPosition() : null;
    if (currentAimPos) {
        const screenPos = game[translations.camera][translations.pointToScreen]({ x: player[translations.pos].x, y: player[translations.pos].y });
        aimAngle = Math.atan2(screenPos.y - currentAimPos.y, screenPos.x - currentAimPos.x) - Math.PI;
    } else if (isLocalPlayer && !isSpectating && (!aimState.lastAimPos_ || !isAiming)) {
        aimAngle = Math.atan2(game[translations.input].mousePos._y - outer.innerHeight / 2, game[translations.input].mousePos._x - outer.innerWidth / 2);
    } else if (isLocalPlayer && !isSpectating && aimState.lastAimPos_) {
        const screenPos = game[translations.camera][translations.pointToScreen]({ x: player[translations.pos].x, y: player[translations.pos].y });
        aimAngle = Math.atan2(screenPos.y - aimState.lastAimPos_.clientY, screenPos.x - aimState.lastAimPos_.clientX) - Math.PI;
    } else {
        aimAngle = Math.atan2(player[translations.dir].x, player[translations.dir].y) - Math.PI / 2;
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
    const playerX = localPlayer[translations.pos].x;
    const playerY = localPlayer[translations.pos].y;
    const playerTeam = findTeam(localPlayer);
    const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
    const localLayer = getLocalLayer(localPlayer);

    players.forEach((player) => {
        if (!player.active || player[translations.netData][translations.dead] || localPlayer.__id === player.__id) return;

        const team = findTeam(player);
        const isOnEffectiveLayer = meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer);
        const isDowned = player.downed;
        const lineColor = team === playerTeam ? COLORS.BLUE_ : isOnEffectiveLayer && !isDowned ? COLORS.RED_ : COLORS.WHITE_;

        graphics.lineStyle(2, lineColor, 0.45);
        graphics.moveTo(0, 0);
        graphics.lineTo((player[translations.pos].x - playerX) * 16, (playerY - player[translations.pos].y) * 16);
    });
}


function renderGrenadeZones(localPlayer, graphics) {
    const playerX = localPlayer[translations.pos].x;
    const playerY = localPlayer[translations.pos].y;
    const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
    const playerLayer = getLocalLayer(localPlayer);

    const idToObj = gameManager.game?.[translations.objectCreator]?.[translations.idToObj];
    if (!idToObj) return;

    const grenades = Object.values(idToObj).filter(
        (obj) => (obj.__type === 9 && obj.type !== 'smoke') || (obj.smokeEmitter && obj.explodeParticle),
    );

    grenades.forEach((grenade) => {
        const effectiveMatch = meetsLayerCriteria(grenade.layer, playerLayer, isLocalOnBypassLayer);
        const opacity = effectiveMatch ? 0.1 : 0.2;
        const fillColor = effectiveMatch ? COLORS.RED_ : COLORS.WHITE_;
        const radius = 13 * 16;

        graphics.beginFill(fillColor, opacity);
        graphics.drawCircle((grenade.pos.x - playerX) * 16, (playerY - grenade.pos.y) * 16, radius);
        graphics.endFill();

        graphics.lineStyle(2, 0x000000, 0.2);
        graphics.drawCircle((grenade.pos.x - playerX) * 16, (playerY - grenade.pos.y) * 16, radius);
    });
}


function renderGrenadeTrajectory(localPlayer, graphics) {
    if (localPlayer[translations.localData][translations.curWeapIdx] !== 3) return;

    const activeItem = localPlayer[translations.netData][translations.activeWeapon];
    if (!activeItem) return;

    const game = gameManager.game;
    const playerX = localPlayer[translations.pos].x;
    const playerY = localPlayer[translations.pos].y;
    const throwableMaxRange = 18;
    let dirX;
    let dirY;

    const isSpectating = game[translations.uiManager].spectating;
    const isAiming = game[translations.touch].shotDetected || game[translations.inputBinds].isBindDown(inputCommands.Fire);

    const currentAimPos = !isSpectating ? getCurrentAimPosition() : null;
    if (currentAimPos) {
        const screenPos = game[translations.camera][translations.pointToScreen]({ x: playerX, y: playerY });
        const aimX = currentAimPos.x - screenPos.x;
        const aimY = currentAimPos.y - screenPos.y;
        const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
        dirX = aimX / magnitude;
        dirY = aimY / magnitude;
    } else if (!isSpectating && (!aimState.lastAimPos_ || !isAiming)) {
        const mouseX = game[translations.input].mousePos._x - outer.innerWidth / 2;
        const mouseY = game[translations.input].mousePos._y - outer.innerHeight / 2;
        const magnitude = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        dirX = mouseX / magnitude;
        dirY = mouseY / magnitude;
    } else if (!isSpectating && aimState.lastAimPos_) {
        const screenPos = game[translations.camera][translations.pointToScreen]({ x: playerX, y: playerY });
        const aimX = aimState.lastAimPos_.clientX - screenPos.x;
        const aimY = aimState.lastAimPos_.clientY - screenPos.y;
        const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
        dirX = aimX / magnitude;
        dirY = aimY / magnitude;
    } else {
        dirX = localPlayer[translations.dir].x;
        dirY = localPlayer[translations.dir].y;
    }

    const offsetAngle = 2 * (Math.PI / 180);
    const offsetDirX = dirX * Math.cos(offsetAngle) - dirY * Math.sin(offsetAngle);
    const offsetDirY = dirX * Math.sin(offsetAngle) + dirY * Math.cos(offsetAngle);
    dirX = offsetDirX;
    dirY = offsetDirY;

    const throwPower = Math.min(Math.max(inputState.toMouseLen_, 0), throwableMaxRange * 1.8) / 15;
    const isSmoke = activeItem.includes('smoke');
    const throwSpeed = isSmoke ? 11 : 15;
    const lineLength = throwPower * throwSpeed;

    const endX = playerX + dirX * lineLength;
    const endY = playerY - dirY * lineLength;

    let lineColor = GRENADE_COLORS.DEFAULT_;
    if (activeItem.includes('smoke')) {
        lineColor = GRENADE_COLORS.SMOKE_;
    } else if (activeItem.includes('frag')) {
        lineColor = GRENADE_COLORS.FRAG_;
    } else if (activeItem.includes('mirv')) {
        lineColor = GRENADE_COLORS.MIRV_;
    } else if (activeItem.includes('martyr')) {
        lineColor = GRENADE_COLORS.MARTYR_;
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

    if (settings.esp_.flashlights_.own_) {
        drawFlashlight(localPlayer, localPlayer, localBullet, localWeapon, graphics);
    }

    if (!settings.esp_.flashlights_.others_) return;

    const enemies = players.filter((player) => {
        if (!player.active) return false;
        if (player[translations.netData][translations.dead]) return false;
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
    const localPlayer = gameManager.game[translations.activePlayer];
    const players = gameManager.game[translations.playerBarn].playerPool[translations.pool];

    if (!pixi || !localPlayer || !localPlayer.container || !gameManager.game?.initialized) return;

    const lineGraphics = getGraphics(localPlayer.container, 'playerLines');
    lineGraphics.clear();
    if (settings.esp_.enabled_ && settings.esp_.players_) {
        renderPlayerLines(localPlayer, players, lineGraphics);
    }

    const grenadeGraphics = getGraphics(localPlayer.container, 'grenadeDangerZones');
    grenadeGraphics.clear();
    if (settings.esp_.enabled_ && settings.esp_.grenades_.explosions_) {
        renderGrenadeZones(localPlayer, grenadeGraphics);
    }

    const trajectoryGraphics = getGraphics(localPlayer.container, 'grenadeTrajectory');
    trajectoryGraphics.clear();
    if (settings.esp_.enabled_ && settings.esp_.grenades_.trajectories_) {
        renderGrenadeTrajectory(localPlayer, trajectoryGraphics);
    }

    const flashlightGraphics = getGraphics(localPlayer.container, 'flashlights');
    flashlightGraphics.clear();
    if (settings.esp_.enabled_ && (settings.esp_.flashlights_.others_ || settings.esp_.flashlights_.own_)) {
        renderFlashlights(localPlayer, players, flashlightGraphics);
    }

    players.forEach(nameTag);
}

export default function() {
    gameManager.pixi._ticker.add(renderESP);
}
