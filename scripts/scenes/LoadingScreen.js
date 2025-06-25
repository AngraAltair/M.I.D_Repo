class LoadingScreen extends Phaser.Scene{
    constructor() {
        super("LoadingScreen");
    }

    preload() {
        // Clef Assets
        this.load.spritesheet('clefIdle','StarBleu/Animations/Players/Clef/Clef(Idle)640x96.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('clefRun','StarBleu/Animations/Players/Clef/Clef(Running)512x96.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('clefJump','StarBleu/Animations/Players/Clef/Clef(jumping)192x96.png',
            {frameWidth: 64, frameHeight: 96}
        );

        // Quarter Assets
        this.load.spritesheet('quarterIdle','StarBleu/Animations/Players/Quarter/Quarter(Idle)640x96.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('quarterWalk','StarBleu/Animations/Players/Quarter/Quarter(walking)640x96.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('quarterJump', 'StarBleu/Animations/Players/Quarter/Quarter(jumping)192x96.png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('quarterSing', 'StarBleu/Animations/Players/Quarter/Quarter(singing)320x96.png',
            {frameWidth: 64, frameHeight: 96}
        );

        // for testing purposes
        this.load.spritesheet('slimeIdle','assets/enemySprites/slimeIdle.png',
            {frameWidth: 16, frameHeight: 16}
        );
        this.load.tilemapTiledJSON('tutorial','assets/Maps/Tutorial1.tmj');
        this.load.spritesheet('tutorialTileset','StarBleu/Map Tiles/Tone Fields (256x288).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.tilemapTiledJSON('level1','assets/Maps/Level1Map.tmj');

        this.load.tilemapTiledJSON('level2','assets/Maps/Level2Map.tmj');
        this.load.spritesheet('level2Tileset', 'StarBleu/Map Tiles/Octave Forest(768x512).png',
            {frameWidth: 32, frameHeight: 32}
        );
        
        this.load.spritesheet('frogxample', 'StarBleu/Animations/Non-Animated/TuneFrog(for32x32).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('chordxample', 'StarBleu/Collectables/Chord(32x32).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('border', 'StarBleu/Animations/borderComplete.png',
            {frameWidth: 32, frameHeight: 48}
        )

        // collectibles
        this.load.spritesheet('chordSprite', 'StarBleu/Collectables/Chord(32x32).png',
            {frameWidth: 32, frameHeight: 32}
        );


        this.load.on('complete', () => {
            console.log("Asset loading finished.");
            this.scene.start("Level2");
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

        this.anims.create({
            key: 'clefJump',
            frames: this.anims.generateFrameNumbers('clefJump',
                {
                    start: 0,
                    end: 2
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

        this.anims.create({
            key: 'quarterJump',
            frames: this.anims.generateFrameNumbers('quarterJump',
                {
                    start: 0,
                    end: 2
                }
            ),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'quarterSing',
            frames: this.anims.generateFrameNumbers('quarterSing',
                {
                    start: 0,
                    end: 4
                }
            ),
            frameRate: 10,
            repeat: -1
        })

        //border animation
        this.anims.create({
            key: 'border',
            frames: this.anims.generateFrameNumbers('border',
                {
                    start: 0,
                    end: 5
                }
            ),
            frameRate: 8,
            repeat: -1
        })
    }
}