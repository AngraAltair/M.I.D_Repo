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
        this.load.spritesheet('hpBar','StarBleuGameUi/CommonUi/hpBar(bigSize)(eachIs144x16).png',
            {frameWidth: 144, frameHeight: 16}
        );
        // UI Portraits for when Clef is Active
        this.load.image('clefBigActive','StarBleuGameUi/ClefUi/Clef(bigPortrait)(bigSize).png');
        this.load.image('clefSmallActive','StarBleuGameUi/ClefUi/Clef(smallPortrait)(bigSize).png');
        this.load.image('clefChordActive','StarBleuGameUi/ClefUi/Chord(Clef)(bigSize).png');
        this.load.image('clefHpActive','StarBleuGameUi/ClefUi/HPBarBox(Clef)(bigSize).png')

        // UI Portraits for when Quarter is Active
        this.load.image('quarterBigActive','StarBleuGameUi/QuarterUi/Quarter(bigPortrait)(bigSize).png');
        this.load.image('quarterSmallActive','StarBleuGameUi/QuarterUi/Clef(smallPortrait)(bigSize).png');
        this.load.image('quarterChordActive','StarBleuGameUi/QuarterUi/Chord(Quarter)(bigSize).png');
        this.load.image('quarterHpActive','StarBleuGameUi/QuarterUi/HPBarBox(Quarter)(bigSize).png');

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
        this.subPlayerPortrait = this.add.image(120,53,'clefSmallActive').setOrigin(0,0);
        this.chordPortrait = this.add.image(190,53,'clefChordActive').setOrigin(0,0);
        
        this.hpBarBorder = this.add.sprite(120,20,'clefHpActive').setOrigin(0,0);
        this.hpBar = this.add.sprite(128,28,'hpBar').setOrigin(0,0).setFrame(3);
        
        this.chordsText = this.add.text(220,120,`0`);
        this.add.text(128,120,"[ 2 ]");

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

        emitter.on('lives-damage',this.livesDown,this);
        emitter.on('chord-collected',this.chordsUp,this);
        emitter.on('character-switched',this.changePortraits,this);
        emitter.on('scene-loaded', (sceneKey) => {
            this.currentActiveGameScene = sceneKey;
        },this);
        emitter.on('scene-switch', () => {
            this.scene.restart();
        })
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
            this.hpBarBorder.setTexture('clefHpActive');
        } else if (playerType == "Quarter") {
            this.activePlayerPortrait.setTexture('quarterBigActive');
            this.subPlayerPortrait.setTexture('quarterSmallActive');
            this.chordPortrait.setTexture('quarterChordActive');
            this.hpBarBorder.setTexture('quarterHpActive');
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