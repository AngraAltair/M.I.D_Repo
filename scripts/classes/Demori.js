class Demori extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, tpPoints, form) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setVelocity(0, 0);
        this.setImmovable(true);
        this.body.pushable = false;

        this.form = form;
        this.lives = 3;
        this.maxLives = 3;

        this.invulnerable = false;

        this.tpArray = tpPoints;
        this.maxPoints = tpPoints.length - 1
        this.setPosition(x, y);
        this.teleporting = false;

        this.isStunned = false;
        this.isAggroed = false;

        this.aggroRange = 500;

        scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.teleporting = true;
                this.teleport();
            },
            callBackScope: this,
            loop: true
        })

        scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.dropBlocks();
            },
            callBackScope: this,
            loop: true
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // console.log(this.isStunned);
        // console.log(this.teleporting);
        // console.log(this.demoriLives);
        // console.log(this.invulnerable);

        let playerX = this.scene.clefPlayer.x;
        let playerY = this.scene.clefPlayer.y;

        const dist = Phaser.Math.Distance.Between(
            playerX, playerY,
            this.x, this.y);

        if (dist <= this.aggroRange) {
            this.isAggroed = true;
        } else {
            this.isAggroed = false;
        }

        this.anims.play('demoriIdleF1',true);

        if (this.isStunned || this.isAggroed === false) {
            return;
        }

        if (this.isAggroed) {
            emitter.emit("demori-aggroed", this.form);
        }

        console.log("is aggroed: ", this.isAggroed);
    }

    teleport() {
        if (this.isStunned || this.isAggroed === false) {
            return;
        }

        let tpIndex = Phaser.Math.Between(0, this.maxPoints);
        let tpItem = this.tpArray[tpIndex];
        this.setPosition(tpItem.x, tpItem.y);
        console.log("teleported to: ", this.x, this.y, this.teleporting);
        this.teleporting = false;
    }

    dropBlocks() {
        if (this.isStunned || this.isAggroed === false) {
            return;
        }

        let playerX = this.scene.clefPlayer.x;
        let playerY = this.scene.clefPlayer.y;

        let box = this.scene.demoriProjectile.create(playerX, playerY - 500, 'crate').setFrame(8);
        box.body.setAllowGravity(true);
        console.log("drop blocked");

        this.scene.time.delayedCall(3000, () => {
            box.disableBody(true, true);
            console.log("block destroyed");
        });
    }
}