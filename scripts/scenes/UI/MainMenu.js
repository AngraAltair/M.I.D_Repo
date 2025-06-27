class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image('logo','StarBleuGameUi/MainMenuUi/StarBleuLogo245x158.png');
        this.load.image('startButton','StarBleuGameUi/MainMenuUi/StartButton96x48.png');
        this.load.image('creditsButton','StarBleuGameUi/MainMenuUi/creditsButton80x39.png');
        this.load.image('settingsButton','StarBleuGameUi/MainMenuUi/settingsButton32x32.png');
        this.load.image('optionsButton','StarBleuGameUi/MainMenuUi/optionsButton80x39.png');
        // this.load.on('complete', () => {
        //     console.log("main menu loaded");
        // })
    }

    create() {
        // emitter.emit('scene-loaded',"MainMenu");
        this.scene.sleep("GUILayout");

        this.add.image(325,100,'logo');

        this.startButton = this.add.image(325,250,'startButton').setInteractive({
            useHandCursor: true
        });
        this.startButton.on('pointerdown', () => {
            this.scene.start("LevelSelect");
        })

        // this.optionsButton = this.add.image(325,330,'optionsButton').setInteractive({
        //     useHandCursor: true
        // })
    }
}