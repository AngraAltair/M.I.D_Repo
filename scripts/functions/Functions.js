function livesDamage(player, enemy) {
    this.lives--;
    console.log(this.lives);
    emitter.emit('lives-damage',this.lives);
    enemy.disableBody(true,true);
}