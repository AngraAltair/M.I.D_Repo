class LevelSelect extends Phaser.Scene{
    constructor() {
        super("LevelSelect");
    }

    preload() {
        this.load.image('toneFields','StarBleuGameUi/selectStageMenuUi/toneFieldsButtonTexted283x80.png');
        this.load.image('octaveForest','StarBleuGameUi/selectStageMenuUi/octaveForestButtonTexted283x80.png');
        this.load.image('PnRGrotto','StarBleuGameUi/selectStageMenuUi/pitchNRhythmGrottoButtonTexted283x80.png');
        this.load.image('Mountain','StarBleuGameUi/selectStageMenuUi/mezzoMountainsButtonTexted283x80.png');
        this.load.image('AdagioRoute','StarBleuGameUi/selectStageMenuUi/adagioRouteButtonTexted283x80.png');
        this.load.image('Lab','StarBleuGameUi/selectStageMenuUi/allegroLabButtonTexted283x80.png');
        this.load.image('selectScreenTitle','StarBleuGameUi/selectStageMenuUi/selectStageHolderTexted283x80.png');
    }

    create() {
        // this.scene.sleep("GUILayout");
        console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));

        this.add.image(325, 60, "selectScreenTitle");

        this.stage1 = this.add.image(25,120,'toneFields').setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
        this.stage1.on('pointerdown', () => {
            if (!this.scene.isActive("Tutorial")) {
                this.scene.start("Tutorial");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })

        this.stage2 = this.add.image(340,120,'octaveForest').setOrigin(0,0).setInteractive({
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

        this.stage3 = this.add.image(25,210,'PnRGrotto').setOrigin(0,0).setInteractive({
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

        this.stage4 = this.add.image(340,210,'Mountain').setOrigin(0,0).setInteractive({
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

        this.stage5 = this.add.image(25,300,'AdagioRoute').setOrigin(0,0).setInteractive({
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

        this.stage6 = this.add.image(340,300,'Lab').setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
        this.stage5.on('pointerdown', () => {
            if (!this.scene.isActive("Level6")) {
                this.scene.start("Level6");
                this.scene.stop("LevelSelect");
            } else {
                console.error("Load level failed.");
            }
        })
    }

    update() {
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        console.log("gui active: ",this.scene.isActive("GUILayout"));
    }
}