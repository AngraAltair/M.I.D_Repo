function enemyPlayerCollision(player, enemy) {
    if (!this.invulnerable) {
        if (this.playerType === "Clef" && player.body.blocked.down === false) {
            console.log("enemy bjonked");
            enemy.disableBody(true, true);
        } else {
            this.lives--;
            // console.log(this.lives);
            this.invulnerable = true;
            emitter.emit('lives-damage', this.lives);
            // enemy.disableBody(true,true);
        }

        this.time.delayedCall(1000, () => {
            this.invulnerable = false;
        });
        console.log("player hurt");
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
        emitter.emit('chord-collected', scene.chordsCollected);
        chords.disableBody(true, true);
        console.log(scene.chordsCollected);
    }
}

function quarterSingingSkill(scene, ...enemyArrays) {
    const currentTime = scene.time.now;
    const singingRange = 100;

    if (currentTime - scene.lastSingTime < scene.singCooldown) return;

    scene.lastSingTime = currentTime;

    let closestEnemy = null;
    let minDistance = singingRange;

    for (const enemyArray of enemyArrays) {
        if (!enemyArray || !enemyArray.children) continue;

        enemyArray.children.iterate(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(
                    scene.quarterPlayer.x, scene.quarterPlayer.y,
                    enemy.x, enemy.y
                );

                if (dist <= minDistance) {
                    closestEnemy = enemy;
                    minDistance = dist;
                }
            }
        });
    }

    if (closestEnemy) {
        closestEnemy.disableBody(true, true);
    }
}

// function quarterSingingDemoriStun(scene, demori) {
//     const currentTime = scene.time.now;
//     const singingRange = 200;

//     if (currentTime - scene.lastSingTime < scene.singCooldown) return;

//     scene.lastSingTime = currentTime;

//     let closestEnemy = null;
//     let minDistance = singingRange;

//     if (demori.active) {
//         const dist = Phaser.Math.Distance.Between(
//             scene.quarterPlayer.x, scene.quarterPlayer.y,
//             demori.x, demori.y
//         );

//         if (dist <= minDistance) {
//             closestEnemy = demori;
//             minDistance = dist;

//             if (closestEnemy.isStunned === false) {
//                 closestEnemy.isStunned = true;
//             } else {
//                 closestEnemy.isStunned = false;
//             }
//             console.log(closestEnemy.isStunned);
//         } else {
//             console.log("demori not near");
//         }


//     }
// }

function quarterSingingDemoriStun(scene, demori) {
    const currentTime = scene.time.now;
    const singingRange = 200;

    if (currentTime - scene.lastSingTime < scene.singCooldown) return;
    scene.lastSingTime = currentTime;

    const dist = Phaser.Math.Distance.Between(
        scene.quarterPlayer.x, scene.quarterPlayer.y,
        demori.x, demori.y
    );

    if (demori.active && dist <= singingRange) {
        if (!demori.isStunned) {
            demori.isStunned = true;
            console.log("Demori stunned!");

            // Remove stun after 5 seconds
            scene.time.delayedCall(5000, () => {
                demori.isStunned = false;
                console.log("Demori recovered from stun.");
            });
        } else {
            console.log("Demori already stunned.");
        }
    } else {
        console.log("Demori not in range.");
    }
}



function pushableBlocksToggle(player, objects, scene) {
    // let pushDetect;
    // if (player.body.touching.left || player.body.touching.right) {
    //     pushDetect = true;
    // } else {
    //     pushDetect = false;
    // }
    // console.log(pushDetect);

    if (scene.keyE.isDown && scene.playerType === "Clef") {
        scene.pushableObjects.children.iterate(obj => {
            obj.pushable = true;
            obj.setImmovable(false);
            console.log("objs pushable");
        })
        scene.isPushing = true;
    } else {
        scene.pushableObjects.children.iterate(obj => {
            obj.pushable = false;
            obj.setImmovable(true);

            console.log("objs not pushable");
        })
        scene.isPushing = false;
    }
}


// }

// function pushableBlocksToggle(player, object, scene) {
//     if (!object || !object.body) return;

//     // Check if player is touching from the left or right
//     const touchingSide =
//         (player.body.touching.left && object.body.touching.right) ||
//         (player.body.touching.right && object.body.touching.left);

//     if (touchingSide) {
//         scene.isPushing = true;
//         object.pushable = true;
//         object.body.setImmovable(false);
//     } else {
//         scene.isPushing = false;
//         object.pushable = false;
//         object.body.setImmovable(true);
//     }
// }


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
    scene.clefPlayer.pushable = false;
    scene.clefPlayer.setDrag(0, 0);

    return scene.clefPlayer;
}

