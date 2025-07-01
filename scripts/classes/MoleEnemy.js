class MoleEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        // this.enemyPath = path;
        // this.direction = 1;
        // this.ENEMY_SPEED = 1 / 3000;
        // this.waitTime = 0;
        // this.isWaiting = false;
        this.hostile = false;

        this.body.setAllowGravity(false);
        this.body.setVelocity(0, 0);
        this.setImmovable(true);
        this.body.pushable = false;

        // this.currentAnimKey = 'moleDown';

        // scene.time.addEvent({
        //     delay: 1000, // change every 1000ms = 1s
        //     callback: () => {
        //         this.hostile = !this.hostile;
        //     },
        //     callbackScope: this,
        //     loop: true,
        // });

        console.log(scene.anims); // Check if your animation keys are listed
        console.log(scene.anims.get('moleRise')); // should return an animation object

        scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.hostile = !this.hostile;
                // Trigger rise or sink animation on state change
                // if (this.hostile) {
                //     this.anims.play('moleRise',true);
                // } else {
                //     this.anims.play('moleSink',true);
                // }
            },
            callbackScope: this,
            loop: true,
        });

        // One-time listener for animation complete
        // this.on('animationcomplete', (animation) => {
        //     if (animation.key === 'moleRise') {
        //         thsceneis.anims.play('moleIdleUp',true);
        //     } else if (animation.key === 'moleSink') {
        //         scene.anims.play('moleIdleDown',true);
        //     }
        // }, this);
    }

    preUpdate(time, delta) {
        console.log(this.hostile);
        super.preUpdate(time, delta); // important for animation/timing
        this.updatePath(delta);
        this.updateAnimation();

        // force resetting position
        if (this.body) {
            this.body.setVelocity(0, 0);
        }

    }

    updatePath(delta) {
        // if (this.isWaiting) {
        //     this.waitTime -= delta;
        //     if (this.waitTime <= 0) this.isWaiting = false;
        //     return;
        // }

        // this.follower.t += this.direction * this.ENEMY_SPEED * delta;
        // this.enemyPath.getPoint(this.follower.t, this.follower.vec);
        // this.setX(Math.round(this.follower.vec.x));

        // force reset to prevent drift
        this.body.reset(this.x, this.y);



        // if (this.follower.t >= 1) {
        //     this.follower.t = 1;
        //     this.direction = -1;
        //     this.isWaiting = true;
        //     this.waitTime = 1000;
        // } else if (this.follower.t <= 0) {
        //     this.follower.t = 0;
        //     this.direction = 1;
        //     this.isWaiting = true;
        //     this.waitTime = 1000;
        // }
    }

    updateAnimation() {
        // if (this.isWaiting) {
        //     this.anims.play('frogMoving', true);
        // }
        // if (this.hostile) {
        //     this.anims.play('moleIdleUp');
        //     // this.anims.on('complete',() => {
        //     //     // this.anims.play('moleIdleUp');
        //     //     console.log("animation played");
        //     // })
        // }
        // if (this.hostile == true) {
        //     this.anims.play('moleRise');
        //     this.on('animationcomplete',() => {
        //         this.anims.play('moleIdleUp');
        //         console.log('up played');
        //     },this)
        // } else {
        //     this.anims.play('moleSink');
        //     this.on('animationcomplete',() => {
        //         this.anims.play('moleIdleDown');
        //         console.log('down played');
        //     },this)
        // }
        // this.setFlipX(this.direction < 0); // face the right direction
    }
}
