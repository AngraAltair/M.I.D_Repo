class Demori extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, tpPoints) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(true);
        this.body.setVelocity(0, 0);
        this.setImmovable(true);
        this.body.pushable = false;

        this.tpArray = tpPoints;
        this.x = x;
        this.y = y;
    }

    // startOnPath() {
    //     this.setPosition(this.x,this.y);
    // }
}