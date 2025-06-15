const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 300,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: true
        }
    },
    scene: [LoadingScreen,Level1]
};

const game = new Phaser.Game(config);