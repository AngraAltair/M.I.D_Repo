const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 400},
            debug: true
        }
    },
    pixelArt: true,
    scene: [LoadingScreen,GUILayout,Level1]
};

const game = new Phaser.Game(config);