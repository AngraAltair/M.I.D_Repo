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