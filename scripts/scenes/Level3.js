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
    }

    preload() {

    }

    create() {
        // testmap creation
        guiLoader(this,"Level3");

        const map = this.make.tilemap({
            key: "level3"
        });
        const map2 = this.make.tilemap({
            key: "level3"
        });
        const tileset = map.addTilesetImage("OctaveForestTiled","level2Tileset");
        const tileset2 = map2.addTilesetImage("GrottoTileset","level3Tileset");
        const bg = map.createStaticLayer("bg", tileset2, 0, 20);
        const upperBg = map.createDynamicLayer("upper bg", tileset, 0, 20);
        const upperBg2 = map2.createDynamicLayer("upper bg", tileset2, 0, 20);
        const main = map.createDynamicLayer("main", tileset, 0, 20);
        const main2 = map2.createDynamicLayer("main", tileset2, 0, 20);
        
        let chords = chordInitializer(this, map);

        this.moleEnemies = this.physics.add.group({
            classType: MoleEnemy,
            runChildUpdate: true
        });
        moleCreator(this,pathInitializer(map,"mole_pos1"));
        moleCreator(this,pathInitializer(map,"mole_pos2"));
        moleCreator(this,pathInitializer(map,"mole_pos3"));

        main.setCollisionByExclusion(-1);

        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = clefInitializer(this,0,650);
        this.quarterPlayer = quarterInitializer(this,0,650);


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
        this.physics.add.collider(this.clefPlayer,main);
        this.physics.add.collider(this.quarterPlayer,main);
        this.physics.add.collider(this.moleEnemies,main);
        // this.physics.add.collider(this.enemy,main);
        //this.physics.add.collider(this.border,main);
        // this.physics.add.collider(this.clefPlayer,this.enemy,enemyPlayerCollision,null,this);

        this.physics.add.collider(this.clefPlayer,this.moleEnemies,enemyPlayerCollision,null,this);
        this.physics.add.collider(this.quarterPlayer,this.moleEnemies,enemyPlayerCollision,null,this);
    }

    update() {
        switch (this.playerType) {
            case "Clef":
                // Clef Movement and Animations
                if (this.cursors.left.isDown) {
                    this.clefPlayer.setVelocityX(-this.playerSpeed);
                    this.quarterPlayer.setVelocityX(-this.playerSpeed);

                    this.clefPlayer.flipX = true;
                    this.quarterPlayer.flipX = true;
                    this.lastDirection = 'left';

                } else if (this.cursors.right.isDown) {
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
                if (this.cursors.up.isDown && this.clefPlayer.body.blocked.down) {
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
                if (this.cursors.left.isDown) {
                    this.clefPlayer.setVelocityX(-this.playerSpeed);
                    this.quarterPlayer.setVelocityX(-this.playerSpeed);

                    this.clefPlayer.flipX = true;
                    this.quarterPlayer.flipX = true;
                    this.lastDirection = 'left';
                } else if (this.cursors.right.isDown) {
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
                if (this.cursors.up.isDown && this.quarterPlayer.body.blocked.down) {
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