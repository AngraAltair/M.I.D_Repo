class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    init() {
        //** Default starts with Clef's stats
        // playerType dictates if the player is Clef or Quarter
        // playerSpeed is their walk/run speed
        // currentIdleKey is which animation should be active currently depending on which player is active*/ 
        this.playerType = "Clef";
        this.playerSpeed = 200;
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
        this.collectSfx = this.sound.add('collectSfx');
        this.playerHurtSfx = this.sound.add('playerHurtSfx');
        this.enemyDyingSfx = this.sound.add('enemyDyingSfx');

        this.scene.get('MusicManager').events.emit('playMusic', 'ToneFieldsBG');
        guiLoader(this,"Level1");
        const map = this.make.tilemap({
            key: "level1"
        });
        this.skyBg = this.add.tileSprite(0, 0, map.widthInPixels, map.heightInPixels, 'toneBg').setOrigin(0, 0);
        this.skyBg.setScale(1.2);
        
        const tileset = map.addTilesetImage("ToneFieldsTiled", "tutorialTileset");
        const bg = map.createStaticLayer("bg", tileset, 0, 20);
        const upperBg = map.createDynamicLayer("upper bg", tileset, 0, 20);
        const main = map.createDynamicLayer("main", tileset, 0, 20);

        let chords = chordInitializer(this, map);
        let heart = heartInitializer(this,map);

        main.setCollisionByExclusion(-1);

        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = clefInitializer(this,0,420);
        this.quarterPlayer = quarterInitializer(this,0,420);

        this.frogEnemies = this.physics.add.group({
            classType: FrogEnemy,
            runChildUpdate: true
        });
        frogCreator(this,pathInitializer(map,"frog_position1"));
        frogCreator(this,pathInitializer(map,"frog_position2"));
        frogCreator(this,pathInitializer(map,"frog_position3"));
        frogCreator(this,pathInitializer(map,"frog_position4"));

        const foreground = map.createDynamicLayer("foreground", tileset, 0, 20);

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
                this.playerSpeed = 130;
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
                this.playerSpeed = 200;
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
                    this.scene.start("Level2");
                });
            }
        });

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(1.2);
        this.cameras.main.startFollow(this.clefPlayer);

        // Collisions
        // border collisions
        this.physics.add.collider(this.clefPlayer, main);
        this.physics.add.collider(this.quarterPlayer, main);
        this.physics.add.collider(this.frogEnemies, main);

        this.physics.add.collider(this.clefPlayer, this.frogEnemies, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.frogEnemies, enemyPlayerCollision, null, this);

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
                if (this.cursors.up.isDown && this.clefPlayer.body.blocked.down || this.keyW.isDown && this.clefPlayer.body.blocked.down) {
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
