function enemyPlayerCollision(player, enemy) {
    if (this.playerType === "Clef" && player.body.blocked.down === false) {
        console.log("enemy bjonked");
        enemy.disableBody(true,true);
    } else {
        this.lives--;
        console.log(this.lives);
        emitter.emit('lives-damage',this.lives);
        enemy.disableBody(true,true);
    }
}

function chordCollecting(player, chords, scene) {
    scene.chordsCollected++;
    emitter.emit('chord-collected',scene.chordsCollected);
    chords.disableBody(true,true);
    console.log(scene.chordsCollected);
}

function guiLoader(scene,currentScene) {
    const guiScene = scene.scene.get("GUILayout");
        if (!guiScene.sys.displayList || guiScene.children.list.length === 0) {
            scene.scene.stop("GUILayout");
            scene.scene.run("GUILayout");
            scene.time.delayedCall(10, () => {
            emitter.emit("scene-loaded", currentScene);
            });

        } else {
            scene.scene.wake("GUILayout");
            scene.scene.bringToTop("GUILayout");
            scene.time.delayedCall(10, () => {
            emitter.emit("scene-loaded", currentScene);
            });
        }
}