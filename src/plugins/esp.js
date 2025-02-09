import { gameManager } from "../utils/injector.js";

const GREEN = 0x00ff00;
const BLUE = 0x00f3f3;
const RED = 0xff0000;
const WHITE = 0xffffff;

const inputCommands = {
  Cancel: 6,
  Count: 36,
  CycleUIMode: 30,
  EmoteMenu: 31,
  EquipFragGrenade: 15,
  EquipLastWeap: 19,
  EquipMelee: 13,
  EquipNextScope: 22,
  EquipNextWeap: 17,
  EquipOtherGun: 20,
  EquipPrevScope: 21,
  EquipPrevWeap: 18,
  EquipPrimary: 11,
  EquipSecondary: 12,
  EquipSmokeGrenade: 16,
  EquipThrowable: 14,
  Fire: 4,
  Fullscreen: 33,
  HideUI: 34,
  Interact: 7,
  Loot: 10,
  MoveDown: 3,
  MoveLeft: 0,
  MoveRight: 1,
  MoveUp: 2,
  Reload: 5,
  Revive: 8,
  StowWeapons: 27,
  SwapWeapSlots: 28,
  TeamPingMenu: 32,
  TeamPingSingle: 35,
  ToggleMap: 29,
  Use: 9,
  UseBandage: 23,
  UseHealthKit: 24,
  UsePainkiller: 26,
  UseSoda: 25,
};

let state = {
  isAimBotEnabled: true,
  isAimAtKnockedOutEnabled: true,
  get aimAtKnockedOutStatus() {
      return this.isAimBotEnabled && this.isAimAtKnockedOutEnabled;
  },
  isZoomEnabled: true,
  isMeleeAttackEnabled: true,
  get meleeStatus() {
      return this.isAimBotEnabled && this.isMeleeAttackEnabled;
  },
  isSpinBotEnabled: false,
  isAutoSwitchEnabled: true,
  isUseOneGunEnabled: false,
  focusedEnemy: null,
  get focusedEnemyStatus() {
      return this.isAimBotEnabled && this.focusedEnemy;
  },
  isXrayEnabled: true,
  friends: [],
  lastFrames: {},
  enemyAimBot: null,
  isLaserDrawerEnabled: true,
  isLineDrawerEnabled: true,
  isNadeDrawerEnabled: true,
  isOverlayEnabled: true,
};

function getTeam(player) {
  return Object.keys(gameManager.game.playerBarn.teamInfo).find(team => gameManager.game.playerBarn.teamInfo[team].playerIds.includes(player.__id));
}

function findWeap(player) {
  const weapType = player.netData.activeWeapon;
  return weapType && gameManager.guns[weapType] ? gameManager.guns[weapType] : null;
}

function findBullet(weapon) {
  return weapon ? gameManager.bullets[weapon.bulletType] : null;
}