function quarterInitializer(scene, x, y) {
    scene.quarterPlayer = scene.physics.add.sprite(x, y, 'quarterIdle').setFrame(0);
    scene.quarterPlayer.setCollideWorldBounds(true);
    scene.quarterPlayer.setVisible(false);
    scene.quarterPlayer.pushable = false;
    scene.quarterPlayer.setDrag(0, 0);

    return scene.quarterPlayer;
}

function guiLoader(scene, currentScene) {
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

function pathInitializer(mapObject, layerName) {
    let layerOject = mapObject.getObjectLayer(layerName);
    console.log("layer object: ", layerOject.objects);
    return layerOject.objects;
}

function frogCreator(scene, pointsArray) {
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
    console.log(start, end);
    console.log(start.x, start.y, end.x, end.y);

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

function snakeCreator(scene, pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y));
    console.log(start, end);
    console.log(start.x, start.y, end.x, end.y);
    console.log(line);

    let path = new Phaser.Curves.Path();
    path.add(line);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let snake = new SnakeEnemy(scene, start.x, start.y, 'snakeMoving', path);
    snake.startOnPath();
    scene.snakeEnemies.add(snake);
    console.log("snake created");
}

function snakeHasMidpointCreator(scene, pointsArray) {
    let start = pointsArray[0];
    let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x, start.y);
    path.lineTo(midpoint.x, midpoint.y);
    path.lineTo(end.x, end.y);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let snake = new SnakeEnemy(scene, start.x, start.y, 'snakeMoving', path);
    snake.startOnPath();
    scene.snakeEnemies.add(snake);
    console.log("snake w midpoint created");
}

function snakeMultiplePathsCreator(scene, pointsArray) {
    let start = pointsArray[0];
    // let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x, start.y);
    for (i = 1; i < pointsArray.length - 2; i++) {
        let pathObject = pointsArray[i];
        path.lineTo(pathObject.x, pathObject.y);
    }
    // path.lineTo(midpoint.x,midpoint.y);
    path.lineTo(end.x, end.y);

    console.log(path);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let snake = new SnakeEnemy(scene, start.x, start.y, 'snakeMoving', path);
    snake.startOnPath();
    scene.snakeEnemies.add(snake);
    console.log("snake w multiple paths created");
}

function moleCreator(scene, positionLayer) {
    let positionObject = positionLayer[0];
    let posX = positionObject.x;
    let posY = positionObject.y;

    let mole = new MoleEnemy(scene, posX, posY, 'moleSprite');
    scene.moleEnemies.add(mole);
    console.log("mole created");
}

function batCreator(scene, pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y));
    console.log(start, end);
    console.log(start.x, start.y, end.x, end.y);
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

function batMultiplePathsCreator(scene, pointsArray) {
    let start = pointsArray[0];
    // let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x, start.y);
    for (i = 1; i < pointsArray.length - 2; i++) {
        let pathObject = pointsArray[i];
        path.lineTo(pathObject.x, pathObject.y);
    }
    // path.lineTo(midpoint.x,midpoint.y);
    path.lineTo(end.x, end.y);

    console.log(path);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let bat = new BatEnemy(scene, start.x, start.y, 'batSprite', path);
    bat.startOnPath();
    scene.batEnemies.add(bat);
    console.log("bat multiple points created");
}

function swarmCreator(scene, pointsArray) {
    let start = pointsArray[0];
    let end = pointsArray[pointsArray.length - 1];

    let line = new Phaser.Curves.Line(
        new Phaser.Math.Vector2(start.x, start.y),
        new Phaser.Math.Vector2(end.x, end.y));
    console.log(start, end);
    console.log(start.x, start.y, end.x, end.y);
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

function swarmMultiplePathsCreator(scene, pointsArray) {
    let start = pointsArray[0];
    // let midpoint = pointsArray[1];
    let end = pointsArray[pointsArray.length - 1];

    let path = scene.add.path(start.x, start.y);
    for (i = 1; i < pointsArray.length - 2; i++) {
        let pathObject = pointsArray[i];
        path.lineTo(pathObject.x, pathObject.y);
    }
    // path.lineTo(midpoint.x,midpoint.y);
    path.lineTo(end.x, end.y);

    console.log(path);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.5);
    path.draw(graphics);

    let swarm = new SwarmEnemy(scene, start.x, start.y, 'swarmSprite', path);
    swarm.startOnPath();
    scene.swarmEnemies.add(swarm);
    console.log("swarm w multiple points created");
}

function demoriSpawn(scene, tpPoints) {
    let start = tpPoints[tpPoints.length - 1];
    console.log(start);
    let demori = new Demori(scene, start.x, start.y, 'demoriSpriteF2', tpPoints);
    console.log("demori created");
    // demori.startOnPath();

    return demori;
}

function isHostileEnemy(player, enemy) {
    // If the enemy is a MoleEnemy and is hostile, allow the collision
    if (enemy instanceof MoleEnemy) {
        return enemy.hostile;
    }
    // Allow collision for other enemy types
    return true;
}
