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
        this.load.spritesheet('clefPush','StarBleu/Animations/Players/Clef/Clef(pushing)640x96.png',
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

        // Global Options UI
        this.load.image('optionsWindow','StarBleuGameUi/optionsSettingsUi/optionsHolderTexted283x222.png');
        this.load.image('optionsWindowExit','StarBleuGameUi/optionsSettingsUi/xButton32x32.png');
        this.load.spritesheet('optionsVolumeButton','StarBleuGameUi/optionsSettingsUi/volumeButtonOnOffSprite32x32Each.png',{
            frameWidth: 32, frameHeight: 32
        });

        //Audio
        this.load.audio('buttonSfx', 'SFX_Starbleu/ButtonClick.mp3');
        this.load.audio('collectSfx', 'SFX_Starbleu/collectCoin.mp3');
        this.load.audio('playerHurtSfx', 'SFX_Starbleu/playerHurt.mp3');
        this.load.audio('enemyDyingSfx', 'SFX_Starbleu/eneDyingEffex.mp3');
        this.load.audio('crateSfx', 'SFX_Starbleu/CratePushingSFX.mp3');
        this.load.audio('labCrateSfx', 'SFX_Starbleu/metalCratePushingSFX.mp3');
        this.load.audio('boulderSfx', 'SFX_Starbleu/boulderPushingSFX.mp3');
        this.load.audio('bossHitSfx', 'SFX_Starbleu/DemoriHurt.mp3');
        this.load.audio('voiceSfx', 'SFX_Starbleu/QuarterSinging.mp3');
        this.load.audio('bossDeadSfx', 'SFX_Starbleu/DemoriDead.mp3');
        this.load.audio('teleportSfx', 'SFX_Starbleu/teleportSfx.mp3');

        // Tutorial Tilemap
        this.load.image('toneBg','BACKGROUNDS700x500/ToneFieldsBackgroundLOOP700x500.png');
        this.load.tilemapTiledJSON('tutorial','assets/Maps/Tutorial1.tmj');
        this.load.spritesheet('tutorialTileset','StarBleu/Map Tiles/Tone Fields (256x288).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.tilemapTiledJSON('level1','assets/Maps/Level1Map.tmj');
        this.load.image('Tut1','StarBleuGameUi/tutorialPopupImages/LeftandRight283x80.png');
        this.load.image('Tut2','StarBleuGameUi/tutorialPopupImages/Jump283x80.png');
        this.load.image('Tut3','StarBleuGameUi/tutorialPopupImages/Switch283x80.png');
        this.load.image('Tut4','StarBleuGameUi/tutorialPopupImages/Collect283x80.png');
        this.load.image('Tut5','StarBleuGameUi/tutorialPopupImages/defeatgroundedEnemies283x80.png');
        this.load.image('Tut6','StarBleuGameUi/tutorialPopupImages/ClefEpush283x80.png');
        this.load.image('Tut7','StarBleuGameUi/tutorialPopupImages/QuarterESing283x80.png');
        this.load.image('Tut8','StarBleuGameUi/tutorialPopupImages/pushableDefeatMoles283x80.png');
        this.load.image('Tut9','StarBleuGameUi/tutorialPopupImages/mightBeUseful283x80.png');

        this.load.image('octaveBg','BACKGROUNDS700x500/OctaveForestBackgroundLOOP700x500.png');
        this.load.tilemapTiledJSON('level2','assets/Maps/Level2Map.tmj');
        this.load.spritesheet('level2Tileset', 'StarBleu/Map Tiles/Octave Forest(768x512).png',
            {frameWidth: 32, frameHeight: 32}
        );

        this.load.tilemapTiledJSON('level3','assets/Maps/Level3Map.tmj');
        this.load.spritesheet('level3Tileset', 'StarBleu/Map Tiles/Grotto(1056x576).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('crate', 'StarBleu/Pushables/Grotto Wooden Crate(64x64).png',
            {frameWidth: 64, frameHeight: 64}
        )

        this.load.image('mezzoBg','BACKGROUNDS700x500/MezzoMountainsBackgroundLOOP700x500.png');
        this.load.tilemapTiledJSON('level4', 'assets/Maps/Level4Map.tmj');
        this.load.spritesheet('level4Tileset', 'StarBleu/Map Tiles/Mountain(1312x576).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('boulder','StarBleu/Pushables/Mountain Boulder(96x96).png',
            {frameWidth: 96, frameHeight: 96}
        );

        this.load.image('adagioBg','BACKGROUNDS700x500/AdagioRouteBackground700x500.png');
        this.load.tilemapTiledJSON('level5', 'assets/Maps/Level5Map.tmj');
        this.load.spritesheet('level5Tileset', 'StarBleu/Map Tiles/Path(1646x576).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('path_boulder', 'StarBleu/Pushables/Path Boulder(96x96).png',
            {frameWidth: 96, frameHeight: 96}
        );

        this.load.tilemapTiledJSON('level6', 'assets/Maps/Level6Map.tmj');
        this.load.spritesheet('level6Tileset', 'StarBleu/Map Tiles/LAB(1184x1440).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('webs','StarBleu/webs32x32each.png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('lab_crate', 'StarBleu/Pushables/Lab Metal Crate White(64x64).png',
            {frameWidth: 64, frameHeight: 64}
        )

        // Collectibles
        this.load.spritesheet('chordSprite', 'StarBleu/Collectables/Chord(32x32).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('heartSprite', 'StarBleu/Collectables/Heart (32x32).png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet('keySprite', 'StarBleu/Collectables/Music Key (32x48).png',
            {frameWidth: 32, frameHeight: 48}
        );
        this.load.spritesheet('noteFruit', 'StarBleu/Collectables/Note Fruit (39x57).png',
            {frameWidth: 39, frameHeight: 57}
        );

        // Platforms
        this.load.spritesheet('platform1', 'platformIndividual/platform64x32.png',
            {frameWidth: 64, frameHeight: 32}
        );
        this.load.spritesheet('platform2', 'platformIndividual/platform96x32.png',
            {frameWidth: 96, frameHeight: 32}
        );
        this.load.spritesheet('platform3', 'platformIndividual/platform128x32.png',
            {frameWidth: 128, frameHeight: 32}
        );
        this.load.spritesheet('platform3', 'platformIndividual/platform160x32.png',
            {frameWidth: 160, frameHeight: 32}
        );
        
        // Enemies
        this.load.spritesheet('demoriSpriteF1','StarBleu/Animations/Demori/scaleUp(200)/Demori(idle)(FORM1)104x178.png',
            {frameWidth: 104, frameHeight: 178}
        )
        this.load.spritesheet('demoriIdleF1','StarBleu/Animations/Demori/scaleUp(200)/Demori(idle)(FORM1)1040x178.png',
            {frameWidth: 104, frameHeight: 178}
        )

        this.load.spritesheet('demoriSpriteF2','StarBleu/Animations/Demori/scaleUp(200)/Demori(idle)(FORM2)104x178.png',
            {frameWidth: 104, frameHeight: 178}
        )
        this.load.spritesheet('demoriIdleF2','StarBleu/Animations/Demori/scaleUp(200)/Demori(idle)(FORM2)1040x178.png',
            {frameWidth: 104, frameHeight: 178}
        )
        this.load.spritesheet('demoriTpF2','StarBleu/Animations/Demori/Demori(teleport)(FORM2)312x89-Sheet.png',
            {frameWidth: 104, frameHeight: 178}
        )

        this.load.spritesheet('frogSprite', 'StarBleu/Animations/Non-Animated/TuneFrog(for32x32).png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('frogMoving', 'StarBleu/Animations/Enemies/Tune Frog(hopping)832x96.png',
            {frameWidth: 64, frameHeight: 96}
        );

        this.load.spritesheet('snakeSprite','StarBleu/Animations/Non-Animated/ScalingSnake(for32x32).png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('snakeMoving','StarBleu/Animations/Enemies/Scaling Snake(hopping)640x64.png',
            {frameWidth: 64, frameHeight: 64}
        );

        this.load.spritesheet('moleSprite','StarBleu/Animations/Non-Animated/MusicMole(for32x32).png',
            {frameWidth: 64, frameHeight: 96}
        );
        this.load.spritesheet('moleMovement','StarBleu/Animations/Enemies/Music Moles(appearing)704x64.png',
            {frameWidth: 64, frameHeight: 64}
        );

        this.load.spritesheet('batSprite','StarBleu/Animations/Non-Animated/Notey Bat(flying)64x70.png',
            {frameWidth: 64, frameHeight: 70}
        );
        this.load.spritesheet('batMoving','StarBleu/Animations/Enemies/Notey Bat(flying)512x70.png',
            {frameWidth: 64, frameHeight: 70}
        );

        this.load.spritesheet('swarmSprite','StarBleu/Animations/Non-Animated/B swarms64x64NEW.png',
            {frameWidth: 64, frameHeight: 64}
        )
        this.load.spritesheet('swarmMoving','StarBleu/Animations/Enemies/B swarms(flying)384x64.png',
            {frameWidth: 64, frameHeight: 44}
        )

        this.load.spritesheet('demoriSprite','StarBleu/Animations//Non-Animated/Demori128x160.png',
            {frameWidth: 64, frameHeight: 96}
        )
        // this.load.spritesheet('demoriIdle','SStarBleu/Animations/Demori/Demori(idle)(FORM1)520x89-Sheet.png',
        //     {frameWidth: 64, frameHeight: 96}
        // )

        this.load.on('complete', () => {
            console.log("Asset loading finished.");
        })
    }

    create() {
        // console.log(this.textures.exists('batMoving')); // should log true

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

        this.anims.create({
            key: 'clefPush',
            frames: this.anims.generateFrameNumbers('clefPush',
                {
                    start: 3,
                    end: 9
                }
            ),
            frameRate: 7,
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

        // Frogs Animation
        this.anims.create({
            key: 'frogMoving',
            frames: this.anims.generateFrameNumbers('frogMoving',{
                start: 1,
                end: 11
            }),
            frameRate: 6,
            repeat: -1
        })

        // Bat Animation
        this.anims.create({
            key: 'batMoving',
            frames: this.anims.generateFrameNumbers('batMoving',{
                start: 0,
                end: 7
            }),
            frameRate: 4,
            repeat: -1
        })

        // Swarm Animation
        this.anims.create({
            key: 'swarmMoving',
            frames: this.anims.generateFrameNumbers('swarmMoving',{
                start: 0,
                end: 5
            }),
            frameRate: 5,
            repeat: -1
        })

        // Snake Animation
        this.anims.create({
            key: 'snakeMoving',
            frames: this.anims.generateFrameNumbers('snakeMoving',{
                start: 0,
                end: 9
            }),
            frameRate: 7,
            repeat: -1
        })

        // Mole Animation
        this.anims.create({
            key: 'moleIdleUp',
            frames: [
                {
                    key: 'moleMovement',
                    frame: 0
                }
            ],
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: 'moleIdleDown',
            frames: [
                {
                    key: 'moleMovement',
                    frame: 2
                }
            ],
            frameRate: 20,
            repeat: -1
        })

        this.anims.create({
            key: 'moleRise',
            frames: this.anims.generateFrameNumbers('moleMovement',{
                start: 0,
                end: 1
            }).reverse(),
            frameRate: 4,
        })

        this.anims.create({
            key: 'moleSink',
            frames: this.anims.generateFrameNumbers('moleMovement',{
                start: 1,
                end: 2
            }),
            frameRate: 4,
        })

        this.anims.create({
            key: 'demoriIdleF1',
            frames: this.anims.generateFrameNumbers('demoriIdleF1',{
                start: 0,
                end: 9
            }),
            frameRate: 4,
            repeat: -1
        })

        this.anims.create({
            key: 'demoriIdleF2',
            frames: this.anims.generateFrameNumbers('demoriIdleF2',{
                start: 0,
                end: 9
            }),
            frameRate: 4,
            repeat: -1
        })

        this.anims.create({
            key: 'demoriTpF2',
            frames: this.anims.generateFrameNumbers('demoriTpF2',{
                start: 0,
                end: 5
            }),
            frameRate: 3
        })

        this.scene.start('MainMenu');
    }
}