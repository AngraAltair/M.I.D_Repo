// Global Emitter for UI Updates
let emitter = new Phaser.Events.EventEmitter();

class GUILayout extends Phaser.Scene{
    constructor() {
        super({
            key: "GUILayout",
            active: true
        });
    }

    init() {
        this.currentActiveGameScene = null;
    }

    preload() {
        // UI Assets
        this.load.spritesheet('hpBar','StarBleuGameUi/CommonUi/hpBar(smallSize)(eachIs72x8).png',
            {frameWidth: 72, frameHeight: 8}
        );
        // UI Portraits for when Clef is Active
        this.load.image('clefBigActive','StarBleuGameUi/ClefUi/Clef(bigPortrait)(smallSize).png');
        this.load.image('clefSmallActive','StarBleuGameUi/ClefUi/Clef(smallPortrait)(smallSize).png');
        this.load.image('clefChordActive','StarBleuGameUi/ClefUi/Chord(Clef)(smallSize).png');

        // UI Portraits for when Quarter is Active
        this.load.image('quarterBigActive','StarBleuGameUi/QuarterUi/Quarter(bigPortrait)(smallSize).png');
        this.load.image('quarterSmallActive','StarBleuGameUi/QuarterUi/Clef(smallPortrait)(smallSize).png');
        this.load.image('quarterChordActive','StarBleuGameUi/QuarterUi/Chord(Quarter)(smallSize).png')

        this.load.image('pauseButton','StarBleuGameUi/CommonUi/pause32x32.png');
        this.load.image('pauseWindow','StarBleuGameUi/PauseMenuUi/pausedHolderTexted283x306.png');
        this.load.image('resumeButton','StarBleuGameUi/PauseMenuUi/resumeButton80x32.png');
        this.load.image('optionsButton','StarBleuGameUi/PauseMenuUi/optionButton80x32.png');
        this.load.image('retryButton','StarBleuGameUi/PauseMenuUi/retryButton80x39.png');
        this.load.image('mainMenuButton','StarBleuGameUi/PauseMenuUi/mainMenuButton119x39.png');
    }

    create() {
        this.scene.bringToTop("GUILayout");

        this.activePlayerPortrait = this.add.image(20,20,'clefBigActive').setOrigin(0,0);
        this.subPlayerPortrait = this.add.image(80,37,'clefSmallActive').setOrigin(0,0);
        this.chordPortrait = this.add.image(120,37,'clefChordActive').setOrigin(0,0);

        this.pauseWindow = this.add.image(325, 200, 'pauseWindow').setVisible(false);

        this.pauseButton = this.add.image(600,20,'pauseButton').setOrigin(0,0).setInteractive({
            useHandCursor: true
        });
        this.pauseButton.on('pointerdown', () => {
            this.pauseGame(this.currentActiveGameScene);
        })

        this.resumeButton = this.add.image(325,165,'resumeButton').setVisible(false).setInteractive({
            useHandCursor: true
        });
        this.resumeButton.on('pointerdown', () => {
            this.resumeGame(this.currentActiveGameScene);
        })

        this.retryButton = this.add.image(325,215,'retryButton').setVisible(false).setInteractive({
            useHandCursor: true
        });

        this.optionsButton = this.add.image(325,265,'optionsButton').setVisible(false).setInteractive({
            useHandCursor: true
        });

        this.mainMenuButton = this.add.image(325,315,'mainMenuButton').setVisible(false).setInteractive({
            useHandCursor: true
        });

        this.hpBar = this.add.sprite(80,20,'hpBar').setOrigin(0,0).setFrame(3);

        this.chordsText = this.add.text(160,45,`0`);

        emitter.on('lives-damage',this.livesDown,this);
        emitter.on('chord-collected',this.chordsUp,this);
        emitter.on('character-switched',this.changePortraits,this);
        emitter.on('scene-loaded', (sceneKey) => {
            this.currentActiveGameScene = sceneKey;
        },this);
    }

    livesDown(lives) {
        this.hpBar.setFrame(lives);
    }

    chordsUp(chordsCollected) {
        this.chordsText.setText(`${chordsCollected}`);
    }

    changePortraits(playerType) {
         if (playerType == "Clef") {
            this.activePlayerPortrait.setTexture('clefBigActive');
            this.subPlayerPortrait.setTexture('clefSmallActive');
            this.chordPortrait.setTexture('clefChordActive');
        } else if (playerType == "Quarter") {
            this.activePlayerPortrait.setTexture('quarterBigActive');
            this.subPlayerPortrait.setTexture('quarterSmallActive');
            this.chordPortrait.setTexture('quarterChordActive');
        }
        console.log(playerType);
    }

    setPauseWindow(bool) {
        this.pauseWindow.setVisible(bool);
        this.resumeButton.setVisible(bool);
        this.retryButton.setVisible(bool);
        this.optionsButton.setVisible(bool);
        this.mainMenuButton.setVisible(bool);
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
}