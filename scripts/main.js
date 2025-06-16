const config = {
    type: Phaser.AUTO,
    width: 650,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 400},
            debug: true
        }
    },
    // scale: {
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    scene: [LoadingScreen,Level1]
};

const game = new Phaser.Game(config);