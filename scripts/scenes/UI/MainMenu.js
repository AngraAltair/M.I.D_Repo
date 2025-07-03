class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image('logo','StarBleuGameUi/MainMenuUi/StarBleuLogo245x158.png');
        this.load.image('startButton','StarBleuGameUi/MainMenuUi/StartButton96x48.png');
        this.load.image('creditsButton','StarBleuGameUi/MainMenuUi/creditsButton80x39.png');
        this.load.image('settingsButton','StarBleuGameUi/MainMenuUi/settingsButton32x32.png');
        this.load.image('powerButton','StarBleuGameUi/MainMenuUi/powerButton32x32.png');
    }

    create() {
        this.scene.get('MusicManager').events.emit('playMusic', 'menuBG');
        // emitter.emit('scene-loaded',"MainMenu");
        this.scene.sleep("GUILayout");
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        // console.log("gui active: ",this.scene.isActive("GUILayout"));

        let logo = this.add.image(325,125,'logo');
        logo.setScale(1.2);

        this.startButton = this.add.image(325,250,'startButton').setInteractive({
            useHandCursor: true
        });
        this.startButton.on('pointerdown', () => {
            this.scene.start("LevelSelect");
            this.scene.stop("MainMenu");
        })

        this.creditsButton = this.add.image(325, 310, "creditsButton").setInteractive({
            useHandCursor: true
        });

        this.settingsButton = this.add.image(600,20,"settingsButton").setOrigin(0,0).setInteractive({
            useHandCursor: true
        });

        this.powerButton = this.add.image(560, 20, "powerButton").setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
    }

    update() {
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        // console.log("gui active: ",this.scene.isActive("GUILayout"));
    }
}