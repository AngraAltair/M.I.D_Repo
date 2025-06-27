const config = {
    type: Phaser.AUTO,
    width: 650,
    height: 400,
    // width: window.outerWidth,
    // height: window.outerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 400},
            debug: true
        }  
    },
    pixelArt: true,
    scene: [LoadingScreen,GUILayout,Tutorial,Level1,Level2,Level3,Level4]
};

const game = new Phaser.Game(config);