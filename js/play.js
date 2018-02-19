/**
 * Credit the source:
 *
 *  Title: <Fire Rate>
 *  Author: <photonstorm>
 *  Date: <3 Jun 2016>
 *  Code version: <2.10.0>
 *  Availability: <http://phaser.io/examples/v2/weapon/fire-rate>
 *
 *  Title: <Starstruck>
 *  Author: <photonstorm>
 *  Date: <9 Apr 2014>
 *  Code version: <2.10.0>
 *  Availability: <http://phaser.io/examples/v2/games/starstruck>
 *
 *  Title: <Defender>
 *  Author: <photonstorm>
 *  Date: <15 Apr 2016>
 *  Code version: <2.10.0>
 *  Availability: <http://phaser.io/examples/v2/games/defender>
 *
 */


var playState = {
		// Global variables declaration
    player: null,
    enemies: null,
    enemy: null,

		// Instantiate and assign game objects
    create: function () {

      // Tilemap
      var map = game.add.tilemap('level');
      map.addTilesetImage('TilesetRoad', 'tiles');
      map.setCollision([10, 8]);
      this.layer = map.createLayer('Tile Layer 1');
      game.world.setBounds(0, 0, 480, 24000);

        //this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player1');
        this.player = new Player(300, 24000);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY;
        game.physics.enable(this.player, Phaser.Physics.ARCADE);

       // this.player.animations.add('run');   wait for image
       // this.player.animations.play('run', 10, true);   wait for image

       game.camera.follow(this.player);  //wait for big map

       // fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //this.player.body.collideWorldBounds = true;



        this.handgun = game.add.weapon(7, 'bullet');    // ammo 7
        this.handgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.handgun.bulletAngleOffset = 90;
        this.handgun.bulletSpeed = 400;
        //sprite = this.add.sprite(250, 250, 'player1');  //???
        game.physics.arcade.enable(this.player);
        this.handgun.trackSprite(this.player, 14, 0);

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Enemy
	      this.enemies = game.add.group();
	      this.enemies.add(Enemy(270, 23900)); 
		  this.enemies.add(Enemy(200,23900));
	      this.enemies.forEach(function(enemy, index){
		      game.physics.enable(enemy,Phaser.Physics.ARCADE);
		      enemy.body.immovable = true;
	      });
    },

    // Anything that needs to be checked
    // Collisions, user input etc...
    update: function () {
      // Keyboard controls
      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
    		//this.player.x -= 2;
        this.player.setDest(this.player.x - 10, this.player.y);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        //this.player.x += 4;
        this.player.setDest(this.player.x + 10, this.player.y);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        //this.player.y -=4;
        this.player.setDest(this.player.x, this.player.y -15);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        //this.player.y += 4;
        this.player.setDest(this.player.x, this.player.y + 10);
      }


      if (fireButton.isDown){
          this.handgun.fire();
      }
	    //Enemy update
      this.enemies.forEach(function(enemy, index){
        enemy.update();
      });

      this.player.update();
      // game.physics.arcade.overlap(this.player, this.enemies, this.decreaseHealth, null, this);
      // game.physics.arcade.overlap(this.handgun, this.enemies, this.increaseScore, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.enemies, function(b,e){
        console.log("hit");
		e.stop();
		b.kill();
		
		
		//this.enemies.kill();
		
      }, null, this);
      game.physics.arcade.overlap(this.player, this.enemies, function(p,e){
        console.log("crash!");
		e.stop();
		
		
      }, null, this);

    }
};

function render() {
  game.debug.spriteInfo(player, 20, 32);
  this.handgun.debug();

}

// Helper functions go below
function Player(x, y) {
  var player = game.add.sprite(x, y, 'player1');

  player.speed = 60; //80
  player.xDest = x;
  player.yDest = y;
  player.anchor.setTo(.5, 1);

  player.setDest = function (x, y) {
    player.xDest = x;
    player.yDest = y;
  };

  player.update = function() {
    move(this);
    game.camera.x = this.x - 150;
    game.camera.y = this.y - 300;
  };

  player.stop = function() {
    this.xDest = this.x;
    this.yDest = this.y;
  };

  return player;
};

function Enemy(x, y){
	var enemy = game.add.sprite(x, y, 'enemy'); //x=480 y=360
	//enemy.speed= 7000;
	enemy.xDest = x;
	enemy.yDest = y;
	
	enemy.goToXY = function(x, y){
		enemy.xDest = x;
		enemy.yDest = y
	}
	
	enemy.update= function(){	
		this.speed = 40;
		this.goToXY(this.x, this.y - 100);
		//enemy.body.velocity.y=-50;
		move(this);
	}
	enemy.stop = function(){
		this.kill();
	}

	
	return enemy;
}

function move(self){
  if (Math.floor(self.x / 10) == Math.floor(self.xDest / 10)) {
    self.body.velocity.x = 0;
  } else if (Math.floor(self.x) < Math.floor(self.xDest)) {
    self.body.velocity.x = self.speed;
  } else if (Math.floor(self.x) > Math.floor(self.xDest)) {
    self.body.velocity.x = -self.speed;
  }
  if (Math.floor(self.y / 10) == Math.floor(self.yDest / 10)) {
    self.body.velocity.y = 0;
  } else if (Math.floor(self.y) < Math.floor(self.yDest)) {
    self.body.velocity.y = self.speed;
  } else if (Math.floor(self.y) > Math.floor(self.yDest)) {
    self.body.velocity.y = -self.speed;
  }
}
