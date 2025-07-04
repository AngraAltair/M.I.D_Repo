class Level3 extends Phaser.Scene {
    constructor() {
        super("Level3");
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

        this.bossAreaStart = false;
        this.testTrigger = false;
    }

    preload() {

    }

    create() {
        this.collectSfx = this.sound.add('collectSfx');
        this.scene.get('MusicManager').events.emit('playMusic', 'GrottoBG');
        guiLoader(this, "Level3");

        const map = this.make.tilemap({
            key: "level3"
        });
        const map2 = this.make.tilemap({
            key: "level3"
        });

        this.skyBg = this.add.tileSprite(0, 0, map.widthInPixels, map.heightInPixels, 'octaveBg').setOrigin(0, 0);
        this.skyBg.setScale(1.8);

        const tileset = map.addTilesetImage("OctaveForestTiled", "level2Tileset");
        const tileset2 = map2.addTilesetImage("GrottoTileset", "level3Tileset");
        const bg = map.createStaticLayer("bg", tileset2, 0, 20);
        const upperBg = map.createDynamicLayer("upper bg", tileset, 0, 20);
        const upperBg2 = map2.createDynamicLayer("upper bg", tileset2, 0, 20);
        const main = map.createDynamicLayer("main", tileset, 0, 20);
        const main2 = map2.createDynamicLayer("main", tileset2, 0, 20);
        const boss = map.createDynamicLayer("boss + after boss", tileset2, 0, 20);

        let chords = chordInitializer(this, map);
        let heart = heartInitializer(this,map);

        // boss.body.setEnable(false);

        // if (boss.visible) {
        //     console.log("boss layer up");
        // } else {
        //     console.log("boss layer down");
        // }

        this.moleEnemies = this.physics.add.group({
            classType: MoleEnemy,
            runChildUpdate: true
        });
        moleCreator(this, pathInitializer(map, "mole_pos1"));
        moleCreator(this, pathInitializer(map, "mole_pos2"));
        moleCreator(this, pathInitializer(map, "mole_pos3"));

        this.batEnemies = this.physics.add.group({
            classType: BatEnemy,
            runChildUpdate: true
        })
        batMultiplePathsCreator(this, pathInitializer(map, "bats_pos1"));
        // batCreator(this,pathInitializer(map,"bats_pos2"));
        batCreator(this, pathInitializer(map, "bats_pos3"));
        batCreator(this, pathInitializer(map, "bats_pos4"));
        batCreator(this, pathInitializer(map, "bats_pos5"));
        batCreator(this, pathInitializer(map, "bats_pos6"));
        batCreator(this, pathInitializer(map, "bats_pos7"));

        const demoriPoints = pathInitializer(map, "demori");
        console.log("demoriPoints =", demoriPoints);
        this.demori = demoriSpawn(this, demoriPoints, 1);

        this.demoriProjectile = this.physics.add.group();

        // this.testPlayer = clefInitializer(this, 3026,1207);
        // this.cameras.main.startFollow(this.testPlayer);

        main.setCollisionByExclusion(-1);
        boss.setCollisionByExclusion(-1);

        // if (this.demori.isAggroed) {
        //     boss.setVisible(true);
        // }

        let tut8 = this.add.image(1800, 370, 'Tut8');
        tut8.setScale(.8);

        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = clefInitializer(this, 0, 650);
        this.quarterPlayer = quarterInitializer(this, 0, 650);

        const pushable = map.getObjectLayer('pushable');
        this.pushableObjects = this.physics.add.group();
        pushable.objects.forEach(object => {
            let pushable = this.pushableObjects.create(object.x, object.y, 'crate').setFrame(4);
            pushable.body.setAllowGravity(true);
            pushable.body.setDrag(1000, 0);
            pushable.pushable = false;
            pushable.setCollideWorldBounds(true);
        })

        const foreground = map.createDynamicLayer("foreground", tileset, 0, 20);
        const foreground2 = map2.createDynamicLayer("foreground", tileset2, 0, 20);
        const upperforeground = map.createDynamicLayer("upper foreground", tileset, 0, 20);
        const water = map.createDynamicLayer("water", tileset2, 0, 20);

        // Cursor Keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        let clefBossBlock = this.physics.add.collider(this.clefPlayer, boss);
        let quarterBossBlock = this.physics.add.collider(this.quarterPlayer, boss);

        // test for zone toggle
        this.input.keyboard.on('keydown_O', (event) => {
            if (this.testTrigger) {
                this.testTrigger = false;
                this.bossAreaStart = false;
            } else {
                this.testTrigger = true;
                this.bossAreaStart = true;
            }
            console.log("test trigger: ", this.testTrigger);
        })

        boss.setVisible(true); // Always visible at the start
        clefBossBlock.active = true;
        quarterBossBlock.active = true;

        // Character Switch Event
        this.input.keyboard.on('keydown_O', (event) => {
            this.testTrigger = !this.testTrigger;
            this.bossAreaStart = this.testTrigger;

            if (this.bossAreaStart) {
                boss.setVisible(true);
                clefBossBlock.active = true;
                quarterBossBlock.active = true;
            } else {
                boss.setVisible(false);
                clefBossBlock.active = false;
                quarterBossBlock.active = false;
            }

            console.log("Boss area toggled:", this.bossAreaStart ? "Blocked & visible" : "Unblocked & invisible");
        });


        emitter.on('chord-collected', () => {
            if (this.chordsCollected === this.totalChords) {
                this.levelFinished = true;
                this.time.delayedCall(300, () => {
                    this.cameras.main.fadeOut(300);
                    emitter.emit('scene-switch');
                    this.scene.start("Level4");
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
        this.physics.add.collider(this.moleEnemies, main);
        this.physics.add.collider(this.pushableObjects, main);
        this.physics.add.collider(this.demori, main);
        this.physics.add.collider(this.pushableObjects, main);
        this.physics.add.collider(this.demoriProjectile, main);

        this.physics.add.collider(this.clefPlayer, this.pushableObjects, null, (player, objects) => {
            pushableBlocksToggle(player, objects, this);
        }, this);
        this.physics.add.collider(this.quarterPlayer, this.pushableObjects, null, (player, objects) => {
            pushableBlocksToggle(player, objects, this);
        }, this);
        this.physics.add.collider(this.demori, this.pushableObjects, null, (demori, objects) => {
            if (!this.demori.invulnerable) {
                this.demori.lives--;
                emitter.emit('demori-damage', this.demori.lives, this.demori.maxLives);
                this.demori.invulnerable = true
                objects.disableBody(true, true);
            }
            this.time.delayedCall(1000, () => {
                this.demori.invulnerable = false;
            });
            if (this.demori.demoriLives <= 0) {
                emitter.emit('demori-defeat');
            }
        })

        this.physics.add.collider(this.clefPlayer, this.demoriProjectile, null, (player, object) => {
            if (!this.invulnerable) {
                this.lives--;
                this.invulnerable = true;
                emitter.emit('lives-damage', this.lives);
                object.disableBody(true, true);
            }

            this.time.delayedCall(1000, () => {
                this.invulnerable = false;
            });
            console.log("player hurt");


            if (this.lives <= 0) {
                console.log(this.lives);
                emitter.emit('game-over');
            }
        }, this);



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

        this.physics.add.collider(this.clefPlayer, this.moleEnemies, () => {
            if (!this.invulnerable) {
                this.lives--;
                this.invulnerable = true;
                emitter.emit('lives-damage', this.lives);

                this.time.delayedCall(1000, () => {
                    this.invulnerable = false;
                });
            }

            if (this.lives <= 0) {
                console.log(this.lives);
                emitter.emit('game-over');
                console.log("game over!");
            }
        }, isHostileEnemy, this);
        this.physics.add.collider(this.quarterPlayer, this.moleEnemies, () => {
            if (!this.invulnerable) {
                this.lives--;
                this.invulnerable = true;
                emitter.emit('lives-damage', this.lives);

                this.time.delayedCall(1000, () => {
                    this.invulnerable = false;
                });
            }

            if (this.lives <= 0) {
                console.log(this.lives);
                emitter.emit('game-over');
                console.log("game over!");
            }
        }, isHostileEnemy, this);

        this.physics.add.collider(this.moleEnemies, this.pushableObjects, (enemies, obj) => {
            if (enemies.active) {
                enemies.disableBody(true, true);
            }
        });

        this.physics.add.collider(this.clefPlayer, this.batEnemies, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.batEnemies, enemyPlayerCollision, null, this);

        this.physics.add.overlap(this.quarterPlayer, chords, (player, chords) => {
            chordCollecting(player, chords, this);
            if (this.quarterPlayer.visible) {
                this.collectSfx.play();
            }
        }, null, this);

        this.physics.add.overlap(this.clefPlayer, heart, (player, heart) => {
            heartCollecting(player, heart, this);
        }, function () {
            return this.lives !== 3;
        }, this);
        this.physics.add.overlap(this.quarterPlayer, heart, (player, heart) => {
            heartCollecting(player, heart, this);
        }, function () {
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
                if (this.cursors.up.isDown && (this.quarterPlayer.body.blocked.down || this.quarterPlayer.body.touching.down) || this.keyW.isDown && (this.quarterPlayer.body.blocked.down || this.quarterPlayer.body.touching.down)) {
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
                    this.quarterPlayer.anims.play("quarterSing", true);

                    quarterSingingSkill(this, this.batEnemies);

                } else {
                    this.isSinging = false;
                }

                break;
        }
    }
}