// Global Emitter for UI Updates
let emitter = new Phaser.Events.EventEmitter();

class GUILayout extends Phaser.Scene {
    constructor() {
        super({
            key: "GUILayout",
            active: true
        });
    }

    init() {
        this.currentActiveGameScene = null;
        this.isVolumeOn = true;
        this.currentlyActiveDemoriBar = null;

    }

    preload() {
        // UI Assets
        this.load.spritesheet('hpBar', 'StarBleuGameUi/CommonUi/hpBar(bigSize)(eachIs144x16).png',
            { frameWidth: 144, frameHeight: 16 }
        );
        // UI Portraits for when Clef is Active
        this.load.image('clefBigActive', 'StarBleuGameUi/ClefUi/Clef(bigPortrait)(bigSize).png');
        this.load.image('clefSmallActive', 'StarBleuGameUi/ClefUi/Clef(smallPortrait)(bigSize).png');
        this.load.image('clefChordActive', 'StarBleuGameUi/ClefUi/Chord(Clef)(bigSize).png');
        this.load.image('clefHpActive', 'StarBleuGameUi/ClefUi/HPBarBox(Clef)(bigSize).png')

        // UI Portraits for when Quarter is Active
        this.load.image('quarterBigActive', 'StarBleuGameUi/QuarterUi/Quarter(bigPortrait)(bigSize).png');
        this.load.image('quarterSmallActive', 'StarBleuGameUi/QuarterUi/Clef(smallPortrait)(bigSize).png');
        this.load.image('quarterChordActive', 'StarBleuGameUi/QuarterUi/Chord(Quarter)(bigSize).png');
        this.load.image('quarterHpActive', 'StarBleuGameUi/QuarterUi/HPBarBox(Quarter)(bigSize).png');

        // Demori HP Bar
        this.load.spritesheet('demoriHp5Bar', 'StarBleuGameUi/DemoriUi/5bar/Demori5HPBar(eachIs160x32).png',
            { frameWidth: 160, frameHeight: 32 }
        );
        this.load.spritesheet('demoriHp3Bar', 'StarBleuGameUi/DemoriUi/Demori3HPBar(eachIs160x32).png',
            { frameWidth: 160, frameHeight: 32 }
        )

        // Pause Window UI
        this.load.image('pauseButton', 'StarBleuGameUi/CommonUi/pause32x32.png');
        this.load.image('pauseWindow', 'StarBleuGameUi/PauseMenuUi/pausedHolderTexted283x306.png');
        this.load.image('resumeButton', 'StarBleuGameUi/PauseMenuUi/resumeButton80x32.png');
        this.load.image('optionsButton', 'StarBleuGameUi/PauseMenuUi/optionButton80x32.png');
        this.load.image('retryButton', 'StarBleuGameUi/PauseMenuUi/retryButton80x39.png');
        this.load.image('mainMenuButton', 'StarBleuGameUi/PauseMenuUi/mainMenuButton119x39.png');

        // Game Over Window
        this.load.image('gOWindow', 'StarBleuGameUi/GameOverUi/gameOverHolderTexted285x303.png');
        this.load.image('gORetryButton', 'StarBleuGameUi/GameOverUi/gameOverRetryButton80x39.png');
        this.load.image('gOMainMenuButton', 'StarBleuGameUi/GameOverUi/gameOverMainMenuButton118x39.png');

        // Congrats Window
        this.load.image('congratsWindow', 'StarBleuGameUi/CongratulationsUi/CongratulationsHolderTexted283x306.png');
        this.load.image('congratsMenuButton', 'StarBleuGameUi/CongratulationsUi/CongratulationsMainMenuButton106x15.png');
    }

