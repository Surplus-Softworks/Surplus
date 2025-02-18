//import { updateOverlay, aimbotDot } from '../overlay.js';

import { settings } from '../loader.js';
import { getTeam, findBullet, findWeap } from '../utils/constants.js';
import { gameManager } from '../utils/injector.js';
import { ui } from '../ui/worker.js';

export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

const state = {
  isAimBotEnabled: true,
  focusedEnemy: null,
  lastFrames: {},
  enemyAimbot: null,
};

let aimbotDot;

function getDistance(x1, y1, x2, y2) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function predictPosition(enemy, curPlayer) {
  if (!enemy || !curPlayer) return null;

  const { pos: enemyPos } = enemy;
  const { pos: curPlayerPos } = curPlayer;
  const now = performance.now();
  const enemyId = enemy.__id;

  if (!state.lastFrames[enemyId]) state.lastFrames[enemyId] = [];

  state.lastFrames[enemyId].push([now, { ...enemyPos }]);
  if (state.lastFrames[enemyId].length > 30) state.lastFrames[enemyId].shift();

  if (state.lastFrames[enemyId].length < 30)
    return gameManager.game.camera.pointToScreen({
      x: enemyPos.x,
      y: enemyPos.y,
    });

  const deltaTime = (now - state.lastFrames[enemyId][0][0]) / 1000;
  const enemyVelocity = {
    x: (enemyPos.x - state.lastFrames[enemyId][0][1].x) / deltaTime,
    y: (enemyPos.y - state.lastFrames[enemyId][0][1].y) / deltaTime,
  };

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

function findTarget(players, me, aimAtKnockedEnabled) {
  const meTeam = getTeam(me);
  let enemy = null;
  let minDistance = Infinity;

  for (const player of players) {
    if (
      !player.active ||
      player.netData.dead ||
      (!aimAtKnockedEnabled && player.downed) ||
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
  if (!state.isAimBotEnabled) return;

  const players = gameManager.game.playerBarn.playerPool.pool;
  const me = gameManager.game.activePlayer;

  try {
    let enemy = state.focusedEnemy?.active && !state.focusedEnemy.netData.dead
      ? state.focusedEnemy
      : null;

    if (!enemy) {
      enemy = findTarget(players, me, state.aimAtKnockedEnabled);
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
        state.lastFrames[enemy.__id] = [];
      }

      const predictedPos = predictPosition(enemy, me);

      if (!predictedPos) return;

      if (me.netData.activeWeapon === "fists" && distanceToEnemy >= 8) return;

      lastAimPos = {
        clientX: predictedPos.x,
        clientY: predictedPos.y,
      };

      if (
        aimbotDot.style.left !== predictedPos.x + "px" ||
        aimbotDot.style.top !== predictedPos.y + "px"
      ) {
        aimbotDot.style.left = predictedPos.x + "px";
        aimbotDot.style.top = predictedPos.y + "px";
        aimbotDot.style.display = "block";
      }
    } else {
      aimTouchMoveDir = null;
      lastAimPos = null;
      aimbotDot.style.display = "none";
    }
  } catch (error) {
    //console.error("Error in aimbotTicker:", error);
  }
}

export default function aimbot() {
  if (!aimbotDot) {
    aimbotDot = document.createElement("div");
    aimbotDot.classList.add("aimbotDot");
    ui.appendChild(aimbotDot);
  }
  gameManager.game.pixi._ticker.add(aimbotTicker);
}
