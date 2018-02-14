var loadState={
  // First to be called after boot
  // Include loading screen when over network
  // Load game and assets
  preload: function() {
    var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'})

    game.stage.backgroundColor = '#000000';

    game.load.image('player1', 'assets/player.png');
    game.load.image('enemy', 'assets/badguy.png');
    game.load.image('bullet', 'assets/bullet.png');
  },
  // Called after preload
  create: function() {
    game.state.start('title');
  }
}
			