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
    scene: [LoadingScreen,GUILayout,Level1]
};

const game = new Phaser.Game(config);