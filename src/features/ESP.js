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

const v2 = {
  create_: (x, y) => ({ x, y }),
  copy_: (v) => ({ x: v.x, y: v.y }),
  add_: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  sub_: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  mul_: (v, s) => ({ x: v.x * s, y: v.y * s }),
  dot_: (a, b) => a.x * b.x + a.y * b.y,
  length_: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
  lengthSqr_: (v) => v.x * v.x + v.y * v.y,
  normalize_: (v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    return len > 0.0001 ? { x: v.x / len, y: v.y / len } : { x: 1, y: 0 };
  },
  perp_: (v) => ({ x: -v.y, y: v.x }),
};

const sameLayer = (a, b) => {
  return (a & 0x1) === (b & 0x1) || (a & 0x2 && b & 0x2);
};

const calculateGunPosition = (playerPos, direction, weapon) => {
  if (!weapon) return playerPos;

  const barrelLength = weapon.barrelLength ?? 0;
  return v2.add_(playerPos, v2.mul_(direction, barrelLength));
};

const collisionHelpers = {
  intersectSegmentAabb_: (a, b, min, max) => {
    const dir = v2.sub_(b, a);
    const invDir = { x: 1 / dir.x, y: 1 / dir.y };

    const t1 = (min.x - a.x) * invDir.x;
    const t2 = (max.x - a.x) * invDir.x;
    const t3 = (min.y - a.y) * invDir.y;
    const t4 = (max.y - a.y) * invDir.y;

    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0 || tmin > tmax || tmin > 1) return null;

    const t = Math.max(0, tmin);
    const point = v2.add_(a, v2.mul_(dir, t));

    const center = v2.mul_(v2.add_(min, max), 0.5);
    const extent = v2.mul_(v2.sub_(max, min), 0.5);
    const localPt = v2.sub_(point, center);

    let normal;
    const dx = Math.abs(Math.abs(localPt.x) - extent.x);
    const dy = Math.abs(Math.abs(localPt.y) - extent.y);

    if (dx < dy) {
      normal = { x: localPt.x > 0 ? 1 : -1, y: 0 };
    } else {
      normal = { x: 0, y: localPt.y > 0 ? 1 : -1 };
    }

    return { point, normal };
  },

  intersectSegmentCircle_: (a, b, pos, rad) => {
    const d = v2.sub_(b, a);
    const f = v2.sub_(a, pos);

    const aa = v2.dot_(d, d);
    const bb = 2 * v2.dot_(f, d);
    const c = v2.dot_(f, f) - rad * rad;

    let discriminant = bb * bb - 4 * aa * c;
    if (discriminant < 0) return null;

    discriminant = Math.sqrt(discriminant);
    const t1 = (-bb - discriminant) / (2 * aa);
    const t2 = (-bb + discriminant) / (2 * aa);

    let t = -1;
    if (t1 >= 0 && t1 <= 1) t = t1;
    else if (t2 >= 0 && t2 <= 1) t = t2;

    if (t < 0) return null;

    const point = v2.add_(a, v2.mul_(d, t));
    const normal = v2.normalize_(v2.sub_(point, pos));

    return { point, normal };
  },

  intersectSegment_: (collider, a, b) => {
    if (!collider) return null;

    if (collider.type === 1) {
      return collisionHelpers.intersectSegmentAabb_(a, b, collider.min, collider.max);
    } else if (collider.type === 0) {
      return collisionHelpers.intersectSegmentCircle_(a, b, collider.pos, collider.rad);
    }

    return null;
  },
};

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
  const localPlayer = gameManager.game[translations.activePlayer_];
  const isSameTeam = findTeam(player) === findTeam(localPlayer);

  Reflect.defineProperty(player.nameText, 'visible', {
    get: () => settings.esp_.visibleNametags_ && settings.esp_.enabled_,
    set: () => { },
  });

  player.nameText.visible = true;
  player.nameText.tint = isSameTeam ? 0xcbddf5 : 0xff2828;
  player.nameText.style.fill = isSameTeam ? '#3a88f4' : '#ff2828';
  player.nameText.style.fontSize = 20;
  player.nameText.style.dropShadowBlur = 0.1;
}

