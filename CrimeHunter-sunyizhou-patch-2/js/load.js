var loadState={
  // First to be called after boot
  // Include loading screen when over network
  // Load game and assets
  preload: function() {
    var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'})

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, 800, 600);

    game.stage.backgroundColor = '#000000';

    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('ultskill', 'assets/ultskill.png');
    game.load.image('addhealth', 'assets/health.png');
    game.load.image('addtrap', 'assets/trap.png');
    game.load.spritesheet('characters', 'assets/[SPRITE].png', 32, 64);
    game.load.image('playButton', 'assets/buttons/play.png');
    game.load.image('scoreButton', 'assets/buttons/score.png');
    game.load.image('backButton', 'assets/buttons/back.png');

    // Maps
    //game.load.tilemap('levelT', 'assets/map/LevelT.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.image('tilesT', 'assets/map/[TILESET]Dirt-City.png');
    //game.load.tilemap('level1', 'assets/map/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level0', 'assets/map/Level0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level1', 'assets/map/Level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/map/Level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tile_master', 'assets/map/Tileset_Master.png');


    // Music
    //game.load.audio('gmusic', 'assets/Chinese Dream.mp3');
    game.load.audio('boom', 'assets/explode1.wav');
    game.load.audio('gunshot', 'assets/shotgun.wav');
  },
  // Called after preload
  create: function() {
    game.state.start('title');
  }
}
