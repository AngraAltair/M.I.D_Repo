class Level4 extends Phaser.Scene {
    constructor() {
        super("Level4");
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
        this.lastDirection = 'right';
        this.playerJumpHeight = -330;
        this.lives = 3;

        this.chordsCollected = 0;
        this.totalChords = 0;

        this.levelFinished = false;

        this.invulnerable = false;

        this.isPushing = false;
        this.isSinging = false;

        this.lastSingTime = 0;
        this.singCooldown = 500; // in milliseconds
    }

    preload() {

    }

    create() {
        this.voiceSfx = this.sound.add('voiceSfx', 0.3);
        this.boulderSfx = this.sound.add('boulderSfx');
        this.collectSfx = this.sound.add('collectSfx');
        this.playerHurtSfx = this.sound.add('playerHurtSfx');
        this.enemyDyingSfx = this.sound.add('enemyDyingSfx');        
        this.scene.get('MusicManager').events.emit('playMusic', 'MountainBG');
        guiLoader(this, "Level4");

        const map = this.make.tilemap({
            key: "level4"
        });
        const map2 = this.make.tilemap({
            key: "level4"
        });

        this.skyBg = this.add.tileSprite(0, 0, map.widthInPixels, map.heightInPixels, 'mezzoBg').setOrigin(0, 0);
        this.skyBg.setScale(3);

        const tileset = map.addTilesetImage("GrottoTileset", "level3Tileset");
        const tileset2 = map2.addTilesetImage("MountainTiled", "level4Tileset");
        const bouldertile = map2.addTilesetImage("BoulderMountain", "boulder");
        const bg = map.createStaticLayer("bg", tileset, 0, 20);
        const bg2 = map2.createStaticLayer("bg", tileset2, 0, 20);
        const upperBg = map.createDynamicLayer("upper bg", tileset, 0, 20);
        const upperBg2 = map2.createDynamicLayer("upper bg", tileset2, 0, 20);
        const main = map.createDynamicLayer("main", tileset, 0, 20);
        const main2 = map2.createDynamicLayer("main", tileset2, 0, 20);

        let chords = chordInitializer(this, map);
        let heart = heartInitializer(this,map);

        main.setCollisionByExclusion(-1);

        this.batEnemies = this.physics.add.group({
            classType: BatEnemy,
            runChildUpdate: true
        })
        batCreator(this, pathInitializer(map, "bats_pos1"));
        batCreator(this, pathInitializer(map, "bats_pos2"));
        batCreator(this, pathInitializer(map, "bats_pos3"));
        batCreator(this, pathInitializer(map, "bats_pos4"));

        this.swarmEnemies = this.physics.add.group({
            classType: SwarmEnemy,
            runChildUpdate: true
        })
        swarmCreator(this, pathInitializer(map, "swarm_pos1"));
        swarmCreator(this, pathInitializer(map, "swarm_pos2"));
        swarmCreator(this, pathInitializer(map, "swarm_pos3"));

        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = clefInitializer(this, 0, 400);
        this.quarterPlayer = quarterInitializer(this, 0, 400);

        const pushable = map.getObjectLayer('pushable');
        this.pushableObjects = this.physics.add.group();
        pushable.objects.forEach(object => {
            let pushable = this.pushableObjects.create(object.x, object.y, 'boulder').setFrame(8);
            pushable.type = 'boulder';
            pushable.body.setAllowGravity(true);
            pushable.body.setFriction(2, 0);
            pushable.body.setDrag(1000, 0);
            pushable.body.setMass(1.5); // inside create()
            // pushable.pushable = false;
            pushable.setCollideWorldBounds(true);
        })

        // this.border = this.physics.add.sprite(1750,0, 'border').setFrame(0).setScale(4);
        // this.border.setCollideWorldBounds(false);
        // this.border.anims.play('border', true);

        const foreground = map.createDynamicLayer("foreground", tileset, 0, 20);
        const foreground2 = map2.createDynamicLayer("foreground", tileset2, 0, 20);
        const upperforeground = map.createDynamicLayer("upper foreground", tileset, 0, 20);
        const water = map.createDynamicLayer("water", tileset2, 0, 20);
        // const boss = map.createDynamicLayer("boss + after boss", tileset2, 0, 20);

        // boss.setCollisionByExclusion(-1);


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
                this.playerSpeed = 180;
                this.playerJumpHeight = -330;

                console.log(this.playerType);
            }
            emitter.emit('character-switched', this.playerType);
        });

        emitter.on('chord-collected', () => {
            if (this.chordsCollected === this.totalChords) {
                this.levelFinished = true;
                this.time.delayedCall(300, () => {
                    this.cameras.main.fadeOut(300);
                    emitter.emit('scene-switch');
                    this.scene.start("Level5");
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
        this.physics.add.collider(this.pushableObjects, main);

        this.physics.add.collider(this.pushableObjects, this.pushableObjects, (blockA, blockB) => {
            // Check if one is on top of the other
            console.log((Math.abs(blockA.y - blockB.y)));
            if (Math.abs(blockA.y - blockB.y) === 0) {
                console.log("not stacking");
                return;
            } else {
                if (blockA.y < blockB.y && blockA.body.velocity.y === 0) {
                    console.log("blockA top of blockB");
                    blockA.body.setImmovable(false);
                    blockB.body.setImmovable(true); // make the bottom block act like ground

                }
                else if (blockB.y < blockA.y && blockB.body.velocity.y === 0) {
                    console.log("blockB top of blockA");
                    blockB.body.setImmovable(false);
                    blockA.body.setImmovable(true);
                }
            }
        });

        this.physics.add.collider(this.clefPlayer, this.pushableObjects, null, (player, objects) => {
            pushableBlocksToggle(player, objects, this);
        }, this);
        this.physics.add.collider(this.quarterPlayer, this.pushableObjects, null, (player, objects) => {
            pushableBlocksToggle(player, objects, this);
        }, this);


        this.physics.add.collider(this.clefPlayer, this.batEnemies, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.batEnemies, enemyPlayerCollision, null, this);

        this.physics.add.collider(this.clefPlayer, this.swarmEnemies, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.swarmEnemies, enemyPlayerCollision, null, this);

        this.physics.add.overlap(this.quarterPlayer, chords, (player, chords) => {
            chordCollecting(player, chords, this);
            if (this.quarterPlayer.visible) {
            this.collectSfx.play();
            }
        }, null, this);

        this.physics.add.overlap(this.clefPlayer, heart, (player, heart) => {
            heartCollecting(player, heart, this);
        }, function () {
                this.collectSfx.play();
            return this.lives !== 3;
        }, this);
        this.physics.add.overlap(this.quarterPlayer, heart, (player, heart) => {
            heartCollecting(player, heart, this);
        }, function () {
                this.collectSfx.play();
            return this.lives !== 3;
        }, this);


    }

    update(time, delta) {
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
                if (this.cursors.up.isDown && (this.clefPlayer.body.blocked.down || this.clefPlayer.body.touching.down) || this.keyW.isDown && (this.clefPlayer.body.blocked.down || this.clefPlayer.body.touching.down)) {
                    this.clefPlayer.setVelocityY(this.playerJumpHeight);
                    this.quarterPlayer.setVelocityY(this.playerJumpHeight);
                }

                if (!this.clefPlayer.body.blocked.down) {
                    this.clefPlayer.anims.play(this.currentJumpingKey, true);
                    this.clefPlayer.flipX = (this.lastDirection === 'left');
                }
                else if (this.keyE.isDown && this.isPushing == true && this.clefPlayer.body.velocity.x !== 0) {
                    this.clefPlayer.anims.play("clefPush", true);
                }
                else if (this.clefPlayer.body.velocity.x !== 0) {
                    this.clefPlayer.anims.play(this.currentMovementKey, true);
                }
                else {
                    this.clefPlayer.anims.play(this.currentIdleKey, true);
                }

                if (this.quarterPlayer.x != this.clefPlayer.x) {
                    this.quarterPlayer.setX(this.clefPlayer.x);
                }
                if (this.quarterPlayer.y != this.clefPlayer.y) {
                    this.quarterPlayer.setY(this.clefPlayer.y);
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
                if (this.cursors.up.isDown && this.quarterPlayer.body.blocked.down || this.keyW.isDown && this.quarterPlayer.body.blocked.down) {
                    this.clefPlayer.setVelocityY(this.playerJumpHeight);
                    this.quarterPlayer.setVelocityY(this.playerJumpHeight);
                }

                if (!this.isSinging) {
                    if (!this.quarterPlayer.body.blocked.down) {
                        this.quarterPlayer.anims.play(this.currentJumpingKey, true);
                        this.quarterPlayer.flipX = (this.lastDirection === 'left');
                    } else if (this.quarterPlayer.body.velocity.x !== 0) {
                        this.quarterPlayer.anims.play(this.currentMovementKey, true);
                    } else {
                        this.quarterPlayer.anims.play(this.currentIdleKey, true);
                    }
                }

                if (this.clefPlayer.x != this.quarterPlayer.x) {
                    this.clefPlayer.setX(this.quarterPlayer.x);
                }
                if (this.clefPlayer.y != this.quarterPlayer.y) {
                    this.clefPlayer.setY(this.quarterPlayer.y);
                }

                if (this.keyE.isDown) {
                    this.isSinging = true;

                    this.quarterPlayer.setVelocity(0);
                    this.clefPlayer.setVelocity(0);
                    
                    if (
                    !this.quarterPlayer.anims.isPlaying ||
                    this.quarterPlayer.anims.currentAnim.key !== "quarterSing"
                    ) {
                    this.quarterPlayer.anims.play("quarterSing", true);
                    this.voiceSfx.play({loop: true});
                    }


                    quarterSingingSkill(this, this.batEnemies, this.swarmEnemies);

                } else {
                    this.isSinging = false;
                    this.voiceSfx.stop();
                }

                break;
        }
    }
}