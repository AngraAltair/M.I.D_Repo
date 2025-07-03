class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image('logo','StarBleuGameUi/MainMenuUi/StarBleuLogo245x158.png');
        this.load.image('startButton','StarBleuGameUi/MainMenuUi/StartButton96x48.png');
        this.load.image('creditsButton','StarBleuGameUi/MainMenuUi/creditsButton80x39.png');
        this.load.image('creditsWindow','StarBleuGameUi/creditsText283x306.png');
        this.load.image('settingsButton','StarBleuGameUi/MainMenuUi/settingsButton32x32.png');
        this.load.image('powerButton','StarBleuGameUi/MainMenuUi/powerButton32x32.png');
        this.load.image('background', 'BACKGROUNDS700X500/backgroundPurple700x500.png');
    }

    create() {
        this.scene.get('MusicManager').events.emit('playMusic', 'menuBG');
        // emitter.emit('scene-loaded',"MainMenu");
        this.scene.sleep("GUILayout");
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        // console.log("gui active: ",this.scene.isActive("GUILayout"));

        let bg = this.add.image(325,160,'background');
        bg.setScale(1);

        this.bg = this.add.tileSprite(0, -50, 700, 500, 'background').setOrigin(0, 0);

        let logo = this.add.image(325,130,'logo');
        logo.setScale(1.2);

        this.startButton = this.add.image(325,260,'startButton').setInteractive({
            useHandCursor: true
        });
        this.startButton.on('pointerdown', () => {
            this.scene.start("LevelSelect");
            this.scene.stop("MainMenu");
        })

        //Credits
        this.creditsButton = this.add.image(325, 320, "creditsButton").setInteractive({
            useHandCursor: true
        });
        this.creditsButton.on('pointerdown', () => {
            this.setCreditsWindow(true);
        });

        this.creditsWindow = this.add.image(325, 200, "creditsWindow").setVisible(false);

        this.creditsExitButton = this.add.image(440, 40, "optionsWindowExit").setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.creditsExitButton.on('pointerdown', () => {
            this.setCreditsWindow(false);
        });

        //Settings
        this.settingsButton = this.add.image(600,20,"settingsButton").setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
        this.settingsButton.on('pointerdown', () => {
            this.setOptionsWindow(true);
        });

        this.optionsWindow = this.add.image(325, 200, "optionsWindow").setVisible(false);
        this.optionsExitButton = this.add.image(420, 105, "optionsWindowExit").setOrigin(0,0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.optionsExitButton.on('pointerdown', () => {
            this.setOptionsWindow(false);
        });
        this.optionsVolumeButton = this.add.sprite(320, 222, 'optionsVolumeButton', 0).setOrigin(0, 0).setVisible(false).setInteractive({ 
            useHandCursor: true 
        });
        this.optionsVolumeButton.on('pointerdown', () => {
        this.isVolumeOn = !this.isVolumeOn;

        if (this.isVolumeOn) {
        this.sound.setVolume(1); 
        this.optionsVolumeButton.setFrame(0); 
        } else {
        this.sound.setVolume(0);
        this.optionsVolumeButton.setFrame(1); 
        }
        });

        this.powerButton = this.add.image(560, 20, "powerButton").setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
    }

    update() {
        this.bg.tilePositionX -= 1;
        this.registry.set('bgScrollX', this.bg.tilePositionX);
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        // console.log("gui active: ",this.scene.isActive("GUILayout"));
    }

    setCreditsWindow(bool) {
        this.creditsWindow.setVisible(bool);
        this.creditsExitButton.setVisible(bool);
    }

    setOptionsWindow(bool) {
        this.optionsWindow.setVisible(bool);
        this.optionsExitButton.setVisible(bool);
        this.optionsVolumeButton.setVisible(bool);
    }
}