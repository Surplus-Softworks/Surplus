import { settings, getUIRoot, inputState, aimState } from '@/core/state.js';
import { findTeam, findBullet, findWeapon, inputCommands } from '@/utils/constants.js';
import { gameManager } from '@/core/state.js';
import { translations } from '@/core/obfuscatedNameTranslator.js';
import { ref_addEventListener } from '@/core/hook.js';
import { isLayerSpoofActive, originalLayerValue } from '@/features/LayerSpoofer.js';
import {
  AimState,
  setAimState,
  getCurrentAimPosition,
  getPing,
  aimOverlays,
} from '@/core/aimController.js';
import { outerDocument, outer } from '@/core/outer.js';
import { v2, collisionHelpers, sameLayer } from '@/utils/math.js';

const isBypassLayer = (layer) => layer === 2 || layer === 3;

const state = {
  focusedEnemy_: null,
  previousEnemies_: {},
  currentEnemy_: null,
  meleeLockEnemy_: null,
  velocityBuffer_: {},
  lastTargetScreenPos_: null,
};

const AIM_SMOOTH_DISTANCE_PX = 6;
const AIM_SMOOTH_ANGLE = Math.PI / 90;
const MELEE_ENGAGE_DISTANCE = 5.5;

const computeAimAngle = (point) => {
  if (!point) return 0;
  const centerX = outer.innerWidth / 2;
  const centerY = outer.innerHeight / 2;
  return Math.atan2(point.y - centerY, point.x - centerX);
};

const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

const shouldSmoothAim = (currentPos, nextPos) => {
  if (!nextPos) return false;
  if (!currentPos) return true;

  const distance = Math.hypot(nextPos.x - currentPos.x, nextPos.y - currentPos.y);
  if (distance > AIM_SMOOTH_DISTANCE_PX) return true;

  const angleDiff = Math.abs(
    normalizeAngle(computeAimAngle(nextPos) - computeAimAngle(currentPos))
  );
  return angleDiff > AIM_SMOOTH_ANGLE;
};

const getLocalLayer = (player) => {
  if (isBypassLayer(player.layer)) return player.layer;
  if (isLayerSpoofActive && originalLayerValue !== undefined) return originalLayerValue;
  return player.layer;
};

const meetsLayerCriteria = (targetLayer, localLayer, isLocalOnBypass) => {
  if (isBypassLayer(targetLayer) || isLocalOnBypass) return true;
  return targetLayer === localLayer;
};

const BLOCKING_OBSTACLE_PATTERNS = [
  'metal_wall_',
  'brick_wall_',
  'concrete_wall_',
  'stone_wall_',
  'container_wall_',
  '_wall_int_',
  'bank_wall_',
  'barn_wall_',
  'cabin_wall_',
  'hut_wall_',
  'house_wall_',
  'mansion_wall_',
  'police_wall_',
  'shack_wall_',
  'outhouse_wall_',
  'teahouse_wall_',
  'warehouse_wall_',
  'silo_',
  'bollard_',
  'sandbags_',
  'hedgehog',
];

const NON_BLOCKING_OBSTACLE_PATTERNS = [
  'tree_',
  'bush_',
  'brush_',
  'crate_',
  'barrel_',
  'refrigerator_',
  'control_panel_',
  'chest_',
  'case_',
  'oven_',
  'bed_',
  'bookshelf_',
  'couch_',
  'table_',
  'drawers_',
  'window',
  'glass_wall_',
  'locker_',
  'deposit_box_',
  'toilet_',
  'pot_',
  'planter_',
  'pumpkin_',
  'potato_',
  'egg_',
  'woodpile_',
  'decal',
  'stone_01',
  'stone_02',
  'stone_03',
  'stone_04',
  'stone_05',
  'stone_06',
  'stone_07',
  'stone_08',
  'stone_09',
  'stone_0',
];

