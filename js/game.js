var game = new Phaser.Game(480, 360, null, 'gameDiv');

// add each game state

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('preLevel', preLevelState);
game.state.add('play', playState);

// call the boot boot
game.state.start('boot');

// try to push 2