    create() {
        this.buttonSfx = this.sound.add('buttonSfx');
        this.scene.bringToTop("GUILayout");
        console.log("[GUILayout] create triggered");

        emitter.on('scene-loaded', (sceneKey) => {
            this.currentActiveGameScene = sceneKey;
            // if (this.currentActiveGameScene === "Level6") {
            //     this.demori5Hp.setVisible(true);
            // }
        }, this);

        this.activePlayerPortrait = this.add.image(20, 20, 'clefBigActive').setOrigin(0, 0);
        this.subPlayerPortrait = this.add.image(120, 53, 'clefSmallActive').setOrigin(0, 0);
        this.chordPortrait = this.add.image(190, 53, 'clefChordActive').setOrigin(0, 0);

        this.hpBarBorder = this.add.sprite(120, 20, 'clefHpActive').setOrigin(0, 0);
        this.hpBar = this.add.sprite(128, 28, 'hpBar').setOrigin(0, 0).setFrame(3);

        this.demori5Hp = this.add.sprite(360, 20, 'demoriHp5Bar').setOrigin(0, 0).setFrame(5).setVisible(false);
        this.demori3Hp = this.add.sprite(360, 20, 'demoriHp3Bar').setOrigin(0, 0).setFrame(5).setVisible(false);

        this.chordsText = this.add.text(220, 120, `0`);
        this.add.text(128, 120, "[ 2 ]");

        // Pause Window UI
        this.pauseWindow = this.add.image(325, 200, 'pauseWindow').setVisible(false);

        this.pauseButton = this.add.image(600, 20, 'pauseButton').setOrigin(0, 0).setInteractive({
            useHandCursor: true
        });
        this.pauseButton.on('pointerdown', () => {
            this.buttonSfx.play();
            this.pauseGame(this.currentActiveGameScene);
        })

        this.resumeButton = this.add.image(325, 165, 'resumeButton').setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.resumeButton.on('pointerdown', () => {
            this.buttonSfx.play();
            this.resumeGame(this.currentActiveGameScene);
        })

        this.retryButton = this.add.image(325, 215, 'retryButton').setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.retryButton.on('pointerdown', () => {
            this.buttonSfx.play();
            // this.scene.restart(this.currentActiveGameScene);
            this.scene.stop(this.currentActiveGameScene);
            this.scene.start(this.currentActiveGameScene);
        })

        this.optionsButton = this.add.image(325, 265, 'optionsButton').setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.optionsButton.on('pointerdown', () => {
            this.buttonSfx.play();
            this.setPauseWindow(false);
            this.setOptionsWindow(true);
        })

        this.mainMenuButton = this.add.image(325, 315, 'mainMenuButton').setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.mainMenuButton.on('pointerdown', () => {
            this.buttonSfx.play();
            this.scene.stop(this.currentActiveGameScene);
            this.scene.start("MainMenu");
        })

        // Options Window
        this.optionsWindow = this.add.image(325, 200, "optionsWindow").setVisible(false);
        this.optionsExitButton = this.add.image(420, 105, "optionsWindowExit").setOrigin(0, 0).setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.optionsExitButton.on('pointerdown', () => {
            this.buttonSfx.play();
            this.setOptionsWindow(false);
            this.setPauseWindow(true);
        });
        this.optionsVolumeButton = this.add.sprite(320, 222, 'optionsVolumeButton', 0).setOrigin(0, 0).setVisible(false).setInteractive({
            useHandCursor: true
        });

        this.optionsVolumeButton.on('pointerdown', () => {
            this.isVolumeOn = !this.isVolumeOn;

            if (this.isVolumeOn) {
                this.sound.setVolume(1);
                this.buttonSfx.play();
                this.optionsVolumeButton.setFrame(0);
            } else {
                this.sound.setVolume(0);
                this.optionsVolumeButton.setFrame(1);
            }
        });

        this.gameOverWindow = this.add.image(325, 200, "gOWindow").setVisible(false);
        this.gameOverRetry = this.add.image(325, 200, "gORetryButton").setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.gameOverRetry.on('pointerdown', () => {
            this.scene.stop(this.currentActiveGameScene);
            this.scene.start(this.currentActiveGameScene);
        })
        this.gameOverMainMenu = this.add.image(325, 260, "gOMainMenuButton").setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.gameOverMainMenu.on('pointerdown', () => {
            this.buttonSfx.play();
            this.scene.stop(this.currentActiveGameScene);
            this.scene.start("MainMenu");
        })

        this.congratsWindow = this.add.image(325, 200, "congratsWindow").setVisible(false);
        this.congratsMenuButton = this.add.image(325, 200, "congratsMenuButton").setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.congratsMenuButton.on('pointerdown', () => {
            this.buttonSfx.play();
            this.scene.stop(this.currentActiveGameScene);
            this.scene.start("MainMenu")
        })

        emitter.on('lives-damage', this.livesDown, this);
        emitter.on('demori-damage', this.demoriDamage, this);
        emitter.on('chord-collected', this.chordsUp, this);
        emitter.on('character-switched', this.changePortraits, this);
        emitter.on('scene-switch', () => {
            this.scene.restart();
        })
        emitter.on('game-over', () => {
            this.setPauseWindow(false);
            this.setOptionsWindow(false);
            this.scene.pause(this.currentActiveGameScene);
            this.openGameOverWindow();
        })
        emitter.on('demori-defeat', () => {
            this.scene.pause(this.currentActiveGameScene);
            this.openCongratsWindow();
        })
        emitter.on('demori-aggroed', this.demoriToggleHPBar, this);
    }