const isObstacleBlocking = (obstacle) => {
  if (obstacle.collidable === false) return false;

  const obstacleType = obstacle.type || '';

  if (obstacle.isWall === true) return true;

  if (obstacle.destructible === false) return true;

  for (const pattern of BLOCKING_OBSTACLE_PATTERNS) {
    if (obstacleType.includes(pattern)) return true;
  }

  for (const pattern of NON_BLOCKING_OBSTACLE_PATTERNS) {
    if (obstacleType.includes(pattern)) return false;
  }

  if (obstacle.health !== undefined && obstacle.health > 200) {
    return true;
  }

  return false;
};

const canCastToPlayer = (localPlayer, targetPlayer, weapon, bullet) => {
  if (!weapon || !bullet) {
    return true;
  }

  const game = gameManager.game;
  const idToObj = game?.[translations.objectCreator_]?.[translations.idToObj_];
  if (!idToObj) {
    return true;
  }

  const BULLET_HEIGHT = 0.25;
  const trueLayer =
    isLayerSpoofActive && originalLayerValue !== undefined ? originalLayerValue : localPlayer.layer;

  const playerPos = localPlayer[translations.visualPos_];
  const targetPos = targetPlayer[translations.visualPos_];

  const dx = targetPos.x - playerPos.x;
  const dy = targetPos.y - playerPos.y;
  const aimAngle = Math.atan2(dy, dx);

  const dir = v2.create_(Math.cos(aimAngle), Math.sin(aimAngle));

  const baseSpread = (weapon.shotSpread || 0) * (Math.PI / 180);
  const generousSpread = baseSpread * 1.5;

  const maxDistance = Math.hypot(dx, dy);

  const rayCount = Math.max(15, Math.ceil((weapon.shotSpread || 0) * 1.5));

  const allObstacles = Object.values(idToObj).filter((obj) => {
    if (!obj.collider) return false;
    if (obj.dead) return false;
    if (obj.height !== undefined && obj.height < BULLET_HEIGHT) return false;
    if (obj.layer !== undefined && !sameLayer(obj.layer, trueLayer)) return false;
    return true;
  });

  const blockingObstacles = allObstacles.filter(isObstacleBlocking);

  if (blockingObstacles.length === 0) {
    return true;
  }

  for (let i = 0; i < rayCount; i++) {
    const t = rayCount === 1 ? 0.5 : i / (rayCount - 1);
    const rayAngle = aimAngle - generousSpread / 2 + generousSpread * t;
    const rayDir = v2.create_(Math.cos(rayAngle), Math.sin(rayAngle));

    const endPos = v2.add_(playerPos, v2.mul_(rayDir, maxDistance));
    let blocked = false;

    for (const obstacle of blockingObstacles) {
      const collision = collisionHelpers.intersectSegment_(obstacle.collider, playerPos, endPos);
      if (collision) {
        const distToCollision = v2.length_(v2.sub_(collision.point, playerPos));
        if (distToCollision < maxDistance - 0.5) {
          blocked = true;
          break;
        }
      }
    }

    if (!blocked) {
      return true;
    }
  }

  return false;
};

const queueInput = (command) => inputState.queuedInputs_.push(command);

const handleKeydown = (event) => {
  if (event.code !== settings.keybinds_.toggleStickyTarget_) return;
  if (state.focusedEnemy_) {
    state.focusedEnemy_ = null;
    setAimState(new AimState('idle', null, null, true));
    return;
  }
  if (settings.aimbot_.stickyTarget_) {
    state.focusedEnemy_ = state.currentEnemy_;
  }
};

Reflect.apply(ref_addEventListener, outer, ['keydown', handleKeydown]);

let tickerAttached = false;

function getDistance(x1, y1, x2, y2) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function calcAngle(playerPos, mePos) {
  const dx = mePos.x - playerPos.x;
  const dy = mePos.y - playerPos.y;

  return Math.atan2(dy, dx);
}

