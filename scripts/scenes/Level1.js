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
        this.playerSpeed = 170;
        this.currentIdleKey = "clefIdle";
        this.currentMovementKey = "clefRun";
        this.lives = 3;
    }

    preload() {

    }

    create() {
        // Clef and Quarter Initialization, always starts as Clef
        this.clefPlayer = this.physics.add.sprite(0, 0, 'clefIdle').setFrame(0);
        this.clefPlayer.setCollideWorldBounds(true);
        this.clefPlayer.setVisible(true);

        this.quarterPlayer = this.physics.add.sprite(0, 0, 'quarterIdle').setFrame(0);
        this.quarterPlayer.setCollideWorldBounds(true);
        this.quarterPlayer.setVisible(false);

        // TEST ENEMY
        this.enemy = this.physics.add.sprite(250, 0, 'slimeIdle').setFrame(0).setScale(2);
        this.enemy.setCollideWorldBounds(true);

        // Cursor Keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Character Switch Event
        this.input.keyboard.on('keydown_TWO', (event) => {
            if (this.playerType === "Clef") {
                // Switches to Quarter if player is Clef
                this.playerType = "Quarter";
                this.clefPlayer.setVisible(false);
                this.quarterPlayer.setVisible(true);

                this.currentIdleKey = "quarterIdle";
                this.currentMovementKey = "quarterWalk";
                this.playerSpeed = 85;

                console.log(this.playerType);
            } else if (this.playerType === "Quarter") {
                // Switches to Clef if player is Quarter
                this.playerType = "Clef"
                this.clefPlayer.setVisible(true);
                this.quarterPlayer.setVisible(false);

                this.currentIdleKey = "clefIdle";
                this.currentMovementKey = "clefRun";
                this.playerSpeed = 170;

                console.log(this.playerType);
            }
        });

        // Collisions
        this.physics.add.collider(this.clefPlayer,this.enemy,livesDamage,null,this);
        this.physics.add.collider(this.quarterPlayer,this.enemy,livesDamage,null,this);
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

                    this.clefPlayer.anims.play(this.currentMovementKey, true);
                } else if (this.cursors.right.isDown) {
                    this.clefPlayer.setVelocityX(this.playerSpeed);
                    this.quarterPlayer.setVelocityX(this.playerSpeed);

                    this.clefPlayer.flipX = false;
                    this.quarterPlayer.flipX = false;
                    
                    this.clefPlayer.anims.play(this.currentMovementKey, true);
                } else {
                    this.quarterPlayer.setVelocityX(0);
                    this.clefPlayer.setVelocityX(0);

                    this.clefPlayer.anims.play(this.currentIdleKey, true);
                }
                // Jump Logic
                if (this.cursors.up.isDown && this.clefPlayer.body.blocked.down) {
                    this.clefPlayer.setVelocityY(-190);
                    this.quarterPlayer.setVelocityY(-190);
                }
            case "Quarter":
                // Quarter Movement and Animations
                if (this.cursors.left.isDown) {
                    this.clefPlayer.setVelocityX(-this.playerSpeed);
                    this.quarterPlayer.setVelocityX(-this.playerSpeed);

                    this.clefPlayer.flipX = true;
                    this.quarterPlayer.flipX = true;

                    this.quarterPlayer.anims.play(this.currentMovementKey, true);
                } else if (this.cursors.right.isDown) {
                    this.clefPlayer.setVelocityX(this.playerSpeed);
                    this.quarterPlayer.setVelocityX(this.playerSpeed);

                    this.clefPlayer.flipX = false;
                    this.quarterPlayer.flipX = false;

                    this.quarterPlayer.anims.play(this.currentMovementKey, true);
                } else {
                    this.clefPlayer.setVelocityX(0);
                    this.quarterPlayer.setVelocityX(0);
                    this.quarterPlayer.anims.play(this.currentIdleKey, true);
                }
                // Jump Logic
                if (this.cursors.up.isDown && this.quarterPlayer.body.blocked.down) {
                    this.clefPlayer.setVelocityY(-190);
                    this.quarterPlayer.setVelocityY(-190);
                }
        }
    }
}