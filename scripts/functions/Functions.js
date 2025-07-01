function enemyPlayerCollision(player, enemy) {
    if (!this.invulnerable) {
        if (this.playerType === "Clef" && player.body.blocked.down === false) {
        console.log("enemy bjonked");
        enemy.disableBody(true,true);
    } else {
        this.lives--;
        // console.log(this.lives);
        this.invulnerable = true;
        emitter.emit('lives-damage',this.lives);
        // enemy.disableBody(true,true);
    }

    this.time.delayedCall(1000, () => {
        this.invulnerable = false;
    });
    }

    if (this.lives <= 0) {
            console.log(this.lives);
            emitter.emit('game-over');
            console.log("game over!");
    }
}

function chordCollecting(player, chords, scene) {
    if (scene.playerType === "Quarter") {
        scene.chordsCollected++;
        emitter.emit('chord-collected',scene.chordsCollected);
        chords.disableBody(true,true);
        console.log(scene.chordsCollected);
    }
}

// Initializers yay
function chordInitializer(scene, mapObject) {
    const chordLayer = mapObject.getObjectLayer("chords");
        let chords = scene.physics.add.group();
        chordLayer.objects.forEach(object => {
            let chord = chords.create(object.x, object.y, 'chordSprite');
            chord.body.setAllowGravity(false);
            scene.totalChords++;
        })
    console.log(scene.totalChords);
    return chords;
}

function clefInitializer(scene, x, y) {
    scene.clefPlayer = scene.physics.add.sprite(x, y, 'clefIdle').setFrame(0);
    scene.clefPlayer.setCollideWorldBounds(true);
    scene.clefPlayer.setVisible(true);

    return scene.clefPlayer;
}

function quarterInitializer(scene, x, y) {
    scene.quarterPlayer = scene.physics.add.sprite(x, y, 'quarterIdle').setFrame(0);
    scene.quarterPlayer.setCollideWorldBounds(true);
    scene.quarterPlayer.setVisible(false);

    return scene.quarterPlayer;
}

function guiLoader(scene,currentScene) {
    const guiScene = scene.scene.get("GUILayout");
        if (!guiScene.sys.displayList || guiScene.children.list.length === 0) {
            scene.scene.stop("GUILayout");
            scene.scene.run("GUILayout");
            scene.time.delayedCall(10, () => {
            emitter.emit("scene-loaded", currentScene);
            });

        } else {
            scene.scene.wake("GUILayout");
            scene.scene.bringToTop("GUILayout");
            scene.time.delayedCall(10, () => {
            emitter.emit("scene-loaded", currentScene);
            });
        }
}

// function frogSpawning(scene, pointsArray, noOfFrogs) {
//     let frogCount = 0;
//     while (frogCount < noOfFrogs) {
//         for (let i = 0; i < pointsArray.length; i += 2) {
//             let start = pointsArray[i];
//             let end = pointsArray[i + 1];

//             let line = new Phaser.Curves.Line(
//                 new Phaser.Math.Vector2(start.x, start.y),
//                 new Phaser.Math.Vector2(end.x, end.y)
//             );

//             let path = new Phaser.Curves.Path();
//             path.add(line);

//             const graphics = scene.add.graphics();
//             graphics.lineStyle(1, 0xffffff, 0.5);
//             path.draw(graphics);

//             let frog = new FrogEnemy(scene, start.x, start.y, 'frogSprite', path);
//             frog.startOnPath();
//             scene.frogEnemies.add(frog);
//             console.log("frog created");
//         }
//         frogCount++;
//     }
// }

function pathInitializer(mapObject,layerName) {
    let layerOject = mapObject.getObjectLayer(layerName);
    console.log("layer object: ",layerOject.objects);
    return layerOject.objects; 
}

