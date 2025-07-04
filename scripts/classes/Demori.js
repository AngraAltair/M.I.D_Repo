class Demori extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, tpPoints) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tpArray = tpPoints;
    }
}