const drawFlashlight = (
  localPlayer,
  player,
  bullet,
  weapon,
  graphics,
  color = 0x0000ff,
  opacity = 0.1
) => {
  if (!bullet || !weapon) return;

  const game = gameManager.game;
  const isLocalPlayer = player === localPlayer;
  const isSpectating = game[translations.uiManager_].spectating;
  const isAiming =
    game[translations.touch_].shotDetected ||
    game[translations.inputBinds_].isBindDown(inputCommands.Fire_);

  let aimAngle;
  const currentAimPos = isLocalPlayer && !isSpectating ? getCurrentAimPosition() : null;
  if (currentAimPos) {
    const screenPos = game[translations.camera_][translations.pointToScreen_]({
      x: player[translations.pos_].x,
      y: player[translations.pos_].y,
    });
    aimAngle = Math.atan2(screenPos.y - currentAimPos.y, screenPos.x - currentAimPos.x) - Math.PI;
  } else if (isLocalPlayer && !isSpectating && (!aimState.lastAimPos_ || !isAiming)) {
    aimAngle = Math.atan2(
      game[translations.input_].mousePos._y - outer.innerHeight / 2,
      game[translations.input_].mousePos._x - outer.innerWidth / 2
    );
  } else if (isLocalPlayer && !isSpectating && aimState.lastAimPos_) {
    const screenPos = game[translations.camera_][translations.pointToScreen_]({
      x: player[translations.pos_].x,
      y: player[translations.pos_].y,
    });
    aimAngle =
      Math.atan2(
        screenPos.y - aimState.lastAimPos_.clientY,
        screenPos.x - aimState.lastAimPos_.clientX
      ) - Math.PI;
  } else {
    aimAngle = Math.atan2(player[translations.dir_].x, player[translations.dir_].y) - Math.PI / 2;
  }

  const dir = v2.create_(Math.cos(aimAngle), -Math.sin(aimAngle));
  const gunPos = calculateGunPosition(player[translations.pos_], dir, weapon);

  const center = {
    x: (gunPos.x - localPlayer[translations.pos_].x) * 16,
    y: (localPlayer[translations.pos_].y - gunPos.y) * 16,
  };

  const spreadAngle = weapon.shotSpread * (Math.PI / 180);
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
};

function renderPlayerLines(localPlayer, players, graphics) {
  const playerX = localPlayer[translations.pos_].x;
  const playerY = localPlayer[translations.pos_].y;
  const playerTeam = findTeam(localPlayer);
  const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
  const localLayer = getLocalLayer(localPlayer);

  players.forEach((player) => {
    if (
      !player.active ||
      player[translations.netData_][translations.dead_] ||
      localPlayer.__id === player.__id
    )
      return;

    const team = findTeam(player);
    const isOnEffectiveLayer = meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer);
    const isDowned = player.downed;
    const lineColor =
      team === playerTeam
        ? COLORS.BLUE_
        : isOnEffectiveLayer && !isDowned
          ? COLORS.RED_
          : COLORS.WHITE_;

    graphics.lineStyle(2, lineColor, 0.45);
    graphics.moveTo(0, 0);
    graphics.lineTo(
      (player[translations.pos_].x - playerX) * 16,
      (playerY - player[translations.pos_].y) * 16
    );
  });
}

