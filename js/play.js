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

var k = 0;
var m= 0;
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

      this.player.healthText = game.add.text(0, 10, "Health " + this.player.health, { font: "20px", fill: "#ffffff", align: "center" });
      this.player.healthText.fixedToCamera = true;

      this.player.scoreText = game.add.text(0, 30, "Score " + this.player.score, { font: "20px", fill: "#ffffff", align: "centre" });
      this.player.scoreText.fixedToCamera = true;

      // fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      //this.player.body.collideWorldBounds = true;

      this.handgun = game.add.weapon(7, 'bullet');    // ammo 7
      this.handgun.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      this.handgun.bulletAngleOffset = 90;
      this.handgun.bulletSpeed = 400;
      game.physics.arcade.enable(this.player);
      this.handgun.trackSprite(this.player, 14, 0);

      fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

      // Enemy
      this.enemies = game.add.group();
      this.enemies.add(Enemy(210,23900));
      this.enemies.add(Enemy(250,23800));
	  this.enemies.add(Enemy(270,23700));
      this.enemies.add(Enemy(230,23600));
	  this.enemies.add(Enemy(220,23500));
      this.enemies.add(Enemy(290,23400));
	  this.enemies.add(Enemy(240,24300));
      this.enemies.add(Enemy(220,24200));
	  this.enemies.add(Enemy(230,24100));
      this.enemies.add(Enemy(220,24500));
	  this.enemies.add(Enemy(250,24950));
      this.enemies.add(Enemy(290,25860));
	  this.enemies.add(Enemy(210,25770));
      this.enemies.add(Enemy(250,25810));
	  this.enemies.add(Enemy(230,25390));
      this.enemies.add(Enemy(210,25670));

	  
      this.enemies.forEach(function(enemy, index){
        game.physics.enable(enemy,Phaser.Physics.ARCADE);
        enemy.body.immovable = true;
      });
      this.enemies.enableBody = true;
	  

      // Civil Cars (Random Cars)
      this.civils = game.add.group();

    	this.civils.enableBody = true;
    	var y = 23700;     // Y Axis for the first car location; X Axis is defined randomly below
    	var numberOfRandomCars = 600;  // Number of random cars
      var lanes = [185, 265];// 185 middle left, 265 middle right
    	for (var i=0; i < numberOfRandomCars; i++) {
        var x = lanes[Math.floor(Math.random()*lanes.length)];
    		var car = this.civils.create(x, y, 'characters');
        car.xDest = x;
        car.yDest = 0;
        car.update = function() {
          this.speed = 30;
          move(this);
        };
    		car.frame = 16;
    		y -= 150;
    	}

    },

    // Anything that needs to be checked
    // Collisions, user input etc...
    update: function () {
      // Keyboard controls
      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
    		//this.player.x -= 2;
        this.player.setDest(this.player.x - 10, this.player.y - 10);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        //this.player.x += 4;
        this.player.setDest(this.player.x + 10, this.player.y - 10);
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
        this.player.animations.play('runningShoot');
      }

      // Mouse contorls
      if (game.input.activePointer.isDown) {
        this.player.setDest(game.input.x, game.input.y);
      }

	    //Enemy update
      this.enemies.forEach(function(enemy, index){
        enemy.update();
      });

      this.player.update();
      // game.physics.arcade.overlap(this.player, this.enemies, this.decreaseHealth, null, this);
      // game.physics.arcade.overlap(this.handgun, this.enemies, this.increaseScore, null, this);

      // Civil's Car Movement Update
      if (k==300) {         // Use counting instead of timing where the larger makes it rarely move
        this.civils.forEach(function(car){
          var moveOrNot = [false, true];
          var moveCar = moveOrNot[Math.floor(Math.random()*moveOrNot.length)];
          if (moveCar == true) {
            if (car.xDest==185) {
              car.xDest = 265;
            } else {
              car.xDest = 185;
            }
          }
          car.update();
        });
        k = 0;
      }
      k++;
	  
	  if(m==200){
	          this.enemies.forEach(function(enemy){
          var moving = [false, true];
          var moveEnemy = moving[Math.floor(Math.random()*moving.length)];
          if (moveEnemy == true) {
            if (enemy.xDest==210) {
             enemy.xDest = 265;
            } else {
              enemy.xDest = 185;
            }
          }
          enemy.update();
        });
        m = 0;
      }
      m++;
	  


      game.physics.arcade.collide(this.player, this.enemies, function(p,e){
        console.log("crash! Player + Enemy");
        p.health = p.health - 1;
        p.healthText.setText("Health " + p.health);
      });

      game.physics.arcade.overlap(this.handgun.bullets, this.enemies, function(b,e){
        console.log("hit! Bullet + Enemy");
        e.stop();
        b.kill();
        //this.enemies.kill();
        this.player.score = this.player.score + 5;
        this.player.scoreText.setText("Score " + this.player.score);
      }, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.civils, function(b,c){
        console.log("hit! Bullet + Civil");
        c.kill();
        b.kill();
        this.player.score = this.player.score - 5;
        this.player.scoreText.setText("Score " + this.player.score);
      }, null, this);

      game.physics.arcade.overlap(this.enemies, this.civils, function(e,c){
        console.log("crash! Enemy + Civil");
        c.kill();

      }, null, this);

      game.physics.arcade.overlap(this.player, this.civils, function(p,c){
        console.log("crash! Enemy + Civil");
        c.kill();
        p.health = p.health - 5;
        p.healthText.setText("Health " + p.health);
      }, null, this);

      game.physics.arcade.collide(this.player, this.layer, function(p, l){
        p.stop();
        console.log("side of road");
      });
    }
};

