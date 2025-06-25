// Global Emitter for UI Updates
let emitter = new Phaser.Events.EventEmitter();

class GUILayout extends Phaser.Scene{
    constructor() {
        super({
            key: "GUILayout",
            active: true
        });
    }

    preload() {

    }

    create() {
        this.livesText = this.add.text(20,20,"Lives: 3");
        this.chordsText = this.add.text(20,40,`Chords: 0`);

        emitter.on('lives-damage',this.livesDown,this);
        emitter.on('chord-collected',this.chordsUp,this);
    }

    livesDown(lives) {
        this.livesText.setText(`Lives: ${lives}`);
    }

    chordsUp(chordsCollected) {
        this.chordsText.setText(`Chords: ${chordsCollected}`);
    }
}