function renderGrenadeZones(localPlayer, graphics) {
  const playerX = localPlayer[translations.pos_].x;
  const playerY = localPlayer[translations.pos_].y;
  const isLocalOnBypassLayer = isBypassLayer(localPlayer.layer);
  const playerLayer = getLocalLayer(localPlayer);

  const idToObj = gameManager.game?.[translations.objectCreator_]?.[translations.idToObj_];
  if (!idToObj) return;

  const grenades = Object.values(idToObj).filter(
    (obj) => (obj.__type === 9 && obj.type !== 'smoke') || (obj.smokeEmitter && obj.explodeParticle)
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
  if (localPlayer[translations.localData_][translations.curWeapIdx_] !== 3) return;

  const activeItem = localPlayer[translations.netData_][translations.activeWeapon_];
  if (!activeItem) return;

  const game = gameManager.game;
  const playerX = localPlayer[translations.pos_].x;
  const playerY = localPlayer[translations.pos_].y;
  const throwableMaxRange = 18;
  let dirX;
  let dirY;

  const isSpectating = game[translations.uiManager_].spectating;
  const isAiming =
    game[translations.touch_].shotDetected ||
    game[translations.inputBinds_].isBindDown(inputCommands.Fire_);

  const currentAimPos = !isSpectating ? getCurrentAimPosition() : null;
  if (currentAimPos) {
    const screenPos = game[translations.camera_][translations.pointToScreen_]({
      x: playerX,
      y: playerY,
    });
    const aimX = currentAimPos.x - screenPos.x;
    const aimY = currentAimPos.y - screenPos.y;
    const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
    dirX = aimX / magnitude;
    dirY = aimY / magnitude;
  } else if (!isSpectating && (!aimState.lastAimPos_ || !isAiming)) {
    const mouseX = game[translations.input_].mousePos._x - outer.innerWidth / 2;
    const mouseY = game[translations.input_].mousePos._y - outer.innerHeight / 2;
    const magnitude = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    dirX = mouseX / magnitude;
    dirY = mouseY / magnitude;
  } else if (!isSpectating && aimState.lastAimPos_) {
    const screenPos = game[translations.camera_][translations.pointToScreen_]({
      x: playerX,
      y: playerY,
    });
    const aimX = aimState.lastAimPos_.clientX - screenPos.x;
    const aimY = aimState.lastAimPos_.clientY - screenPos.y;
    const magnitude = Math.sqrt(aimX * aimX + aimY * aimY);
    dirX = aimX / magnitude;
    dirY = aimY / magnitude;
  } else {
    dirX = localPlayer[translations.dir_].x;
    dirY = localPlayer[translations.dir_].y;
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

function calculateTrajectory(startPos, dir, distance, layer, localPlayer, maxBounces = 3) {
  const segments = [];
  const BULLET_HEIGHT = 0.25;
  const REFLECT_DIST_DECAY = 1.5;

  let pos = v2.copy_(startPos);
  let currentDir = v2.normalize_(dir);
  let remainingDist = distance;
  let bounceCount = 0;

  const game = gameManager.game;
  const idToObj = game?.[translations.objectCreator_]?.[translations.idToObj_];
  if (!idToObj) return segments;

  const trueLayer =
    isLayerSpoofActive && originalLayerValue !== undefined ? originalLayerValue : layer;

  const obstacles = Object.values(idToObj).filter((obj) => {
    if (!obj.collider) return false;
    if (obj.dead) return false;
    if (obj.height !== undefined && obj.height < BULLET_HEIGHT) return false;
    if (obj.layer !== undefined && !sameLayer(obj.layer, trueLayer)) return false;
    if (obj?.type.includes('decal') || obj?.type.includes('decal')) return false;
    return true;
  });

  const playerBarn = game?.[translations.playerBarn_];
  const playerPool = playerBarn?.playerPool?.[translations.pool_];
  const configKey = translations.config_;
  const gameConfig = configKey ? game?.[configKey] : null;
  const basePlayerRadius = gameConfig?.player?.radius ?? 1;

  const playerColliders = [];

  if (Array.isArray(playerPool)) {
    for (const player of playerPool) {
      if (!player || !player.active) continue;
      if (player.__id === localPlayer.__id) continue;

      const netData = player[translations.netData_];
      if (!netData) continue;
      if (netData[translations.dead_]) continue;

      const playerLayer = player.layer ?? netData.m_layer ?? 0;
      if (!sameLayer(playerLayer, trueLayer) && !(playerLayer & 0x2)) continue;

      const playerPos = player[translations.pos_] ?? player.m_pos;
      if (!playerPos) continue;

      const scale =
        typeof netData.m_scale === 'number'
          ? netData.m_scale
          : typeof netData.scale === 'number'
            ? netData.scale
            : 1;

      const radCandidate =
        typeof player.m_rad === 'number'
          ? player.m_rad
          : typeof player.rad === 'number'
            ? player.rad
            : basePlayerRadius * scale;

      if (!(radCandidate > 0)) continue;

      playerColliders.push({ pos: { x: playerPos.x, y: playerPos.y }, rad: radCandidate });
    }
  }

  while (bounceCount <= maxBounces && remainingDist > 0.1) {
    const endPos = v2.add_(pos, v2.mul_(currentDir, remainingDist));

    let closestCol = null;
    let closestDist = Infinity;
    let closestObstacle = null;
    let closestHitType = null;

    for (const obstacle of obstacles) {
      if (obstacle.collidable === false) continue;

      const colliderToUse = obstacle.collider;

      const res = collisionHelpers.intersectSegment_(colliderToUse, pos, endPos);
      if (res) {
        const dist = v2.lengthSqr_(v2.sub_(res.point, pos));
        if (dist < closestDist && dist > 0.0001) {
          closestDist = dist;
          closestCol = res;
          closestObstacle = obstacle;
          closestHitType = 'obstacle';
        }
      }
    }

    for (const collider of playerColliders) {
      const res = collisionHelpers.intersectSegmentCircle_(pos, endPos, collider.pos, collider.rad);
      if (res) {
        const dist = v2.lengthSqr_(v2.sub_(res.point, pos));
        if (dist < closestDist && dist > 0.0001) {
          closestDist = dist;
          closestCol = res;
          closestObstacle = null;
          closestHitType = 'player';
        }
      }
    }

    if (closestCol) {
      segments.push({
        start: v2.copy_(pos),
        end: v2.copy_(closestCol.point),
        hitPlayer: closestHitType === 'player',
      });
      if (closestHitType === 'player') {
        break;
      }

      const obstacleType = closestObstacle?.type;
      let reflectBullets = false;

      if (closestObstacle && closestObstacle.reflectBullets !== undefined) {
        reflectBullets = closestObstacle.reflectBullets === true;
      } else {
        const reflectivePatterns = [
          'metal_wall',
          'stone_wall',
          'container_wall',
          'hedgehog',
          'bollard',
          'airdop',
          'silo',
          'collider',
          'warehouse_wall',
        ];

        reflectBullets = reflectivePatterns.some((pattern) => obstacleType?.includes(pattern));
      }
      //if (bounceCount === 0 && closestObstacle) {
      //  //debug
      //  outer.console.log('Hit:', obstacleType, 'reflects:', reflectBullets);
      //}
      if (reflectBullets && bounceCount < maxBounces) {
        const dot = v2.dot_(currentDir, closestCol.normal);
        currentDir = v2.add_(v2.mul_(closestCol.normal, dot * -2), currentDir);
        currentDir = v2.normalize_(currentDir);

        pos = v2.add_(closestCol.point, v2.mul_(currentDir, 0.01));
        const traveledDist = Math.sqrt(closestDist);
        remainingDist = Math.max(1, remainingDist - traveledDist) / REFLECT_DIST_DECAY;
        bounceCount++;
      } else {
        break;
      }
    } else {
      segments.push({
        start: v2.copy_(pos),
        end: endPos,
        hitPlayer: false,
      });
      break;
    }
  }

  return segments;
}

function renderBulletTrajectory(localPlayer, graphics) {
  const localWeapon = findWeapon(localPlayer);
  const localBullet = findBullet(localWeapon);

  if (!localBullet || !localWeapon) return;

  const game = gameManager.game;
  const playerPos = localPlayer[translations.pos_];
  const isSpectating = game[translations.uiManager_].spectating;
  const isAiming =
    game[translations.touch_].shotDetected ||
    game[translations.inputBinds_].isBindDown(inputCommands.Fire_);

  let aimAngle;
  const currentAimPos = !isSpectating ? getCurrentAimPosition() : null;
  if (currentAimPos) {
    const screenPos = game[translations.camera_][translations.pointToScreen_]({
      x: playerPos.x,
      y: playerPos.y,
    });
    aimAngle = Math.atan2(screenPos.y - currentAimPos.y, screenPos.x - currentAimPos.x) - Math.PI;
  } else if (!isSpectating && (!aimState.lastAimPos_ || !isAiming)) {
    aimAngle = Math.atan2(
      game[translations.input_].mousePos._y - outer.innerHeight / 2,
      game[translations.input_].mousePos._x - outer.innerWidth / 2
    );
  } else if (!isSpectating && aimState.lastAimPos_) {
    const screenPos = game[translations.camera_][translations.pointToScreen_]({
      x: playerPos.x,
      y: playerPos.y,
    });
    aimAngle =
      Math.atan2(
        screenPos.y - aimState.lastAimPos_.clientY,
        screenPos.x - aimState.lastAimPos_.clientX
      ) - Math.PI;
  } else {
    aimAngle =
      Math.atan2(localPlayer[translations.dir_].x, localPlayer[translations.dir_].y) - Math.PI / 2;
  }

  const dir = v2.create_(Math.cos(aimAngle), -Math.sin(aimAngle));
  const gunPos = calculateGunPosition(playerPos, dir, localWeapon);

  const BULLET_HEIGHT = 0.25;
  const idToObj = game?.[translations.objectCreator_]?.[translations.idToObj_];
  const trueLayer =
    isLayerSpoofActive && originalLayerValue !== undefined ? originalLayerValue : localPlayer.layer;

  let isBarrelBlocked = false;
  if (idToObj) {
    const obstacles = Object.values(idToObj).filter((obj) => {
      if (!obj.collider) return false;
      if (obj.dead) return false;
      if (obj.height !== undefined && obj.height < BULLET_HEIGHT) return false;
      if (obj.layer !== undefined && !sameLayer(obj.layer, trueLayer)) return false;
      if (obj?.type.includes('decal')) return false;
      return true;
    });

    for (const obstacle of obstacles) {
      if (obstacle.collidable === false) continue;
      const collision = collisionHelpers.intersectSegment_(obstacle.collider, playerPos, gunPos);
      if (collision) {
        isBarrelBlocked = true;
        break;
      }
    }
  }

  if (isBarrelBlocked) {
    graphics.lineStyle(3, trajectoryColor, 0.7);
    const shortDist = 1;
    const blockedEnd = v2.add_(playerPos, v2.mul_(dir, shortDist));
    graphics.moveTo(0, 0);
    graphics.lineTo(
      (blockedEnd.x - playerPos.x) * 16,
      (playerPos.y - blockedEnd.y) * 16
    );
    return;
  }

  const segments = calculateTrajectory(
    gunPos,
    dir,
    localBullet.distance,
    localPlayer.layer,
    localPlayer
  );

  const hitPlayer = segments.some((segment) => segment.hitPlayer);
  const trajectoryColor = hitPlayer ? COLORS.RED_ : 0xff00ff;
  const trajectoryWidth = hitPlayer ? 4 : 2;

  graphics.lineStyle(trajectoryWidth, trajectoryColor, 0.5);

  for (const segment of segments) {
    const startScreen = {
      x: (segment.start.x - playerPos.x) * 16,
      y: (playerPos.y - segment.start.y) * 16,
    };
    const endScreen = {
      x: (segment.end.x - playerPos.x) * 16,
      y: (playerPos.y - segment.end.y) * 16,
    };

    graphics.moveTo(startScreen.x, startScreen.y);
    graphics.lineTo(endScreen.x, endScreen.y);
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
    if (player[translations.netData_][translations.dead_]) return false;
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
  try {
    const pixi = gameManager.pixi;
    const localPlayer = gameManager.game[translations.activePlayer_];
    const players = gameManager.game[translations.playerBarn_].playerPool[translations.pool_];

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
    if (settings.esp_.enabled_ && settings.esp_.grenades_.trajectory_) {
      renderGrenadeTrajectory(localPlayer, trajectoryGraphics);
    }

    const flashlightGraphics = getGraphics(localPlayer.container, 'flashlights');
    flashlightGraphics.clear();
    if (
      settings.esp_.enabled_ &&
      (settings.esp_.flashlights_.others_ || settings.esp_.flashlights_.own_)
    ) {
      renderFlashlights(localPlayer, players, flashlightGraphics);
    }

    const trajectoryGraphics2 = getGraphics(localPlayer.container, 'bulletTrajectory');
    trajectoryGraphics2.clear();
    if (settings.esp_.enabled_ && settings.esp_.flashlights_.trajectory_) {
      renderBulletTrajectory(localPlayer, trajectoryGraphics2);
    }

    players.forEach(nameTag);
  } catch { }
}

export default function () {
  gameManager.pixi._ticker.add(renderESP);
}