function espTicker(){
    const pixi = gameManager.game.pixi; 
    const me = gameManager.game.activePlayer;
    const players = gameManager.game.playerBarn.playerPool.pool;

    // We check if there is an object of Pixi, otherwise we create a new
    if (!pixi || me?.container == undefined) {
        // console.error("PIXI object not found in game.");
        return;
    }

    const meX = me.pos.x;
    const meY = me.pos.y;

    const meTeam = getTeam(me);
    
    try{

    // lineDrawer
    const lineDrawer = me.container.lineDrawer;
    try{lineDrawer.clear()}
    catch{if(!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return;}
    if (state.isLineDrawerEnabled){

        if (!me.container.lineDrawer) {
            me.container.lineDrawer = new PIXI.Graphics();
            me.container.addChild(me.container.lineDrawer);
        }
            
        // For each player
        players.forEach((player) => {
            // We miss inactive or dead players
            if (!player.active || player.netData.dead || me.__id == player.__id) return;
    
            const playerX = player.pos.x;
            const playerY = player.pos.y;
    
            const playerTeam = getTeam(player);
    
            // We calculate the color of the line (for example, red for enemies)
            const lineColor = playerTeam === meTeam ? BLUE : state.friends.includes(player.nameText._text) ? GREEN : me.layer === player.layer && (state.isAimAtKnockedOutEnabled || !player.downed) ? RED : WHITE;
    
            // We draw a line from the current player to another player
            lineDrawer.lineStyle(2, lineColor, 1);
            lineDrawer.moveTo(0, 0); // Container Container Center
            lineDrawer.lineTo(
                (playerX - meX) * 16,
                (meY - playerY) * 16
            );
        });
    }

    // nadeDrawer
    const nadeDrawer = me.container.nadeDrawer;
    try{nadeDrawer?.clear()}
    catch{if(!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return;}
    if (state.isNadeDrawerEnabled){
        if (!me.container.nadeDrawer) {
            me.container.nadeDrawer = new PIXI.Graphics();
            me.container.addChild(me.container.nadeDrawer);
        }
    
        Object.values(gameManager.game.objectCreator.idToObj)
            .filter(obj => {
                const isValid = ( obj.__type === 9 && obj.type !== "smoke" )
                    ||  (
                            obj.smokeEmitter &&
                            gameManager.objects[obj.type].explosion);
                return isValid;
            })
            .forEach(obj => {
                if(obj.layer !== me.layer) {
                    nadeDrawer.beginFill(0xffffff, 0.3);
                } else {
                    nadeDrawer.beginFill(0xff0000, 0.2);
                }
                nadeDrawer.drawCircle(
                    (obj.pos.x - meX) * 16,
                    (meY - obj.pos.y) * 16,
                    (gameManager.explosions[
                        gameManager.throwable[obj.type]?.explosionType ||
                        gameManager.objects[obj.type].explosion
                            ].rad.max +
                        1) *
                    16
                );
                nadeDrawer.endFill();
            });
    }

    // flashlightDrawer(laserDrawer)
    const laserDrawer = me.container.laserDrawer;
    try{laserDrawer.clear()}
    catch{if(!gameManager.game?.ws || gameManager.game?.activePlayer?.netData?.dead) return;}
    if (state.isLaserDrawerEnabled) {
        const curWeapon = findWeap(me);
        const curBullet = findBullet(curWeapon);
        
        if ( !me.container.laserDrawer ) {
            me.container.laserDrawer = new PIXI.Graphics();
            me.container.addChildAt(me.container.laserDrawer, 0);
        }
    
        function laserPointer(
            curBullet,
            curWeapon,
            acPlayer,
            color = 0x0000ff,
            opacity = 0.3,
        ) {
            const { pos: acPlayerPos, posOld: acPlayerPosOld } = acPlayer;
    
            const dateNow = performance.now();
    
            if ( !(acPlayer.__id in state.lastFrames) ) state.lastFrames[acPlayer.__id] = [];
            state.lastFrames[acPlayer.__id].push([dateNow, { ...acPlayerPos }]);
    
            if (state.lastFrames[acPlayer.__id].length < 30) return;
    
            if (state.lastFrames[acPlayer.__id].length > 30){
                state.lastFrames[acPlayer.__id].shift();
            }
    
            const deltaTime = (dateNow - state.lastFrames[acPlayer.__id][0][0]) / 1000; // Time since last frame in seconds
    
            const acPlayerVelocity = {
                x: (acPlayerPos._x - state.lastFrames[acPlayer.__id][0][1]._x) / deltaTime,
                y: (acPlayerPos._y - state.lastFrames[acPlayer.__id][0][1]._y) / deltaTime,
            };
    
            let lasic = {};
        
            let isMoving = !!(acPlayerVelocity.x || acPlayerVelocity.y);
        
            if(curBullet) {
                lasic.active = true;
                lasic.range = curBullet.distance * 16.25;
                let atan;
                if (acPlayer == me && ( !(gameManager.lastAimPos) || (gameManager.lastAimPos) && !(gameManager.game.touch.shotDetected || gameManager.game.inputBinds.isBindDown(inputCommands.Fire)) ) ){
                    //local rotation
                    atan = Math.atan2(
                        gameManager.game.input.mousePos._y - gameManager.innerHeight / 2,
                        gameManager.game.input.mousePos._x - gameManager.innerWidth / 2,
                    );
                }else if(acPlayer == me && (gameManager.lastAimPos) && ( gameManager.game.touch.shotDetected || gameManager.game.inputBinds.isBindDown(inputCommands.Fire) ) ){
                    const playerPointToScreen = gameManager.game.camera.pointToScreen({x: acPlayer.pos._x, y: acPlayer.pos._y})
                    atan = Math.atan2(
                        playerPointToScreen.y - gameManager.lastAimPos.clientY,
                        playerPointToScreen.x - gameManager.lastAimPos.clientX
                    ) 
                    -
                    Math.PI;
                }else{
                    atan = Math.atan2(
                        acPlayer.dir.x,
                        acPlayer.dir.y
                    ) 
                    -
                    Math.PI / 2;
                }
                lasic.direction = atan;
                lasic.angle =
                    ((curWeapon.shotSpread +
                        (isMoving ? curWeapon.moveSpread : 0)) *
                        0.01745329252) /
                    2;
            } else {
                lasic.active = false;
            }
        
            if(!lasic.active) {
                return;
            }
    
            const center = {
                x: (acPlayerPos._x - me.pos._x) * 16,
                y: (me.pos._y - acPlayerPos._y) * 16,
            };
            const radius = lasic.range;
            let angleFrom = lasic.direction - lasic.angle;
            let angleTo = lasic.direction + lasic.angle;
            angleFrom =
                angleFrom > Math.PI * 2
                    ? angleFrom - Math.PI * 2
                    : angleFrom < 0
                    ? angleFrom + Math.PI * 2
                    : angleFrom;
            angleTo =
                angleTo > Math.PI * 2
                    ? angleTo - Math.PI * 2
                    : angleTo < 0
                    ? angleTo + Math.PI * 2
                    : angleTo;
            laserDrawer.beginFill(color, opacity);
            laserDrawer.moveTo(center.x, center.y);
            laserDrawer.arc(center.x, center.y, radius, angleFrom, angleTo);
            laserDrawer.lineTo(center.x, center.y);
            laserDrawer.endFill();
        }
        
        
        laserPointer(
            curBullet,
            curWeapon,
            me,
        );
        
        players
            .filter(player => player.active && !player.netData.dead && me.__id !== player.__id && me.layer === player.layer && getTeam(player) != meTeam)
            .forEach(enemy => {
                const enemyWeapon = findWeap(enemy);
                laserPointer(
                    findBullet(enemyWeapon),
                    enemyWeapon,
                    enemy,
                    "0",
                    0.2,
                )
            });
    };

    }catch(err){
        // console.error('esp', err);
    }
}

export function esp() {
    gameManager.game.pixi._ticker.add(espTicker);
}