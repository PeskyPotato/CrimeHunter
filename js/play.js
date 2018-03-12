
var k = 0; // k and m: Use counting instead of timing where the larger makes it rarely move
var m =0;
var sound;  // Game music
var epsound; // Explosion sound
var gsound; // Shotgun sound


var playState = {
		// Global variables declaration
    player: null,
    enemies: null,
    enemy: null,
    addhealth:null,

		// Instantiate and assign game objects
    create: function () {
      // World variables

      var playerX = 300;
      var playerY = 3150;
      var civY = 3100;
      var lane1 = 110;
      var lane2 = 180;
      var lane3 = 275;
      var lane4 = 335;
      var civNumber = 100;

      // Tilemap
      var map = game.add.tilemap('levelT');
      map.addTilesetImage('[TILESET]Dirt-City', 'tilesT');
      map.setCollision([10, 8]);
      this.layer = map.createLayer('Tile Layer 1');
      game.world.setBounds(0, 0, 480, 3200);


      // Sound
      sound = game.add.audio('gmusic');
      sound.play();
      epsound = game.add.audio('boom');
      gsound = game.add.audio('gunshot');

      this.player = new Player(playerX, playerY);

      game.camera.x = game.world.centerX;
      game.camera.y = game.world.centerY;
      game.physics.enable(this.player, Phaser.Physics.ARCADE);

      this.player.healthText = game.add.text(0, 10, "Health " + this.player.health, { font: "20px", fill: "#ffffff", align: "center" });
      this.player.healthText.fixedToCamera = true;

      //Player weapon: hand gun
      this.handgun = game.add.weapon(7, 'bullet');    // ammo 7
      this.handgun.bulletAngleOffset = 90;
      this.handgun.bulletSpeed = 400;
      this.handgun.fireRate =2000;
      game.physics.arcade.enable(this.player);
      this.handgun.trackSprite(this.player, -2, -80);
      this.handgun.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);


      // Player weapon: utlskill
      this.ultskill = game.add.weapon(1, 'ultskill');    // ammo 1
      this.ultskill.bulletAngleOffset = 90;
      this.ultskill.bulletSpeed = 400;
      this.ultskill.fireRate =8000;
      this.ultskill.trackSprite(this.player, -2, -80);
      this.ultskill.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      ultskillButton = this.input.keyboard.addKey(Phaser.KeyCode.Z);
      //ultskill cooldown shows
      this.player.skillText = game.add.text(0, 50, "Unique skill : 1 hit / 8 sec  (press z)", { font: "20px", fill: "#ffffff", align: "centre" });
      this.player.skillText.fixedToCamera = true;

      this.addhealth = game.add.sprite(game.world.centerX+100, game.world.centerY+100, 'addhealth');
      game.physics.enable(this.addhealth, Phaser.Physics.ARCADE);

      //Instantiate score to 0
      var myJSON = localStorage.getItem("highScore");
      var p = JSON.parse(myJSON);
      p.push("0");
      localStorage.setItem("highScore", JSON.stringify(p));
      this.player.scoreText = game.add.text(0, 30, "Score " + this.player.score, { font: "20px", fill: "#ffffff", align: "centre" });
      this.player.scoreText.fixedToCamera = true;


      // Enemy
      this.enemies = game.add.group();
      this.enemies.add(Enemy(200, 23800));

      this.enemies.add(Enemy(200, 23950));
      this.enemies.add(Enemy(200, 23700));
      this.enemies.add(Enemy(170, 23600));
      this.enemies.add(Enemy(180, 23500));



      this.enemies.forEach(function(enemy, index){
        game.physics.enable(enemy,Phaser.Physics.ARCADE);
        enemy.body.immovable = true;
      });
      this.enemies.enableBody = true;

      // Civil Cars (Random Cars)
      this.civils = game.add.group();

    	this.civils.enableBody = true;
    	var y = civY;
    	var numberOfRandomCars = civNumber;
      var lanes = [lane1, lane2, lane3, lane4];
    	for (var i=0; i < numberOfRandomCars; i++) {
        var x = lanes[Math.floor(Math.random()*lanes.length)];
    		var car = this.civils.create(x, y, 'characters');
        car.xDest = x;
        car.yDest = -200;
        car.update = function() {
          this.speed = 50;
          move(this);
        };
    		car.frame = 16;
    		y -= 150;
    	}

    },

    // Anything that needs to be checked
    // Collisions, user input etc...
    update: function () {

      updateScore(this.player);

      // Keyboard controls
      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        this.player.setDest(this.player.x - 30, this.player.y - 30);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        this.player.setDest(this.player.x + 30, this.player.y - 30);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        this.player.setDest(this.player.x, this.player.y - 38);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        this.player.setDest(this.player.x - 25, this.player.y + 25);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        this.player.setDest(this.player.x + 25, this.player.y + 25);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        this.player.setDest(this.player.x, this.player.y + 23);
      }

      if (fireButton.isDown){
        this.handgun.fire();
        this.player.animations.play('runningShoot');
        //gsound.play();
      }
      if (ultskillButton.isDown){
        this.ultskill.fire();
        this.player.animations.play('runningShoot');
        //gsound.play();
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

      // Civil's Car Movement Update
      if (k==300) {         // Use counting instead of timing where the larger makes it rarely move
        this.civils.forEach(function(car){
          var moveOrNot = [false, true];
          var moveCar = moveOrNot[Math.floor(Math.random()*moveOrNot.length)];
          if (moveCar == true) {
            var lanes = [110, 180, 275, 325];
            if (lanes.includes(car.xDest)) {
              car.xDest = lanes[Math.floor(Math.random()*lanes.length)];
            }
          }
          car.update();
        });
        k = 0;
      }
      k++;



	    if (m==60) {         // Use counting instead of timing where the larger makes it rarely move
        this.enemies.forEach(function(enemy){
          var moving = [false, true];
          var moveEnemy = moving[Math.floor(Math.random()*moving.length)];
          if (moveEnemy == true) {
            if (enemy.xDest==200) {
              enemy.xDest = 265;
            } else {
              enemy.xDest = 200;
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
        //epsound.play();
        e.stop();
        b.kill();
        //this.enemies.kill();
        this.player.score = this.player.score + 5;
        this.player.scoreText.setText("Score " + this.player.score);
      }, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.civils, function(b,c){
        console.log("hit! Bullet + Civil");
        //epsound.play();
        c.kill();
        b.kill();
        this.player.score = this.player.score - 5;
        this.player.scoreText.setText("Score " + this.player.score);
      }, null, this);

      game.physics.arcade.overlap(this.ultskill.bullets, this.enemies, function(b,e){
        console.log("hit! Bullet + Enemy");
        e.stop();
        this.player.score = this.player.score + 5;
        this.player.scoreText.setText("Score " + this.player.score);
      }, null, this);


      game.physics.arcade.overlap(this.ultskill.bullets, this.civils, function(b,c){
        console.log("hit! Bullet + Civil");
        c.kill();
        this.player.score = this.player.score - 5;
        this.player.scoreText.setText("Score " + this.player.score);
      }, null, this);


      game.physics.arcade.overlap(this.enemies, this.civils, function(e,c){
        console.log("crash! Enemy + Civil");
        //epsound.play();
        c.kill();
      }, null, this);

      game.physics.arcade.overlap(this.player, this.civils, function(p,c){
        console.log("crash! Enemy + Civil");
        //epsound.play();
        c.kill();
        p.health = p.health - 5;
        p.healthText.setText("Health " + p.health);
      }, null, this);

      game.physics.arcade.collide(this.player, this.layer, function(p, l){
        p.stop();
        console.log("side of road");
      });

      // Updates score every times user hits a multiple of 100
      if ((this.player.score % 18) == 0)
        updateScore(this.player);
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
  player.speed = 200; //80
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
	enemy.yDest = 0;

	enemy.goToXY = function(x){
		enemy.xDest = x;
	}

	enemy.update= function(){
		this.speed = 180;
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

function updateScore(b) {
  //console.log("UPDATES__________________+++++++++")
  var myJSON = localStorage.getItem("highScore");
  var p = JSON.parse(myJSON);

  p.pop();
  p.push(b.score);

  localStorage.setItem("highScore", JSON.stringify(p));
}