function predictPosition(enemy, currentPlayer) {
  if (!enemy || !currentPlayer) return null;

  const enemyPos = enemy[translations.visualPos_];
  const currentPlayerPos = currentPlayer[translations.visualPos_];
  const now = performance.now();
  const enemyId = enemy.__id;
  const ping = getPing() / 2;

  const history = state.previousEnemies_[enemyId] ?? (state.previousEnemies_[enemyId] = []);
  history.push([now, { ...enemyPos }]);
  if (history.length > 20) history.shift();

  if (history.length < 20) {
    return gameManager.game[translations.camera_][translations.pointToScreen_]({
      x: enemyPos.x,
      y: enemyPos.y,
    });
  }

  const deltaTime = (now - history[0][0]) / 1000;
  const velocity = {
    x: (enemyPos.x - history[0][1].x) / deltaTime,
    y: (enemyPos.y - history[0][1].y) / deltaTime,
  };

  const weapon = findWeapon(currentPlayer);
  const bullet = findBullet(weapon);
  const bulletSpeed = bullet?.speed || 1000;

  const { x: vex, y: vey } = velocity;
  const dx = enemyPos.x - currentPlayerPos.x;
  const dy = enemyPos.y - currentPlayerPos.y;
  const vb = bulletSpeed;

  const a = vb ** 2 - vex ** 2 - vey ** 2;
  const b = -2 * (vex * dx + vey * dy);
  const c = -(dx ** 2) - dy ** 2;

  let t;

  if (Math.abs(a) < 1e-6) {
    t = -c / b + ping;
  } else {
    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0) {
      return gameManager.game[translations.camera_][translations.pointToScreen_]({
        x: enemyPos.x,
        y: enemyPos.y,
      });
    }

    const sqrtD = Math.sqrt(discriminant);
    const t1 = (-b - sqrtD) / (2 * a);
    const t2 = (-b + sqrtD) / (2 * a);
    t = (Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2)) + ping;

    if (t < 0 || t > 5) {
      return gameManager.game[translations.camera_][translations.pointToScreen_]({
        x: enemyPos.x,
        y: enemyPos.y,
      });
    }
  }

  const predictedPos = {
    x: enemyPos.x + vex * t,
    y: enemyPos.y + vey * t,
  };

  return gameManager.game[translations.camera_][translations.pointToScreen_](predictedPos);
}

function findTarget(players, me) {
  const meTeam = findTeam(me);
  const isLocalOnBypassLayer = isBypassLayer(me.layer);
  const localLayer = getLocalLayer(me);
  let enemy = null;
  let minDistance = Infinity;
  const fovRadiusSquared = settings.aimbot_.fov_ ** 2;

  for (const player of players) {
    if (!player.active) continue;
    if (player[translations.netData_][translations.dead_]) continue;
    if (!settings.aimbot_.targetKnocked_ && player.downed) continue;
    if (me.__id === player.__id) continue;
    if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) continue;
    if (findTeam(player) === meTeam) continue;

    const screenPos = gameManager.game[translations.camera_][translations.pointToScreen_]({
      x: player[translations.visualPos_].x,
      y: player[translations.visualPos_].y,
    });

    const distance = getDistance(
      screenPos.x,
      screenPos.y,
      gameManager.game[translations.input_].mousePos._x,
      gameManager.game[translations.input_].mousePos._y
    );

    if (distance > fovRadiusSquared) continue;

    if (distance < minDistance) {
      minDistance = distance;
      enemy = player;
    }
  }

  return enemy;
}

function findClosestTarget(players, me) {
  const meTeam = findTeam(me);
  const isLocalOnBypassLayer = isBypassLayer(me.layer);
  const localLayer = getLocalLayer(me);
  let enemy = null;
  let minDistance = Infinity;

  for (const player of players) {
    if (!player.active) continue;
    if (player[translations.netData_][translations.dead_]) continue;
    if (!settings.aimbot_.targetKnocked_ && player.downed) continue;
    if (me.__id === player.__id) continue;
    if (!meetsLayerCriteria(player.layer, localLayer, isLocalOnBypassLayer)) continue;
    if (findTeam(player) === meTeam) continue;

    const mePos = me[translations.visualPos_];
    const playerPos = player[translations.visualPos_];
    const distance = getDistance(mePos.x, mePos.y, playerPos.x, playerPos.y);

    if (distance < minDistance) {
      minDistance = distance;
      enemy = player;
    }
  }

  return enemy;
}

