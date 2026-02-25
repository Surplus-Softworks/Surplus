// This gets bundled and converted into a string import like in html import

function createDrawer(container, key, PIXI) {
    if (!container[key]) {
        container[key] = new PIXI.Graphics();
        container.addChild(container[key]);
    }
    return container[key];
}

function drawLines(me, players, lineDrawer, getTeam, BLUE, RED, WHITE) {
    const meX = me.pos.x, meY = me.pos.y, myTeam = getTeam(me);
    players.forEach(player => {
        if (!player.active || player.netData.dead || me.__id === player.__id) return;
        const playerTeam = getTeam(player);
        const lineColor = playerTeam === myTeam ? BLUE : me.layer === player.layer && !player.downed ? RED : WHITE;
        lineDrawer.lineStyle(2, lineColor, 0.45);
        lineDrawer.moveTo(0, 0);
        lineDrawer.lineTo((player.pos.x - meX) * 16, (meY - player.pos.y) * 16);
    });
}

function drawGrenades(me, grenadeDrawer, object, gameManager, objects, explosions, throwable) {
    const meX = me.pos.x, meY = me.pos.y;
    object.values(gameManager.game.objectCreator.idToObj)
        .filter(obj => (obj.__type === 9 && obj.type !== "smoke") || (obj.smokeEmitter && objects[obj.type].explosion))
        .forEach(obj => {
            grenadeDrawer.beginFill(obj.layer !== me.layer ? 0xffffff : 0xff0000, obj.layer !== me.layer ? 0.2 : 0.1);
            grenadeDrawer.drawCircle(
                (obj.pos.x - meX) * 16,
                (meY - obj.pos.y) * 16,
                (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
            );
            grenadeDrawer.endFill();

            grenadeDrawer.lineStyle(2, 0x000000, 0.5); 
            grenadeDrawer.drawCircle(
                (obj.pos.x - meX) * 16,
                (meY - obj.pos.y) * 16,
                (explosions[throwable[obj.type]?.explosionType || objects[obj.type].explosion].rad.max + 1) * 16
            );
        });
}

function drawLasers(me, players, laserDrawer, findWeap, findBullet, gameManager, inputCommands, lastAimPos, settings, getTeam, innerHeight, innerWidth) {
    const curWeapon = findWeap(me);
    const curBullet = findBullet(curWeapon);

    function laserPointer(acPlayer, curBullet, curWeapon, color = 0x0000ff, opacity = 0.1) {
        if (!curBullet) return;
        const center = { x: (acPlayer.pos.x - me.pos.x) * 16, y: (me.pos.y - acPlayer.pos.y) * 16 };
        let atan;
        if (acPlayer === me && (!lastAimPos || (lastAimPos && !(gameManager.game.touch.shotDetected || gameManager.game.inputBinds.isBindDown(inputCommands.Fire))))) {
            atan = Math.atan2(
                gameManager.game.input.mousePos._y - innerHeight / 2,
                gameManager.game.input.mousePos._x - innerWidth / 2
            );
        } else if (acPlayer === me && lastAimPos) {
            const playerPointToScreen = gameManager.game.camera.pointToScreen({ x: acPlayer.pos.x, y: acPlayer.pos.y });
            atan = Math.atan2(
                playerPointToScreen.y - lastAimPos.clientY,
                playerPointToScreen.x - lastAimPos.clientX
            ) - Math.PI;
        } else {
            atan = Math.atan2(acPlayer.dir.x, acPlayer.dir.y) - Math.PI / 2;
        }
        laserDrawer.beginFill(color, opacity);
        laserDrawer.moveTo(center.x, center.y);
        laserDrawer.arc(center.x, center.y, curBullet.distance * 16.25, atan - (curWeapon.shotSpread * 0.01745329252) / 2, atan + (curWeapon.shotSpread * 0.01745329252) / 2);
        laserDrawer.lineTo(center.x, center.y);
        laserDrawer.endFill();
    }
    if (settings.esp.flashlights.own) laserPointer(me, curBullet, curWeapon);
    players.filter(player =>
        player.active && !player.netData.dead && me.__id !== player.__id && me.layer === player.layer && getTeam(player) !== getTeam(me)
    ).forEach(enemy => {
        if (settings.esp.flashlights.others) laserPointer(enemy, findBullet(findWeap(enemy)), findWeap(enemy), 0, 0.05);
    });
}

export default function(gameManager, settings, PIXI, getTeam, BLUE, RED, WHITE, object, objects, explosions, throwable, findWeap, findBullet, inputCommands, lastAimPos, innerHeight, innerWidth) {
    const pixi = gameManager.game.pixi;
    const me = gameManager.game.activePlayer;
    const players = gameManager.game.playerBarn.playerPool.pool;
    if (!pixi || !me || me.container == undefined || !settings.esp.enabled) return;
    try {
        const lineDrawer = createDrawer(me.container, 'lineDrawer', PIXI);
        lineDrawer.clear();
        if (settings.esp.players) drawLines(me, players, lineDrawer, getTeam, BLUE, RED, WHITE);

        const grenadeDrawer = createDrawer(me.container, 'grenadeDrawer', PIXI);
        grenadeDrawer.clear();
        if (settings.esp.grenades) drawGrenades(me, grenadeDrawer, object, gameManager, objects, explosions, throwable);

        const laserDrawer = createDrawer(me.container, 'laserDrawer', PIXI);
        laserDrawer.clear();
        if (settings.esp.flashlights.others || settings.esp.flashlights.own) drawLasers(me, players, laserDrawer, findWeap, findBullet, gameManager, inputCommands, lastAimPos, settings, getTeam, innerHeight, innerWidth);
    } catch (e) { }
}