function render() {
  game.debug.spriteInfo(player, 20, 32);
  this.handgun.debug();

}

// Helper functions go below
function Player(x, y) {
  var player = game.add.sprite(x, y, 'characters');

  player.frame = 0;
  player.animations.add('running', [0, 1, 2, 3], 4);
  player.animations.add('runningShoot', [4, 5, 6, 7], 4);
  player.speed = 60; //80
  player.xDest = x;
  player.yDest = y;
  player.anchor.setTo(.5, 1);

  player.health = 50;
  player.healthText = null;

  player.score = 0;
  player.scoreText = null;

  player.setDest = function (x, y) {
    player.xDest = x;
    player.yDest = y;
  };

  player.update = function() {
    move(this);
    game.camera.x = this.x - 150;
    game.camera.y = this.y - 300;
    this.animations.play('runningShoot');
  };

  player.stop = function() {
    this.xDest = this.x;
    this.yDest = this.y;
  };

  return player;
};

function Enemy(x, y){
	var enemy = game.add.sprite(x, y, 'characters'); //x=480 y=360
	//enemy.speed= 7000;
	enemy.frame = 8;

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

function move(b){
  if (Math.floor(b.x / 10) == Math.floor(b.xDest / 10)) {
    b.body.velocity.x = 0;
  } else if (Math.floor(b.x) < Math.floor(b.xDest)) {
    b.body.velocity.x = b.speed;
  } else if (Math.floor(b.x) > Math.floor(b.xDest)) {
    b.body.velocity.x = -b.speed;
  }
  if (Math.floor(b.y / 10) == Math.floor(b.yDest / 10)) {
    b.body.velocity.y = 0;
  } else if (Math.floor(b.y) < Math.floor(b.yDest)) {
    b.body.velocity.y = b.speed;
  } else if (Math.floor(b.y) > Math.floor(b.yDest)) {
    b.body.velocity.y = -b.speed;
  }
}

function playerFrame(numB) {
  // control bullet bar
  var bulletBar = document.getElementsByClassName("numBullet");
  var bar = document.getElementsByClassName("nBullet");
  var barWidth = (numB / 1000) * 100;
  bar.css('width', barWidth + "%");
}
