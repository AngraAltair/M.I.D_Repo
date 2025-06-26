class FrogEnemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, path) {
        super(scene, x, y, 'frogSprite', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.follower = {
            t: 0,
            vec: new Phaser.Math.Vector2()
        }
        this.enemyPath = path;
        this.direction = 1;
        this.ENEMY_SPEED = 1 / 10000;
        this.waitTime = 0;     // how long to pause
        this.isWaiting = false;
    }

    startOnPath() {
        this.follower.t = 0;
        this.enemyPath.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    update(delta) {
        // obtain t because t is progress along the path, so that when t updates, the sprite's position also updates
        if (this.isWaiting) {
            this.waitTime -= delta;
            if (this.waitTime <= 0) this.isWaiting = false;
            return;
        }

        this.follower.t += this.direction * this.ENEMY_SPEED * delta;
        this.enemyPath.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        if (this.follower.t >= 1) {
            this.follower.t = 1;
            this.direction = -1;
            this.isWaiting = true;
            this.waitTime = 1000; // pause for 1000ms (1 second)
        }
        else if (this.follower.t <= 0) {
            this.follower.t = 0;
            this.direction = 1;
            this.isWaiting = true;
            this.waitTime = 1000;
        }

    }
}