function aimbotTicker() {
  try {
    const game = gameManager.game;
    if (
      !game.initialized ||
      !(settings.aimbot_.enabled_ || settings.meleeLock_.enabled_) ||
      game[translations.uiManager_].spectating
    ) {
      setAimState(new AimState('idle'));
      aimOverlays.hideAll();
      state.lastTargetScreenPos_ = null;
      return;
    }

    const players = game[translations.playerBarn_].playerPool[translations.pool_];
    const me = game[translations.activePlayer_];
    const isLocalOnBypassLayer = isBypassLayer(me.layer);
    let aimUpdated = false;
    let dotTargetPos = null;
    let previewTargetPos = null;
    let isDotTargetShootable = false;

    try {
      const currentWeaponIndex =
        game[translations.activePlayer_][translations.localData_][translations.curWeapIdx_];
      const isMeleeEquipped = currentWeaponIndex === 2;
      const isGrenadeEquipped = currentWeaponIndex === 3;
      const isAiming = game[translations.inputBinds_].isBindDown(inputCommands.Fire_);
      const wantsMeleeLock = settings.meleeLock_.enabled_ && isAiming;

      let meleeEnemy = state.meleeLockEnemy_;
      if (wantsMeleeLock) {
        if (
          !meleeEnemy ||
          !meleeEnemy.active ||
          meleeEnemy[translations.netData_][translations.dead_]
        ) {
          meleeEnemy = findClosestTarget(players, me);
          state.meleeLockEnemy_ = meleeEnemy;
        }
      } else {
        meleeEnemy = null;
        state.meleeLockEnemy_ = null;
      }

      let distanceToMeleeEnemy = Infinity;
      if (meleeEnemy) {
        const mePos = me[translations.visualPos_];
        const enemyPos = meleeEnemy[translations.visualPos_];
        distanceToMeleeEnemy = Math.hypot(mePos.x - enemyPos.x, mePos.y - enemyPos.y);
      }

      const meleeTargetInRange = distanceToMeleeEnemy <= MELEE_ENGAGE_DISTANCE;

      if (
        wantsMeleeLock &&
        settings.meleeLock_.autoMelee_ &&
        !isMeleeEquipped &&
        meleeTargetInRange
      ) {
        queueInput(inputCommands.EquipMelee_);
      }

      const meleeLockActive = wantsMeleeLock && isMeleeEquipped && meleeTargetInRange && meleeEnemy;

      if (meleeLockActive) {
        const mePos = me[translations.visualPos_];
        const enemyPos = meleeEnemy[translations.visualPos_];

        const weapon = findWeapon(me);
        const bullet = findBullet(weapon);
        const isMeleeTargetShootable =
          !settings.aimbot_.wallcheck_ || canCastToPlayer(me, meleeEnemy, weapon, bullet);

        if (isMeleeTargetShootable) {
          const moveAngle = calcAngle(enemyPos, mePos) + Math.PI;
          const moveDir = {
            touchMoveActive: true,
            touchMoveLen: 255,
            x: Math.cos(moveAngle),
            y: Math.sin(moveAngle),
          };

          const screenPos = game[translations.camera_][translations.pointToScreen_]({
            x: enemyPos.x,
            y: enemyPos.y,
          });
          setAimState(new AimState('meleeLock', { x: screenPos.x, y: screenPos.y }, moveDir, true));
          aimUpdated = true;
          aimOverlays.hideAll();
          state.lastTargetScreenPos_ = null;
          return;
        }
      }

      if (wantsMeleeLock && !meleeTargetInRange) {
        state.meleeLockEnemy_ = null;
      }

      if (!settings.aimbot_.enabled_ || isMeleeEquipped || isGrenadeEquipped) {
        setAimState(new AimState('idle'));
        aimOverlays.hideAll();
        state.lastTargetScreenPos_ = null;
        return;
      }

      const canEngageAimbot = isAiming;

      let enemy =
        state.focusedEnemy_?.active &&
          !state.focusedEnemy_[translations.netData_][translations.dead_]
          ? state.focusedEnemy_
          : null;

      if (enemy) {
        const localLayer = getLocalLayer(me);
        if (!meetsLayerCriteria(enemy.layer, localLayer, isLocalOnBypassLayer)) {
          enemy = null;
          state.focusedEnemy_ = null;
          setAimState(new AimState('idle', null, null, true));
        }
      }

      if (!enemy) {
        if (state.focusedEnemy_) {
          state.focusedEnemy_ = null;
          setAimState(new AimState('idle', null, null, true));
        }
        enemy = findTarget(players, me);
        state.currentEnemy_ = enemy;
      }

      if (enemy) {
        const mePos = me[translations.visualPos_];
        const enemyPos = enemy[translations.visualPos_];
        const distanceToEnemy = Math.hypot(mePos.x - enemyPos.x, mePos.y - enemyPos.y);

        if (enemy !== state.currentEnemy_ && !state.focusedEnemy_) {
          state.currentEnemy_ = enemy;
          state.previousEnemies_[enemy.__id] = [];
          state.velocityBuffer_[enemy.__id] = [];
        }

        const predictedPos = predictPosition(enemy, me);
        if (!predictedPos) {
          setAimState(new AimState('idle'));
          aimOverlays.hideAll();
          state.lastTargetScreenPos_ = null;
          return;
        }

        previewTargetPos = { x: predictedPos.x, y: predictedPos.y };

        const weapon = findWeapon(me);
        const bullet = findBullet(weapon);

        const isTargetShootable =
          !settings.aimbot_.wallcheck_ || canCastToPlayer(me, enemy, weapon, bullet);
        console.log(canEngageAimbot);
        if (
          canEngageAimbot &&
          (settings.aimbot_.enabled_ || (settings.meleeLock_.enabled_ && distanceToEnemy <= 8))
        ) {
          if (isTargetShootable) {
            const currentAimPos = getCurrentAimPosition();
            const shouldSmooth =
              settings.aimbot_.smooth_ > 0 && shouldSmoothAim(currentAimPos, predictedPos);
            setAimState(
              new AimState('aimbot', { x: predictedPos.x, y: predictedPos.y }, null, !shouldSmooth)
            );
            state.lastTargetScreenPos_ = { x: predictedPos.x, y: predictedPos.y };
            aimUpdated = true;
            const aimSnapshot = aimState.lastAimPos_;
            dotTargetPos = aimSnapshot
              ? { x: aimSnapshot.clientX, y: aimSnapshot.clientY }
              : { x: predictedPos.x, y: predictedPos.y };
            isDotTargetShootable = true;
          } else {
            dotTargetPos = { x: predictedPos.x, y: predictedPos.y };
            isDotTargetShootable = false;
          }
        } else {
          dotTargetPos = { x: predictedPos.x, y: predictedPos.y };
          isDotTargetShootable = isTargetShootable;
        }
      } else {
        previewTargetPos = null;
        dotTargetPos = null;
        state.lastTargetScreenPos_ = null;
      }

      if (!aimUpdated) {
        setAimState(new AimState('idle'));
        state.lastTargetScreenPos_ = previewTargetPos
          ? { x: previewTargetPos.x, y: previewTargetPos.y }
          : null;
      }
      let displayPos = dotTargetPos;
      if (!displayPos && previewTargetPos) {
        displayPos = { x: previewTargetPos.x, y: previewTargetPos.y };
      }
      aimOverlays.updateDot(displayPos, isDotTargetShootable, !!state.focusedEnemy_);
      aimOverlays.updateFovCircle();
    } catch (error) {
      aimOverlays.hideAll();
      setAimState(new AimState('idle', null, null, true));
      state.meleeLockEnemy_ = null;
      state.focusedEnemy_ = null;
      state.currentEnemy_ = null;
      state.lastTargetScreenPos_ = null;
    }
  } catch (error) {
    setAimState(new AimState({ mode: 'idle', immediate: true }));
    state.lastTargetScreenPos_ = null;
  }
}

export default function () {
  const startTicker = () => {
    const uiRoot = getUIRoot();
    if (aimOverlays.ensureInitialized(uiRoot)) {
      if (!tickerAttached) {
        gameManager.pixi._ticker.add(aimbotTicker);
        tickerAttached = true;
      }
    } else {
      requestAnimationFrame(startTicker);
    }
  };

  startTicker();
}