    update() {
        // console.log("gui asleep: ",this.scene.isSleeping("GUILayout"));
        // console.log("gui active: ",this.scene.isActive("GUILayout"));
        // console.log("active scene: ",this.currentActiveGameScene);
    }

    livesDown(lives) {
        if (lives >= 0 && lives <= 3) {
            this.hpBar.setFrame(lives);
        }
    }

    chordsUp(chordsCollected) {
        this.chordsText.setText(`${chordsCollected}`);
    }

    changePortraits(playerType) {
        if (playerType == "Clef") {
            this.activePlayerPortrait.setTexture('clefBigActive');
            this.subPlayerPortrait.setTexture('clefSmallActive');
            this.chordPortrait.setTexture('clefChordActive');
            this.hpBarBorder.setTexture('clefHpActive');
        } else if (playerType == "Quarter") {
            this.activePlayerPortrait.setTexture('quarterBigActive');
            this.subPlayerPortrait.setTexture('quarterSmallActive');
            this.chordPortrait.setTexture('quarterChordActive');
            this.hpBarBorder.setTexture('quarterHpActive');
        }
        console.log(playerType);
    }

    demoriToggleHPBar(form) {
        switch (form) {
            case 1:
                this.currentlyActiveDemoriBar = this.demori3Hp;
                this.demori3Hp.setVisible(true);
                break;
            case 2:
                this.currentlyActiveDemoriBar = this.demori5Hp;
                this.demori5Hp.setVisible(true);
                break;
        }
    }

    demoriDamage(lives) {
        if (this.currentlyActiveDemoriBar === this.demori3Hp) {
            if (lives >= 0 && lives <= 3) {
                this.currentlyActiveDemoriBar.setFrame(lives);

            }
        } else if (this.currentlyActiveDemoriBar === this.demori5Hp) {
            if (lives >= 0 && lives <= 5) {
                this.currentlyActiveDemoriBar.setFrame(lives);

            }
        }
    }

    setPauseWindow(bool) {
        this.pauseWindow.setVisible(bool);
        this.resumeButton.setVisible(bool);
        this.retryButton.setVisible(bool);
        this.optionsButton.setVisible(bool);
        this.mainMenuButton.setVisible(bool);
    }

    setOptionsWindow(bool) {
        this.optionsWindow.setVisible(bool);
        this.optionsExitButton.setVisible(bool);
        this.optionsVolumeButton.setVisible(bool);
    }

    openGameOverWindow() {
        this.gameOverWindow.setVisible(true);
        this.gameOverRetry.setVisible(true);
        this.gameOverMainMenu.setVisible(true);
    }

    pauseGame(sceneKey) {
        if (this.scene.isActive(sceneKey) == true) {
            this.scene.pause(sceneKey);
            this.setPauseWindow(true);
            this.pauseButton.setVisible(false);
            console.log("paused");
        }
    }

    resumeGame(sceneKey) {
        if (this.scene.isActive(sceneKey) == false) {
            this.scene.resume(sceneKey);
            this.setPauseWindow(false);
            this.pauseButton.setVisible(true);
            console.log("played");
        }
    }

    openCongratsWindow() {
        this.congratsWindow.setVisible(true);
        this.congratsMenuButton.setVisible(true);
    }
}