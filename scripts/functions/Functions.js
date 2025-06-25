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

function chordCollecting(player, chords) {
    this.chordsCollected++;
    emitter.emit('chord-collected',this.chordsCollected);
    chords.disableBody(true,true);
}