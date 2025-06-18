class LoadingScreen extends Phaser.Scene{
    constructor() {
        super("LoadingScreen");
    }

    preload() {
        // Clef Assets
        this.load.spritesheet('clefIdle','assets/playerSprites/clefIdle.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('clefRun','assets/playerSprites/clefRun.png',
            {frameWidth: 64, frameHeight: 96}
        );

        // Quarter Assets
        this.load.spritesheet('quarterIdle','assets/playerSprites/quarterIdle.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('quarterWalk','assets/playerSprites/quarterWalk.png',
            {frameWidth: 64, frameHeight: 96}
        );

        // for testing purposes
        this.load.spritesheet('slimeIdle','assets/enemySprites/slimeIdle.png',
            {frameWidth: 16, frameHeight: 16}
        );
        // this.load.tilemapTiledJSON('example','assets/testMap/example.tmj');
        // this.load.spritesheet('exampleTileset','EMC_TILES_UPDATED/TONE FIELDS32x32.png',
        //     {frameWidth: 32, frameHeight: 32}
        // );

        this.load.on('complete', () => {
            console.log("Asset loading finished.");
            this.scene.start("Level1");
        })
    }

    create() {
        // Clef Animations
        this.anims.create({
            key: 'clefIdle',
            frames: this.anims.generateFrameNumbers('clefIdle',
                {
                    start: 0,
                    end: 9
                }
            ),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'clefRun',
            frames: this.anims.generateFrameNumbers('clefRun',
                {
                    start: 0,
                    end: 7
                }
            ),
            frameRate: 8,
            repeat: -1
        })

        // Quarter Animations
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

        this.anims.create({
            key: 'quarterWalk',
            frames: this.anims.generateFrameNumbers('quarterWalk',
                {
                    start: 0,
                    end: 9
                }
            ),
            frameRate: 10,
            repeat: -1
        })
    }
}