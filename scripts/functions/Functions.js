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

function moveEnemy(enemy, originalX, originalY, newX, newY) {
    if (enemy.body.position.x == originalX && enemy.body.position.y == originalY) {
        enemy.setX(newX);
        enemy.setY(newY);
        console.log("frog at new position");
    }
    if (enemy.body.position.x == newX && enemy.body.position.y == newY) {
        enemy.setX(originalX);
        enemy.setY(originalY);
        console.log("frog at old position");
    }
}