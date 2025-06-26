class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
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
        this.totalChords = null;
    }

    preload() {

    }

    create() {
        // testmap creation
        const map = this.make.tilemap({
            key: "tutorial"
        });
        const tileset = map.addTilesetImage("ToneFieldsTiled", "tutorialTileset");
        const bg = map.createStaticLayer("bg", tileset, 0, 20);
        const upperBg = map.createDynamicLayer("upper bg", tileset, 0, 20);
        const main = map.createDynamicLayer("main", tileset, 0, 20);

        // placements for chords and frog
        //const frogset = map.addTilesetImage("TuneFrog","frogxample");
        //const chordset = map.addTilesetImage("Chord", "chordxample");
        //const placement = map.createDynamicLayer("disable later", set, 0, 20); << replace to chordset or frogset

        const chordLayer = map.getObjectLayer("chords");
        let chords = this.physics.add.group();
        chordLayer.objects.forEach(object => {
            let chord = chords.create(object.x, object.y, 'chordSprite');
            chord.body.setAllowGravity(false);
            this.totalChords++;
        })
        console.log(this.totalChords);

        // const frog1 = map.createDynamicLayer("frog1",tileset,0,20);

        // const frogPosition = map.getObjectLayer("frog_position");
        // let frogPositions = [];
        // frogPosition.objects.forEach(object => {
        //     let frogPosition = [object.x,object.y];
        //     frogPositions.push(frogPosition);
        // })
        // console.log(frogPositions);

        // let graphics = this.add.graphics();

        // let path = this.add.path(frogPositions[0][0],frogPositions[0][1]);
        // path.lineTo(frogPositions[1][0],frogPositions[1][1]);

        // graphics.lineStyle(3, 0xffffff, 1);
        // path.draw(graphics);

        // // this.frogEnemy = new FrogEnemy(this,frogPositions[0][0],frogPositions[0][1],path);
        // // this.frogEnemy.startOnPath();

        // // let frogEnemies = this.physics.add.group();
        // // frogEnemies.add(this.frogEnemy);

        // this.frogEnemies = this.physics.add.group({
        //     classType: FrogEnemy,
        //     runChildUpdate: true
        // });

        // this.frogEnemies.get(frogPositions[0][0],frogPositions[0][1],'frogSprite',path);

        this.frogEnemies = this.physics.add.group({
            classType: FrogEnemy,
            runChildUpdate: true
        });

        const frogPathObjects = map.getObjectLayer("frog_position");
        const frogPoints = frogPathObjects.objects;

        // Group points into pairs
        for (let i = 0; i < frogPoints.length; i += 2) {
            let start = frogPoints[i];
            let end = frogPoints[i + 1];

            let line = new Phaser.Curves.Line(
                new Phaser.Math.Vector2(start.x, start.y),
                new Phaser.Math.Vector2(end.x, end.y)
            );

            let path = new Phaser.Curves.Path();
            path.add(line);

            const graphics = this.add.graphics();
            graphics.lineStyle(1, 0xffffff, 0.5);
            path.draw(graphics);

            let frog = new FrogEnemy(this, start.x, start.y, 'frogSprite', path);
            frog.startOnPath();
            this.frogEnemies.add(frog);
        }


        main.setCollisionByExclusion(-1);

        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = this.physics.add.sprite(0, 90, 'clefIdle').setFrame(0);
        this.clefPlayer.setCollideWorldBounds(true);
        this.clefPlayer.setVisible(true);

        this.quarterPlayer = this.physics.add.sprite(0, 90, 'quarterIdle').setFrame(0);
        this.quarterPlayer.setCollideWorldBounds(true);
        this.quarterPlayer.setVisible(false);

        // TEST ENEMY
        this.enemy = this.physics.add.sprite(250, 0, 'slimeIdle').setFrame(0).setScale(2);

        const foreground = map.createDynamicLayer("foreground", tileset, 0, 20);

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
        });

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(1.2);
        this.cameras.main.startFollow(this.clefPlayer);

        // Collisions
        // border collisions
        this.physics.add.collider(this.clefPlayer, main);
        this.physics.add.collider(this.quarterPlayer, main);
        this.physics.add.collider(this.enemy, main);
        this.physics.add.collider(this.frogEnemies, main);

        this.physics.add.collider(this.clefPlayer, this.frogEnemies, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.frogEnemies, enemyPlayerCollision, null, this);

        this.physics.add.collider(this.clefPlayer, this.enemy, enemyPlayerCollision, null, this);
        this.physics.add.collider(this.quarterPlayer, this.enemy, enemyPlayerCollision, null, this);

        this.physics.add.overlap(this.clefPlayer, chords, chordCollecting, null, this);
    }

    update(time, delta) {
        // this.frogEnemy.update(delta);
        // this.frogEnemies.children.iterate(function (child) {
        //     child.update(delta);
        // })

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

        // console.log(this.playerJumpHeight);
    }
}