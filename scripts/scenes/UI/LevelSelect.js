class LevelSelect extends Phaser.Scene{
    constructor() {
        super("LevelSelect");
    }

    preload() {
        this.load.image('toneFields','StarBleuGameUi/selectStageMenuUi/toneFieldsButtonTexted283x80.png');
        this.load.image('selectScreenTitle','StarBleuGameUi/selectStageMenuUi/selectStageHolderTexted283x80.png');
    }

    create() {
        // this.scene.sleep("GUILayout");
        console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));

        this.add.image(325, 60, "selectScreenTitle");

        this.stage1 = this.add.image(20,120,'toneFields').setOrigin(0,0).setInteractive({
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
    }

    update() {
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        console.log("gui active: ",this.scene.isActive("GUILayout"));
    }
}