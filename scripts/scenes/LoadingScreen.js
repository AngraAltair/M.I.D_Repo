class LoadingScreen extends Phaser.Scene{
    constructor() {
        super("LoadingScreen");
    }

    preload() {
        this.load.spritesheet('clefIdle','assets/playerSprites/clefIdle.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('quarterIdle','assets/playerSprites/quarterIdle.png',
            {frameWidth: 64, frameHeight: 96}
        );

        this.load.on('complete', () => {
            console.log("Asset loading finished.");
            this.scene.start("Level1");
        })
    }

    create() {
        
    }
}