//import { updateOverlay, aimbotDot } from '../overlay.js';

import { settings } from '../loader.js';
import {
  getTeam,
  findBullet,
  findWeap,
  inputCommands,
} from '../utils/constants.js';
import { gameManager } from '../utils/injector.js';
import { ui } from '../ui/worker.js';

export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

const state = {
  isAimBotEnabled: true,
  focusedEnemy: null,
  lastEnemyFrames: {},
  enemyAimbot: null,
  velocityBuffer: {},
  velocityBufferSize: 15,
};

let aimbotDot;

function getDistance(x1, y1, x2, y2) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function calcAngle(playerPos, mePos) {
  const dx = mePos.x - playerPos.x;
  const dy = mePos.y - playerPos.y;

  return Math.atan2(dy, dx);
}

function predictPosition(enemy, curPlayer) {
  if (!enemy || !curPlayer) return null;

  const { _pos: enemyPos } = enemy;
  const { _pos: curPlayerPos } = curPlayer;
  const now = performance.now();
  const enemyId = enemy.__id;

  if (!state.lastEnemyFrames[enemyId])
    state.lastEnemyFrames[enemyId] = [];

  state.lastEnemyFrames[enemyId].push([now, { ...enemyPos }]);
  if (state.lastEnemyFrames[enemyId].length > 3)
    state.lastEnemyFrames[enemyId].shift();

  if (state.lastEnemyFrames[enemyId].length < 3)
    return gameManager.game.camera.pointToScreen({
      x: enemyPos.x,
      y: enemyPos.y,
    });

  const deltaTime =
    (now - state.lastEnemyFrames[enemyId][0][0]) / 1000;
  let enemyVelocity = {
    x: (enemyPos.x - state.lastEnemyFrames[enemyId][0][1].x) /
      deltaTime,
    y: (enemyPos.y - state.lastEnemyFrames[enemyId][0][1].y) /
      deltaTime,
  };

  if (!state.velocityBuffer[enemyId]) {
    state.velocityBuffer[enemyId] = [];
  }

  state.velocityBuffer[enemyId].push(enemyVelocity);

  if (state.velocityBuffer[enemyId].length > state.velocityBufferSize) {
    state.velocityBuffer[enemyId].shift();
  }

  let avgVelocity = { x: 0, y: 0 };
  for (const velocity of state.velocityBuffer[enemyId]) {
    avgVelocity.x += velocity.x;
    avgVelocity.y += velocity.y;
  }
  avgVelocity.x /= state.velocityBuffer[enemyId].length;
  avgVelocity.y /= state.velocityBuffer[enemyId].length;

  enemyVelocity = avgVelocity; 

  const weapon = findWeap(curPlayer);
  const bullet = findBullet(weapon);
  const bulletSpeed = bullet?.speed || 1000;

  const { x: vex, y: vey } = enemyVelocity;
  const dx = enemyPos.x - curPlayerPos.x;
  const dy = enemyPos.y - curPlayerPos.y;
  const vb = bulletSpeed;

  const a = vb ** 2 - vex ** 2 - vey ** 2;
  const b = -2 * (vex * dx + vey * dy);
  const c = -(dx ** 2) - dy ** 2;

  let t;

  if (Math.abs(a) < 1e-6) {
    t = -c / b;
  } else {
    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0)
      return gameManager.game.camera.pointToScreen({
        x: enemyPos.x,
        y: enemyPos.y,
      });

    const sqrtD = Math.sqrt(discriminant);
    const t1 = (-b - sqrtD) / (2 * a);
    const t2 = (-b + sqrtD) / (2 * a);
    t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
  }

  if (t < 0)
    return gameManager.game.camera.pointToScreen({
      x: enemyPos.x,
      y: enemyPos.y,
    });

  const predictedPos = {
    x: enemyPos.x + vex * t,
    y: enemyPos.y + vey * t,
  };

  return gameManager.game.camera.pointToScreen(predictedPos);
}

function findTarget(players, me) {
  const meTeam = getTeam(me);
  let enemy = null;
  let minDistance = Infinity;

  for (const player of players) {
    if (
      !player.active ||
      player.netData.dead ||
      (!settings.aimbot.targetKnocked && player.downed) ||
      me.__id === player.__id ||
      me.layer !== player.layer ||
      getTeam(player) === meTeam
    )
      continue;

    const screenPos = gameManager.game.camera.pointToScreen({
      x: player._pos.x,
      y: player._pos.y,
    });
    const distance = getDistance(
      screenPos.x,
      screenPos.y,
      gameManager.game.input.mousePos._x,
      gameManager.game.input.mousePos._y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      enemy = player;
    }
  }

  return enemy;
}

export function aimbotTicker() {
  if (!settings.aimbot.enabled) return aimbotDot.style.display = "none";

  const players = gameManager.game.playerBarn.playerPool.pool;
  const me = gameManager.game.activePlayer;

  try {
    let enemy =
      state.focusedEnemy?.active && !state.focusedEnemy.netData.dead
        ? state.focusedEnemy
        : null;

    if (!enemy) {
      enemy = findTarget(players, me);
      state.enemyAimbot = enemy;
    }

    if (enemy) {
      const meX = me._pos.x;
      const meY = me._pos.y;
      const enemyX = enemy._pos.x;
      const enemyY = enemy._pos.y;

      const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);

      if (enemy != state.enemyAimbot) {
        state.enemyAimbot = enemy;
        state.lastEnemyFrames[enemy.__id] = [];
        state.velocityBuffer[enemy.__id] = []; 
      }

      const predictedPos = predictPosition(enemy, me);

      if (!predictedPos) return aimbotDot.style.display = "none";

      if (
        me.netData.activeWeapon === 'fists' &&
        distanceToEnemy <= 8 &&
        settings.aimbot.meleeLock &&
        gameManager.game.inputBinds.isBindDown(inputCommands.Fire)
      ) {
        const moveAngle = calcAngle(enemy._pos, me._pos) + Math.PI;
        aimTouchMoveDir = {
          touchMoveActive: true,
          touchMoveLen: 255,
          x: Math.cos(moveAngle),
          y: Math.sin(moveAngle),
        };
        lastAimPos = {
          clientX: predictedPos.x,
          clientY: predictedPos.y,
        };
        return aimbotDot.style.display = "none";
      } else {
        aimTouchMoveDir = null;
      }

      if (me.netData.activeWeapon === 'fists' && distanceToEnemy >= 8) {
        aimTouchMoveDir = null;
        lastAimPos = null;
        return aimbotDot.style.display = "none";
      }

      if (gameManager.game.activePlayer.throwableState === 'cook') {
        lastAimPos = null;
        return aimbotDot.style.display = "none";
      }

      lastAimPos = {
        clientX: predictedPos.x,
        clientY: predictedPos.y,
      };

      if (
        aimbotDot.style.left !== predictedPos.x + 'px' ||
        aimbotDot.style.top !== predictedPos.y + 'px'
      ) {
        aimbotDot.style.left = predictedPos.x + 'px';
        aimbotDot.style.top = predictedPos.y + 'px';
        aimbotDot.style.display = 'block';
      }
    } else {
      aimTouchMoveDir = null;
      lastAimPos = null;
      aimbotDot.style.display = 'none';
    }
  } catch (error) {
    aimbotDot.style.display = "none";
    //console.error("Error in aimbotTicker:", error);
  }
}

export default function aimbot() {
  if (!aimbotDot) {
    aimbotDot = document.createElement('div');
    aimbotDot.classList.add('aimbotDot');
    ui.appendChild(aimbotDot);
  }
  gameManager.game.pixi._ticker.add(aimbotTicker);
}
