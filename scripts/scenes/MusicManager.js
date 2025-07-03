class MusicManager extends Phaser.Scene {
    constructor() {
        super({ key: 'MusicManager', active: true });
    }

    preload() {
        this.load.audio('menuBG','StarBleu/background music/tryNuggetZings.mp3');
        this.load.audio('ToneFieldsBG','StarBleu/background music/tone fields.mp3');
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
