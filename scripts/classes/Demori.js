class Demori extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, tpPoints) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setVelocity(0, 0);
        this.setImmovable(true);
        this.body.pushable = false;

        this.demoriLives = 5;

        this.tpArray = tpPoints;
        this.maxPoints = tpPoints.length - 1
        this.setPosition(x, y);

        scene.time.addEvent({
            delay: 2300,
            callback: () => {
                this.teleport();
                console.log("teleported to: ",this.x,this.y);
            },
            callBackScope: this,
            loop: true
        })
    }

    preUpdate(time,delta) {
        super.preUpdate(time,delta);
        this.anims.play('demoriIdleF2',true);
    }

    teleport() {
        let tpIndex = Phaser.Math.Between(0,this.maxPoints);
        let tpItem = this.tpArray[tpIndex];
        this.setPosition(tpItem.x,tpItem.y);
    }
}