function frogCreator(scene,pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];
    // let startX = pointsArray[start.x];
    // let startY = pointsArray[1];
    // let endX = pointsArray[pointsArray.length -2];
    // let endY = pointsArray[pointsArray.length -1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y)
    );
    console.log(start,end);
    console.log(start.x,start.y,end.x,end.y);

    let path = new Phaser.Curves.Path();
    path.add(line);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let frog = new FrogEnemy(scene, start.x, start.y, 'frogSprite', path);
    frog.startOnPath();
    scene.frogEnemies.add(frog);
    console.log("frog created");
}

function snakeCreator(scene,pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y));
    console.log(start,end);
    console.log(start.x,start.y,end.x,end.y);
    console.log(line);

    let path = new Phaser.Curves.Path();
    path.add(line);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let snake = new SnakeEnemy(scene, start.x, start.y, 'snakeSprite', path);
    snake.startOnPath();
    scene.snakeEnemies.add(snake);
    console.log("snake created");
}

function snakeHasMidpointCreator(scene,pointsArray) {
    let start = pointsArray[0];
    let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x,start.y);
    path.lineTo(midpoint.x,midpoint.y);
    path.lineTo(end.x,end.y);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let snake = new SnakeEnemy(scene, start.x, start.y, 'snakeSprite', path);
    snake.startOnPath();
    scene.snakeEnemies.add(snake);
    console.log("snake w midpoint created");
}

function moleCreator(scene,positionLayer) {
    let positionObject = positionLayer[0];
    let posX = positionObject.x;
    let posY = positionObject.y;

    let mole = new MoleEnemy(scene, posX, posY, 'moleSprite');
    scene.moleEnemies.add(mole);
    console.log("mole created");
}

function batCreator(scene,pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y));
    console.log(start,end);
    console.log(start.x,start.y,end.x,end.y);
    console.log(line);

    let path = new Phaser.Curves.Path();
    path.add(line);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let bat = new BatEnemy(scene, start.x, start.y, 'batSprite', path);
    bat.startOnPath();
    scene.batEnemies.add(bat);
    console.log("bat created");
}

function batMultiplePathsCreator(scene,pointsArray) {
    let start = pointsArray[0];
    // let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x,start.y);
    for (i = 1; i < pointsArray.length - 2; i++) {
        let pathObject = pointsArray[i];
        path.lineTo(pathObject.x,pathObject.y);
    }
    // path.lineTo(midpoint.x,midpoint.y);
    path.lineTo(end.x,end.y);

    console.log(path);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let bat = new BatEnemy(scene, start.x, start.y, 'batSprite', path);
    bat.startOnPath();
    scene.batEnemies.add(bat);
    console.log("bat multiple points created");
}

function swarmCreator(scene,pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y));
    console.log(start,end);
    console.log(start.x,start.y,end.x,end.y);
    console.log(line);

    let path = new Phaser.Curves.Path();
    path.add(line);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let swarm = new SwarmEnemy(scene, start.x, start.y, 'swarmSprite', path);
    swarm.startOnPath();
    scene.swarmEnemies.add(swarm);
    console.log("swarm created");
}

function swarmMultiplePathsCreator(scene,pointsArray) {
    let start = pointsArray[0];
    // let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x,start.y);
    for (i = 1; i < pointsArray.length - 2; i++) {
        let pathObject = pointsArray[i];
        path.lineTo(pathObject.x,pathObject.y);
    }
    // path.lineTo(midpoint.x,midpoint.y);
    path.lineTo(end.x,end.y);

    console.log(path);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let swarm = new SwarmEnemy(scene, start.x, start.y, 'swarmSprite', path);
    swarm.startOnPath();
    scene.swarmEnemies.add(swarm);
    console.log("swarm w multiple points created");
}

function isHostileEnemy(player, enemy) {
    // If the enemy is a MoleEnemy and is hostile, allow the collision
    if (enemy instanceof MoleEnemy) {
        return enemy.hostile;
    }
    // Allow collision for other enemy types
    return true;
}
