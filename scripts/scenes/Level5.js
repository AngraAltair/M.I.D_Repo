class Level5 extends Phaser.Scene {
    constructor() {
        super("Level5");
    }

    init() {
        //** Default starts with Clef's stats
        // playerType dictates if the player is Clef or Quarter
        // playerSpeed is their walk/run speed
        // currentIdleKey is which animation should be active currently depending on which player is active*/ 
        this.playerType = "Clef";
        this.playerSpeed = 180;
        this.currentIdleKey = "clefIdle";
        this.currentMovementKey = "clefRun";
        this.currentJumpingKey = "clefJump";
        this.currentSkillKey = 'clefPush';
        this.lastDirection = 'right';
        this.playerJumpHeight = -330;
        this.lives = 3;

        this.chordsCollected = 0;
        this.totalChords = 0;

        this.levelFinished = false;

        this.invulnerable = false;
    }

    preload() {

    }

    create() {
        guiLoader(this, "Level5");

        const map = this.make.tilemap({
            key: "level5"
        });
        const map2 = this.make.tilemap({
            key: "level5"
        });
        const tileset = map.addTilesetImage("PathTileset", "level5Tileset");
        const bouldertile = map2.addTilesetImage("PathBoulder", "path_boulder");
        const bg = map.createStaticLayer("bg", tileset, 0, 20);
        const upperBg = map.createDynamicLayer("upper bg", tileset, 0, 20);
        const main = map.createDynamicLayer("main", tileset, 0, 20);
        // const pushable = map2.createDynamicLayer("pushable", bouldertile, 0, 20);

        // console.log(this.anims.exists('batMoving')); // false here means it's not created in this scene
        //         const batAnim = this.anims.get('batMoving');
        // console.log('batMoving exists:', !!batAnim);


        let chords = chordInitializer(this, map);

        // this.batEnemies = this.physics.add.group({
        //     classType: BatEnemy,
        //     runChildUpdate: true
        // })
        // batCreator(this, pathInitializer(map, "bats_pos1"));
        // batCreator(this, pathInitializer(map, "bats_pos2"));
        // batCreator(this, pathInitializer(map, "bats_pos3"));
        // batCreator(this, pathInitializer(map, "bats_pos4"));
        // batCreator(this, pathInitializer(map, "bats_pos5"));
        // batCreator(this, pathInitializer(map, "bats_pos6"));
        // batMultiplePathsCreator(this, pathInitializer(map, "bats_pos7"));

        this.snakeEnemies = this.physics.add.group({
            classType: SnakeEnemy,
            runChildUpdate: true
        })
        snakeMultiplePathsCreator(this, pathInitializer(map, "snake_pos1"));
        snakeHasMidpointCreator(this, pathInitializer(map, "snake_pos2"));
        snakeHasMidpointCreator(this, pathInitializer(map, "snake_pos3"));

        main.setCollisionByExclusion(-1);

        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = clefInitializer(this, 0, 230);
        this.quarterPlayer = quarterInitializer(this, 0, 230);

        const pushable = map.getObjectLayer('pushable');
        this.pushableObjects = this.physics.add.group();
        pushable.objects.forEach(object => {
            let pushable = this.pushableObjects.create(object.x, object.y, 'boulder').setFrame(9);
            pushable.body.setAllowGravity(true);
            pushable.body.setDrag(1000, 0);
            pushable.pushable = false;
            pushable.setCollideWorldBounds(true);
        })

        const foreground = map.createDynamicLayer("foreground", tileset, 0, 20);
        const tint = map.createDynamicLayer("tint", tileset, 0, 20);

        // Cursor Keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Character Switch Event
        this.input.keyboard.on('keydown_TWO', (event) => {
            if (this.playerType === "Clef") {
                // Switches to Quarter if player is Clef
                this.cameras.main.startFollow(this.quarterPlayer);
                this.playerType = "Quarter";
                this.clefPlayer.setVisible(false);
                this.quarterPlayer.setVisible(true);

                this.currentIdleKey = "quarterIdle";
                this.currentMovementKey = "quarterWalk";
                this.currentJumpingKey = "quarterJump";
                this.currentSkillKey = 'quarterSing';
                this.playerSpeed = 85;
                this.playerJumpHeight = -190

                console.log(this.playerType);
            } else if (this.playerType === "Quarter") {
                // Switches to Clef if player is Quarter
                this.cameras.main.startFollow(this.clefPlayer);
                this.playerType = "Clef"
                this.clefPlayer.setVisible(true);
                this.quarterPlayer.setVisible(false);

                this.currentIdleKey = "clefIdle";
                this.currentMovementKey = "clefRun";
                this.currentJumpingKey = "clefJump";
                this.currentSkillKey = 'clefPush';
                this.playerSpeed = 180;
                this.playerJumpHeight = -330;

                console.log(this.playerType);
            }
            emitter.emit('character-switched', this.playerType);
        });

        // Character Skill Event
        // this.input.keyboard.on('keydown_E', (event) => {
        //     switch (this.playerType) {
        //         case "Clef":
        //             // const range = 40;
        //             let closest = null;
        //             let minDistance = 100; // range threshold

        //             this.pushableObjects.children.iterate((obj) => {
        //                 let dx = Math.abs(this.clefPlayer.x - obj.x);
        //                 console.log(dx);
        //                 if (dx <= minDistance) {
        //                     closest = obj;
        //                     // minDistance = dx;
        //                     console.log("close");
        //                 }
        //             });

        //             if (closest) {
        //                 this.currentPushTarget = closest;
        //                 this.currentPushTarget.setImmovable(true);
        //                 let direction = this.lastDirection === 'right' ? 1 : -1;
        //                 closest.setVelocityX(this.clefPlayer.body.velocity.x); // mirror Clef’s speed
        //             } else if (this.currentPushTarget) {
        //                 this.currentPushTarget.setVelocityX(0); // stop moving when not dragging
        //                 this.currentPushTarget = null;
        //             }

        //             console.log("skill active: clef push");
        //             break;
        //         case "Quarter":
        //             console.log("skill active: quarter sing");
        //             break;
        //     }
        // });

        emitter.on('chord-collected', () => {
            if (this.chordsCollected === this.totalChords) {
                this.levelFinished = true;
                this.time.delayedCall(300, () => {
                    this.cameras.main.fadeOut(300);
                    emitter.emit('scene-switch');
                    this.scene.start("Level1");
                });
            }
        });


        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(1.1);
        this.cameras.main.startFollow(this.clefPlayer);

        // Collisions
        // border collisions
        this.physics.add.collider(this.clefPlayer, main);
        this.physics.add.collider(this.quarterPlayer, main);
        this.physics.add.collider(this.snakeEnemies, main);
        this.physics.add.collider(this.pushableObjects, main);

        // this.physics.add.collider(this.clefPlayer, this.pushableObjects);
        // this.physics.add.collider(this.quarterPlayer, this.pushableObjects);

        this.physics.add.collider(this.clefPlayer, this.pushableObjects, null, (player, objects) => {
            pushableBlocksToggle(player, objects, this);
        },this);
        this.physics.add.collider(this.quarterPlayer, this.pushableObjects, null, (player, objects) => {
            pushableBlocksToggle(player, objects, this);
        },this);

        // this.physics.add.collider(this.clefPlayer, this.batEnemies, enemyPlayerCollision, null, this);
        // this.physics.add.collider(this.quarterPlayer, this.batEnemies, enemyPlayerCollision, null, this);

        this.physics.add.collider(this.clefPlayer, this.snakeEnemies, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.snakeEnemies, enemyPlayerCollision, null, this);


        //this.physics.add.collider(this.border,main);
        // this.physics.add.collider(this.clefPlayer,this.enemy,enemyPlayerCollision,null,this);
        // this.physics.add.collider(this.quarterPlayer,this.enemy,enemyPlayerCollision,null,this);
        //this.physics.add.collider(this.clefPlayer,this.border, enemyPlayerCollision, null, this);
        this.physics.add.overlap(this.quarterPlayer, chords, (player, chords) => {
            chordCollecting(player, chords, this);
        }, null, this);

    }

    update(time, delta) {
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        // console.log("gui active: ",this.scene.isActive("GUILayout"));
        // console.log("player lives: ",this.lives);
        // console.log("invulnerable: ",this.invulnerable);
        // this.skyBg.tilePositionX -= 0.2;


        switch (this.playerType) {
            case "Clef":
                // Clef Movement and Animations
                if (this.cursors.left.isDown || this.keyA.isDown) {
                    this.clefPlayer.setVelocityX(-this.playerSpeed);
                    this.quarterPlayer.setVelocityX(-this.playerSpeed);

                    this.clefPlayer.flipX = true;
                    this.quarterPlayer.flipX = true;
                    this.lastDirection = 'left';

                } else if (this.cursors.right.isDown || this.keyD.isDown) {
                    this.clefPlayer.setVelocityX(this.playerSpeed);
                    this.quarterPlayer.setVelocityX(this.playerSpeed);

                    this.clefPlayer.flipX = false;
                    this.quarterPlayer.flipX = false;
                    this.lastDirection = 'right';

                } else {
                    this.quarterPlayer.setVelocityX(0);
                    this.clefPlayer.setVelocityX(0);
                }
                // Jump Logic
                if (this.cursors.up.isDown || this.keyW.isDown && this.clefPlayer.body.blocked.down) {
                    this.clefPlayer.setVelocityY(this.playerJumpHeight);
                    this.quarterPlayer.setVelocityY(this.playerJumpHeight);
                }

                if (!this.clefPlayer.body.blocked.down) {
                    this.clefPlayer.anims.play(this.currentJumpingKey, true);
                    this.clefPlayer.flipX = (this.lastDirection === 'left');
                } else if (this.clefPlayer.body.velocity.x !== 0) {
                    this.clefPlayer.anims.play(this.currentMovementKey, true);
                } else {
                    this.clefPlayer.anims.play(this.currentIdleKey, true);
                }
                break;

            case "Quarter":
                // Quarter Movement and Animations
                if (this.cursors.left.isDown || this.keyA.isDown) {
                    this.clefPlayer.setVelocityX(-this.playerSpeed);
                    this.quarterPlayer.setVelocityX(-this.playerSpeed);

                    this.clefPlayer.flipX = true;
                    this.quarterPlayer.flipX = true;
                    this.lastDirection = 'left';
                } else if (this.cursors.right.isDown || this.keyD.isDown) {
                    this.clefPlayer.setVelocityX(this.playerSpeed);
                    this.quarterPlayer.setVelocityX(this.playerSpeed);

                    this.clefPlayer.flipX = false;
                    this.quarterPlayer.flipX = false;
                    this.lastDirection = 'right';
                } else {
                    this.clefPlayer.setVelocityX(0);
                    this.quarterPlayer.setVelocityX(0);
                }
                // Jump Logic
                if (this.cursors.up.isDown || this.keyW.isDown && this.quarterPlayer.body.blocked.down) {
                    this.clefPlayer.setVelocityY(this.playerJumpHeight);
                    this.quarterPlayer.setVelocityY(this.playerJumpHeight);
                }
                if (!this.quarterPlayer.body.blocked.down) {
                    this.quarterPlayer.anims.play(this.currentJumpingKey, true);
                    this.quarterPlayer.flipX = (this.lastDirection === 'left');
                } else if (this.quarterPlayer.body.velocity.x !== 0) {
                    this.quarterPlayer.anims.play(this.currentMovementKey, true);
                } else {
                    this.quarterPlayer.anims.play(this.currentIdleKey, true);
                }
                break;
        }
    }
}