class BatEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, path) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.enemyPath = path;
        this.direction = 1;
        this.ENEMY_SPEED = 1 / 3000;
        this.waitTime = 0;
        this.isWaiting = false;

        // this.body.setFrame(0);
        this.body.setAllowGravity(true);
        this.body.setVelocity(0, 0);
        this.setImmovable(true);
        this.body.pushable = false;
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

        // force resetting position
        if (this.body) {
            this.body.setVelocity(0, 0);
        }

    }

    updatePath(delta) {
        if (this.isWaiting) {
            this.waitTime -= delta;
            if (this.waitTime <= 0) this.isWaiting = false;
            return;
        }

        this.follower.t += this.direction * this.ENEMY_SPEED * delta;
        this.enemyPath.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(Math.round(this.follower.vec.x), Math.round(this.follower.vec.y));

        // force reset to prevent drift
        this.body.reset(this.x, this.y);

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
        // if (this.isWaiting) {
        //     this.anims.play('frogMoving', true);
        // }
        this.setFlipX(this.direction < 0); // face the right direction
    }
}
