class LevelSelect extends Phaser.Scene{
    constructor() {
        super("LevelSelect");
    }

    preload() {
        this.load.image('tutorial','StarBleuGameUi/selectStageMenuUi/tutorialButtonTexted283x80.png');
        this.load.image('toneFields','StarBleuGameUi/selectStageMenuUi/toneFieldsButtonTexted283x80.png');
        this.load.image('octaveForest','StarBleuGameUi/selectStageMenuUi/octaveForestButtonTexted283x80.png');
        this.load.image('PnRGrotto','StarBleuGameUi/selectStageMenuUi/pitchNRhythmGrottoButtonTexted283x80.png');
        this.load.image('Mountain','StarBleuGameUi/selectStageMenuUi/mezzoMountainsButtonTexted283x80.png');
        this.load.image('AdagioRoute','StarBleuGameUi/selectStageMenuUi/adagioRouteButtonTexted283x80.png');
        this.load.image('Lab','StarBleuGameUi/selectStageMenuUi/allegroLabButtonTexted283x80.png');
        this.load.image('selectScreenTitle','StarBleuGameUi/selectStageMenuUi/selectStageHolderTexted283x80.png');
        this.load.image('background', 'BACKGROUNDS700X500/backgroundPurple700x500.png');
        this.load.image('leftButton', 'StarBleuGameUi/selectStageMenuUi/leftButton32x32.png');
        this.load.image('rightButton', 'StarBleuGameUi/selectStageMenuUi/rightButton32x32.png');
        this.load.image('backButton', 'StarBleuGameUi/selectStageMenuUi/backButton32x32.png');
    }

    create() {
        const savedScroll = this.registry.get('bgScrollX') || 0;

        this.bg = this.add.tileSprite(0, -50, 700, 500, 'background').setOrigin(0, 0);
        this.bg.tilePositionX = savedScroll;
        // this.scene.sleep("GUILayout");
        console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));

        this.add.image(325, 60, "selectScreenTitle");

        this.rightButton = this.add.image(485,25,"rightButton").setOrigin(0,0).setScale(2).setVisible(true).setInteractive({
            useHandCursor: true
        });
        this.rightButton.on('pointerdown', () => {
            this.setTutorialLevel(false);
            this.setMainLevels(true);
        });

        this.leftButton = this.add.image(100,25,"leftButton").setOrigin(0,0).setScale(2).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.leftButton.on('pointerdown', () => {
            this.setMainLevels(false);
            this.setTutorialLevel(true);
        });

        this.tutorial = this.add.image(180, 180, 'tutorial').setOrigin(0,0).setVisible(true).setInteractive({
            useHandCursor: true
        });
        this.tutorial.on('pointerdown', () => {
            if (!this.scene.isActive("Tutorial")) {
                this.scene.start("Tutorial");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })


        this.stage1 = this.add.image(25,120,'toneFields').setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.stage1.on('pointerdown', () => {
            if (!this.scene.isActive("Level1")) {
                this.scene.start("Level1");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })

        this.stage2 = this.add.image(340,120,'octaveForest').setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.stage2.on('pointerdown', () => {
            if (!this.scene.isActive("Level2")) {
                this.scene.start("Level2");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })

        this.stage3 = this.add.image(25,210,'PnRGrotto').setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.stage3.on('pointerdown', () => {
            if (!this.scene.isActive("Level3")) {
                this.scene.start("Level3");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })

        this.stage4 = this.add.image(340,210,'Mountain').setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.stage4.on('pointerdown', () => {
            if (!this.scene.isActive("Level4")) {
                this.scene.start("Level4");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })

        this.stage5 = this.add.image(25,300,'AdagioRoute').setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.stage5.on('pointerdown', () => {
            if (!this.scene.isActive("Level5")) {
                this.scene.start("Level5");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })

        this.stage6 = this.add.image(340,300,'Lab').setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.stage6.on('pointerdown', () => {
            if (!this.scene.isActive("Level6")) {
                this.scene.start("Level6");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })
    }

    update() {
        this.bg.tilePositionX -= 1;
        this.registry.set('bgScrollX', this.bg.tilePositionX);
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        console.log("gui active: ",this.scene.isActive("GUILayout"));
    }

    setMainLevels(bool) {
        this.tutorial.setVisible(false);
        this.stage1.setVisible(bool);
        this.stage2.setVisible(bool);
        this.stage3.setVisible(bool);
        this.stage4.setVisible(bool);
        this.stage5.setVisible(bool);
        this.stage6.setVisible(bool);
        this.rightButton.setVisible(false);
        this.leftButton.setVisible(bool);
    }

    setTutorialLevel(bool) {
        this.tutorial.setVisible(bool);
        this.stage1.setVisible(false);
        this.stage2.setVisible(false);
        this.stage3.setVisible(false);
        this.stage4.setVisible(false);
        this.stage5.setVisible(false);
        this.stage6.setVisible(false);
        this.rightButton.setVisible(bool);
        this.leftButton.setVisible(false);
    }
}