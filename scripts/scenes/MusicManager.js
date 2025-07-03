class MusicManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MusicManager', active: true });
    }

    preload() {
        this.load.audio('menuBG','StarBleu/background music/tryNuggetZings.mp3');
        this.load.audio('ToneFieldsBG','StarBleu/background music/tone fields.mp3');
        this.load.audio('ForestBG','StarBleu/background music/FOREST.mp3');
        this.load.audio('GrottoBG','StarBleu/background music/GROTTO.mp3');
        this.load.audio('MountainBG','StarBleu/background music/mountain(full version).mp3');
        this.load.audio('RouteBG','StarBleu/background music/PATH.mp3');
        this.load.audio('LabBG','StarBleu/background music/LAB.mp3');
        this.load.audio('FirstBoss','StarBleu/background music/rioDeNero.mp3');
        this.load.audio('FinalBoss','StarBleu/background music/DARAX s.mp3');
    }

    create() {
        this.currentMusic = null;

        this.events.on('playMusic', (key) => {
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
            this.currentMusic = this.sound.add(key, { loop: true, volume: 1 });
            this.currentMusic.play();
        });

        this.events.on('stopMusic', () => {
            if (this.currentMusic) {
                this.currentMusic.stop();
                this.currentMusic = null;
            }
        });

        this.events.on('setVolume', (vol) => {
            if (this.currentMusic) {
                this.currentMusic.setVolume(vol);
            }
        });
    }
}
