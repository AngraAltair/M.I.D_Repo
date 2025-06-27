class LevelSelect extends Phaser.Scene{
    constructor() {
        super("LevelSelect");
    }

    preload() {
        this.load.image('toneFields','StarBleuGameUi/selectStageMenuUi/toneFieldsButtonTexted283x80.png');
    }

    create() {
        this.stage1 = this.add.image(20,20,'toneFields').setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
        this.stage1.on('pointerdown', () => {
            this.scene.start("Tutorial");
        })
    }
}