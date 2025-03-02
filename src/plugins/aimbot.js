import { settings } from '../loader.js';
import {
  findTeam,
  findBullet,
  findWeapon,
  inputCommands,
} from '../utils/constants.js';
import { gameManager } from '../utils/injector.js';
import { ui } from '../ui/worker.js';
import { translator } from '../utils/obfuscatedNameTranslator.js';

export let lastAimPos, aimTouchMoveDir, aimTouchDistanceToEnemy;

const state = {
  focusedEnemy: null,
  previousEnemies: {},
  currentEnemy: null,
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

function predictPosition(enemy, currentPlayer) {
  if (!enemy || !currentPlayer) return null;

  const enemyPos = enemy._pos;
  const currentPlayerPos = currentPlayer._pos;  
  const now = performance.now();
  const enemyId = enemy.__id;

  if (!state.previousEnemies[enemyId])
      state.previousEnemies[enemyId] = [];

  state.previousEnemies[enemyId].push([now, { ...enemyPos }]);
  if (state.previousEnemies[enemyId].length > 20)
      state.previousEnemies[enemyId].shift();

  if (state.previousEnemies[enemyId].length < 20)
      return gameManager.game.camera.pointToScreen({
          x: enemyPos.x,
          y: enemyPos.y,
      });

  const deltaTime =
      (now - state.previousEnemies[enemyId][0][0]) / 1000;
  let enemyVelocity = {
      x: (enemyPos.x - state.previousEnemies[enemyId][0][1].x) /
          deltaTime,
      y: (enemyPos.y - state.previousEnemies[enemyId][0][1].y) /
          deltaTime,
  };

  const weapon = findWeapon(currentPlayer);
  const bullet = findBullet(weapon);
  const bulletSpeed = bullet?.speed || 1000;

  const { x: vex, y: vey } = enemyVelocity;
  const dx = enemyPos.x - currentPlayerPos.x;
  const dy = enemyPos.y - currentPlayerPos.y;
  const vb = bulletSpeed;

  const a = vb ** 2 - vex ** 2 - vey ** 2;
  const b = -2 * (vex * dx + vey * dy);
  const c = -(dx ** 2) - dy ** 2;

  let t;

  if (Math.abs(a) < 1e-6) {
      t = -c / b;
  } else {
      const discriminant = b ** 2 - 4 * a * c;

      const sqrtD = Math.sqrt(discriminant);
      const t1 = (-b - sqrtD) / (2 * a);
      const t2 = (-b + sqrtD) / (2 * a);
      t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
  }

  const predictedPos = {
      x: enemyPos.x + vex * t,
      y: enemyPos.y + vey * t,
  };

  return gameManager.game.camera.pointToScreen(predictedPos);
}

function findTarget(players, me) {
  const meTeam = findTeam(me);
  let enemy = null;
  let minDistance = Infinity;

  for (const player of players) {
      if (
          !player.active ||
          player.netData.dead ||
          (!settings.aimbot.targetKnocked && player.downed) ||
          me.__id === player.__id ||
          me.layer !== player.layer ||
          findTeam(player) === meTeam
      )
          continue;

      const screenPos = gameManager.game.camera.pointToScreen({
          x: player.pos.x,
          y: player.pos.y,
      });
      const distance = getDistance(
          screenPos.x,
          screenPos.y,
          translator.input.mousePos._x,
          translator.input.mousePos._y,
      );

      if (distance < minDistance) {
          minDistance = distance;
          enemy = player;
      }
  }

  return enemy;
}

function aimbotTicker() {
  if (!settings.aimbot.enabled || !gameManager.game.initialized) {
      lastAimPos = null;
      aimbotDot.style.display = "none";
      return
  };

  const players = gameManager.game[translator.playerBarn].playerPool[translator.pool];
  const me = gameManager.game[translator.activePlayer];

  try {
      let enemy =
          state.focusedEnemy?.active && !state.focusedEnemy.netData.dead
              ? state.focusedEnemy
              : null;

      if (!enemy) {
          enemy = findTarget(players, me);
          state.currentEnemy = enemy;
      }

      if (enemy) {
          const meX = me[translator.pos].x;
          const meY = me[translator.pos].y;
          const enemyX = enemy[translator.pos].x;
          const enemyY = enemy[translator.pos].y;

          const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);

          if (enemy != state.currentEnemy) {
              state.currentEnemy = enemy;
              state.previousEnemies[enemy.__id] = [];
              state.velocityBuffer[enemy.__id] = [];
          }

          const predictedPos = predictPosition(enemy, me);

          if (!predictedPos) return aimbotDot.style.display = "none";

          if (gameManager.game[translator.activePlayer][translator.localData][translator.curWeapIdx] == 2 &&
              distanceToEnemy <= 8 &&
              settings.aimbot.meleeLock &&
              gameManager[translator.inputBinds].isBindDown(inputCommands.Fire)
          ) {
              const moveAngle = calcAngle(enemy[translator.pos], me[translator.pos]) + Math.PI;
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

          if (gameManager.game[translator.activePlayer][translator.localData][translator.curWeapIdx] == 2 &&
              distanceToEnemy >= 8) {
              aimTouchMoveDir = null;
              lastAimPos = null;
              return aimbotDot.style.display = "none";
          }

          if (gameManager.game[translator.activePlayer].throwableState === 'cook') {
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
    aimbotDot.classList.add('aimbot-dot');
    ui.appendChild(aimbotDot);
  }
  gameManager.pixi._ticker.add(aimbotTicker);
}
