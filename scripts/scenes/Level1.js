class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    preload() {

    }

    create() {
        this.player = this.physics.add.sprite(0,0,'clefIdle').setFrame(0);
        this.player.setCollideWorldBounds(true);

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
    }

    update() {
        this.player.anims.play('clefIdle',true);
    }
}