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
    game.load.image('ultskill', 'assets/ultskill.png');
    game.load.image('addhealth', 'assets/health.png');
    game.load.spritesheet('characters', 'assets/Spritesheet.png', 38, 64);

    game.load.tilemap('level', 'assets/map/Level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/map/TilesetRoad1.png');

    game.load.image('title', 'assets/TitleScreen.png');

    // Preload the music
    // Phaser Examples
    game.load.audio('gmusic', 'assets/Chinese Dream.mp3');
    game.load.audio('boom', 'assets/explode1.wav');
    game.load.audio('gunshot', 'assets/shotgun.wav');
  },
  // Called after preload
  create: function() {
    game.state.start('title');
  }
}
