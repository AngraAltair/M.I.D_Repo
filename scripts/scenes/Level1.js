class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    init() {
        this.playerType = null;
    }

    preload() {

    }

    create() {
        this.playerType = "Clef";

        this.clefPlayer = this.physics.add.sprite(0, 0, 'clefIdle').setFrame(0);
        this.clefPlayer.setCollideWorldBounds(true);
        this.clefPlayer.setVisible(true);

        this.quarterPlayer = this.physics.add.sprite(0, 0, 'quarterIdle').setFrame(0);
        this.quarterPlayer.setCollideWorldBounds(true);
        this.quarterPlayer.setVisible(false);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.anims.create({
            key: 'clefIdle',
            frames: this.anims.generateFrameNumbers('clefIdle',
                {
                    start: 0,
                    end: 9
                }
            ),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'quarterIdle',
            frames: this.anims.generateFrameNumbers('quarterIdle',
                {
                    start: 0,
                    end: 9
                }
            ),
            frameRate: 10,
            repeat: -1
        })

        this.input.keyboard.on('keydown_E', (event) => {
            if (this.playerType === "Clef") {
                this.playerType = "Quarter";
                this.clefPlayer.setVisible(false);
                this.quarterPlayer.setVisible(true);
                console.log(this.playerType);
            } else if (this.playerType === "Quarter") {
                this.playerType = "Clef"
                this.clefPlayer.setVisible(true);
                this.quarterPlayer.setVisible(false);
                console.log(this.playerType);
            }
            
        });
    }

    update() {

    }
}