class MoleEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hostile = false;
        this.stayUp = false;

        this.body.setAllowGravity(false);
        this.body.setVelocity(0, 0);
        this.setImmovable(true);
        this.body.pushable = false;

        // Listen to animation complete events
        this.on('animationcomplete', this.onAnimationComplete, this);

        // Toggle hostile state every second
        scene.time.addEvent({
            delay: 2300,
            callback: () => {
                this.hostile = !this.hostile;

                if (this.hostile) {
                    this.stayUp = true;
                    this.anims.play('moleRise'); // play once
                } else {
                    this.stayUp = false;
                    this.anims.play('moleSink'); // play once
                }
            },
            callbackScope: this,
            loop: true,
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.updatePath(delta);

        if (this.body) {
            this.body.setVelocity(0, 0);
        }
    }

    updatePath(delta) {
        this.body.reset(this.x, this.y);
    }

    onAnimationComplete(animation, frame) {
        if (animation.key === 'moleRise') {
            this.anims.play('moleIdleUp', true); // looping idle while up
        } else if (animation.key === 'moleSink') {
            this.anims.play('moleIdleDown', true); // idle while hidden
        }
    }
}
