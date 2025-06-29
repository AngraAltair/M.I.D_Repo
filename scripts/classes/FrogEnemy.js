class FrogEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, path) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(false); // optional
        this.body.setAllowGravity(true); // so it floats along the path

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.enemyPath = path;
        this.direction = 1;
        this.ENEMY_SPEED = 1 / 3000;
        this.waitTime = 0;
        this.isWaiting = false;
    }

    startOnPath() {
        this.follower.t = 0;
        this.enemyPath.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(Math.round(this.follower.vec.x), Math.round(this.follower.vec.y));
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta); // important for animation/timing
        this.updatePath(delta);
        this.updateAnimation();
    }

    updatePath(delta) {
        if (this.isWaiting) {
            this.waitTime -= delta;
            if (this.waitTime <= 0) this.isWaiting = false;
            return;
        }

        this.follower.t += this.direction * this.ENEMY_SPEED * delta;
        this.enemyPath.getPoint(this.follower.t, this.follower.vec);
        this.setX(Math.round(this.follower.vec.x));

        if (this.follower.t >= 1) {
            this.follower.t = 1;
            this.direction = -1;
            this.isWaiting = true;
            this.waitTime = 1000;
        } else if (this.follower.t <= 0) {
            this.follower.t = 0;
            this.direction = 1;
            this.isWaiting = true;
            this.waitTime = 1000;
        }
    }

    updateAnimation() {
    // this.anims.play('frogJumpingUp', true); // just use a walk/hop animation
    // this.on('animationcomplete', () => {
    //     this.anims.play('frogInAir',true);
    // })
    if (this.isWaiting) {
        this.anims.play('frogMoving',true);
    }
    // } else {
    //     this.anims.play('frogInAir',true);
    // }
    this.setFlipX(this.direction < 0); // face the right direction
}
}
