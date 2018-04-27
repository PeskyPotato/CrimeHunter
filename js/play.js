
var k = 0; // k and m: Use counting instead of timing where the larger makes it rarely move
var m = 0;
var sound;  // Game music
var epsound; // Explosion sound
var gsound; // Shotgun sound
var eBullets; // Enemies' Bullets
var remainingEnemies = [] ; // Remaining Enemies
var attackTiming = 0; // Time when enemies attack the player
var back_layer;
var middle_layer;
var motorbikeAttackTime = 0;
var motorbikeAttackStop = 0;
var delayOperation = 0;
var delayMotorShoot = 0;
var isMusicStarted = false; //Boolean variable to hold whether or not music has started.
var timer;
var second;
var beep = 0;

// levels: playerX, playerY, civY, lane1, lane2, lane3, lane4, civNumber, enemyNumber, enemyY, levelName, layerName, collision, boundsX, boundsY, enemyMove
var level0 = [300, 3150, 2900, 110, 180, 275, 335, 100, 1, 2900, 'level0', 'Tile Layer 1', [42, 43], 480, 3200, 30, [300, 2150], 15];
var level1 = [300, 3600, 3350, 110, 180, 275, 335, 200, 2, 3350, 'level1', 'Tile Layer 1', [2, 3], 480, 3680, 25, [300, 1000], 15];
var level2 = [300, 5050, 4800, 110, 180, 275, 335, 300, 3, 4800, 'level2', 'Tile Layer 1', [25], 480, 5120, 20, [100, 800], 25];
var level3 = [300, 6950, 6700, 110, 180, 275, 335, 300, 4, 6700, 'level3', 'Tile Layer 1', [46], 480, 7040, 15, [110, 4000], 30];

var lane = [];


var playState = {
		// Variable declarations
    player: null,
    enemies: null,
    enemy: null,
    addhealth: null,
    curLevel: null,
    curLevelInt: null,
    noKills: null,
    healthbag: null,
	  megahealth: null,
	  megabullet: null,
    plyrMving: null,
    plyrMvingBack: null,
    plyrMvingCount:null,
  	enemiesKilled: null,
  	enemiesNum: null,
  	playerNPC: null,
  	numOfEnemies: null,
    con: null,
    timingText: null,

		// Instantiate and assign game objects
    create: function () {
      sound = game.add.audio('gmusic');
      sound.loop = true;

      this.curLevelInt = localStorage.getItem("level");
      if (this.curLevelInt == 0){
        this.curLevel = level0;
        this.curLevelInt = 0;

      } else if (this.curLevelInt == 1) {
        this.curLevel = level1;
        this.curLevelInt = 1;

      } else if (this.curLevelInt == 2) {
        this.curLevel = level2;
        this.curLevelInt = 2;

      } else if (this.curLevelInt == 3) {
         this.curLevel = level3;
         this.curLevelInt= 3;
      }

      // World variables
      var playerX = this.curLevel[0];
      var playerY = this.curLevel[1];
      var civY = this.curLevel[2];
      var lane1 = this.curLevel[3];
      var lane2 = this.curLevel[4];
      var lane3 = this.curLevel[5];
      var lane4 = this.curLevel[6];
      var civNumber = this.curLevel[7];
      var enemyNumber = this.curLevel[8];
      var enemyY = this.curLevel[9];
      var levelName = this.curLevel[10];
      var layerName = this.curLevel[11];
      var collision = this.curLevel[12];
      var boundsX = this.curLevel[13];
      var boundsY = this.curLevel[14];
      var enemyMove = this.curLevel[15];
      second = this.curLevel[17];
      beep = 0;

      //Tilemap
      back_layer = game.add.group(); // maps + power ups + traps
      middle_layer = game.add.group(); // NPCS, Enemy, Player
      var front_layer = game.add.group(); // Bridges
      var map = game.add.tilemap(levelName);
      map.addTilesetImage('Tileset_Master', 'tile_master')
      map.setCollision(collision);
      this.layer = map.createLayer(layerName);
      // TODO Add Tile Layer 2 to all levls to avoid this 'if'
      if (this.curLevelInt > 2) {
        this.layer1 = map.createLayer('Tile Layer 2');
        front_layer.add(this.layer1);
      }
      back_layer.add(this.layer);
      game.world.setBounds(0, 0, boundsX, boundsY);

      // Sound
      epsound = game.add.audio('boom');
      gsound = game.add.audio('gunshot');
      if (isMusicStarted == false) {
        sound.play();
        isMusicStarted = true;
      }

      // Create player
      this.player = new Player(playerX, playerY, enemyNumber);
      this.plyrMving = false;
      this.plyrMvingBack = false;
      this.plyrMvingCount = 0;

      // Add contruction site
      this.con = game.add.sprite(this.curLevel[16][0], this.curLevel[16][1], 'construct');
      middle_layer.add(this.con);
      this.con.frame = 1;
      this.con.animations.add('running', [0, 1, 2, 3], 4);
      game.physics.enable(this.con, Phaser.Physics.ARCADE);
      this.con.body.immovable = true;


      // Create camera to follow player
      game.camera.x = game.world.centerX;
      game.camera.y = game.world.centerY;
      game.physics.enable(this.player, Phaser.Physics.ARCADE);

      this.myHealthBar = new HealthBar(this.game, {x: 45, y: 20, height: 10, width: 80});
      this.myHealthBar.setBarColor('#ff1c1c');
      this.myHealthBar.setFixedToCamera(true);

      //Player weapon: hand gun
      this.handgun = game.add.weapon(7, 'playerBullet');    // ammo 7
      this.handgun.bulletAngleOffset = 90;
      this.handgun.bulletSpeed = 750;
      this.handgun.fireRate = 600;
      game.physics.arcade.enable(this.player);
      this.handgun.trackSprite(this.player, -2, -80);
      this.handgun.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

      // Player weapon: utlskill
      this.ultskill = game.add.weapon(7, 'ultskill');
      this.ultskill.bulletAngleOffset = 90;
      this.ultskill.bulletSpeed = 2000;
      this.ultskill.fireRate = 5000;
      this.ultskill.trackSprite(this.player, -2, -80);
      this.ultskill.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      ultskillButton = this.input.keyboard.addKey(Phaser.KeyCode.Z);

      // Enemy Weapon
      eBullets = game.add.group();
      eBullets.enableBody = true;
      eBullets.physicsBodyType = Phaser.Physics.ARCADE;
      eBullets.createMultiple(100, 'enemyBullet');
      eBullets.setAll('anchor.x', 0.5);
      eBullets.setAll('anchor.y', 1);
      eBullets.setAll('outOfBoundsKill', true);
      eBullets.setAll('checkWorldBounds', true);


      // Enemy's motor Weapon
      emBullets = game.add.group();
      emBullets.enableBody = true;
      emBullets.physicsBodyType = Phaser.Physics.ARCADE;
      emBullets.createMultiple(100, 'motorBullet');
      emBullets.setAll('anchor.x', 0.5);
      emBullets.setAll('anchor.y', 1);
      emBullets.setAll('outOfBoundsKill', true);
      emBullets.setAll('checkWorldBounds', true);
      // Set player score to the latest score in array
      var myJSON = localStorage.getItem("highScore");
      var p = JSON.parse(myJSON);
      var curScore = p.shift();
      this.player.score = curScore;
      p.unshift(curScore);

      // Display player score on screen
      var scoreTextLabel = game.add.text(3, 30, "Score", {font: "15px", fill: "#ffffff", align: "center"});
      this.player.scoreText = game.add.text(50, 42, this.player.score, { font: "20px", fill: "#ffffff", align: "right" });
      this.player.scoreText.fixedToCamera = true;
      scoreTextLabel.fixedToCamera = true;

      // Display enemies number
      var enemyTextLabel = game.add.text(3, 65, "Enemies", {font: "15px", fill: "#ffffff", align: "center"});
      this.player.enemyText = game.add.text(50, 77, this.player.enemyLeft, { font: "20px", fill: "#ffffff", align: "right" });
      this.player.enemyText.fixedToCamera = true;
      enemyTextLabel.fixedToCamera = true;

      // Timer for each level
      timer = game.time.create(false);
      timer.loop(1000, countDown, this);
      timer.start();
      this.timingText = game.add.text(3,100, "Time Left", {font: "15px", fill: "#ffffff", align: "centre" })
      this.timing = game.add.text(50,112, second, {font: "20px", fill: "#ffffff", align: "centre" })
      this.timing.fixedToCamera = true;
      this.timingText.fixedToCamera = true;

      //HealthBag allow player recover health
      this.healthbag = game.add.group();
      back_layer.add(this.healthbag);
      this.healthbag.enableBody = true;
      this.healthbag.physicsBodyType = Phaser.Physics.ARCADE;
      var mx = game.width - game.cache.getImage('addhealth').width;
      var my = game.height - game.cache.getImage('addhealth').height;

      // add 1 health bag per level
      var hXaxis = Math.floor(Math.random()*(350 - 99) + 100); // Choose X-Axis randomly to place health
      var hYaxis = Math.floor(Math.random()*((playerY/2) - (playerY/5) + 1) + (playerY/5)); // Choose Y-Axis randomly to place health
      this.healthbag.create(hXaxis, hYaxis, 'addhealth');


	     //Random chance to spawn a mega health pack, which gives + 50
	     //Chance = 1 in 10
	     var rand = Math.floor((Math.random() * 10) + 1);
       if(rand == 5) {
         this.megahealth = game.add.group();
         back_layer.add(this.megahealth);
         this.megahealth.enableBody = true;
         this.megahealth.physicsBodyType = Phaser.Physics.ARCADE;
         var mx = game.width - game.cache.getImage('megahealth').width;
         var my = game.height - game.cache.getImage('megahealth').height;
         var hXaxis = Math.floor(Math.random()*(350 - 99) + 100); // Choose X-Axis randomly to place health
         var hYaxis = Math.floor(Math.random()*((playerY/2) - (playerY/5) + 1) + (playerY/5)); // Choose Y-Axis randomly to place health
         this.megahealth.create(hXaxis, hYaxis, 'megahealth');
      };

      //1 in 15 chance to get the mega bullet upgrade
      //Increased bullet speed, slightly better fire rate
      rand = Math.floor((Math.random() * 15) + 1);
      if(rand == 5) {
        this.megabullet = game.add.group();
        back_layer.add(this.megabullet);
        this.megabullet.enableBody = true;
        this.megabullet.physicsBodyType = Phaser.Physics.ARCADE;
        var mx = game.width - game.cache.getImage('megabullet').width;
        var my = game.height - game.cache.getImage('megabullet').height;
        var hXaxis = Math.floor(Math.random()*(350 - 99) + 100); // Choose X-Axis randomly to place health
        var hYaxis = Math.floor(Math.random()*((playerY/2) - (playerY/5) + 1) + (playerY/5)); // Choose Y-Axis randomly to place health
        this.megabullet.create(hXaxis, hYaxis, 'megabullet');
      };

      //Trap can damage player
      this.trap = game.add.group();
      back_layer.add(this.trap);
      this.trap.enableBody = true;
      this.trap.physicsBodyType = Phaser.Physics.ARCADE;

      var hYaxis = playerY - 500; // Choose Y-Axis randomly to potholes
      var numberOfPoles = 25; // Set the fixed number for now, later will be depended on level
      var poleGap = 300;  // gap between potholes
      // add potholes per level
      for (var i = 0; i < numberOfPoles; i++) {
        var hXaxis = Math.floor(Math.random()*(350 - 99) + 100); // Choose X-Axis randomly to potholes
        this.trap.create(hXaxis, hYaxis, 'pothole');
        hYaxis -= poleGap ;
      }

        //Boss
        this.Boss = game.add.group();
        middle_layer.add(this.Boss);
        this.Boss.enableBody = true;
        this.Boss.physicsBodyType = Phaser.Physics.ARCADE;

      //  this.Boss.health = 100;

        var y = enemyY - 20;

       // var numberOfRandomCars = enemyNumber;
        var lanes = [lane1, lane2, lane3, lane4];

            var x = lanes[Math.floor(Math.random()*lanes.length)];
            this.Boss.add(boss(x,y));
            y -=150;


        this.Boss.forEach(function(enemy, index){
            game.physics.enable(enemy,Phaser.Physics.ARCADE);
            enemy.body.immovable = true;
        });
        this.Boss.enableBody = true;

      // Enemy
      this.enemies = game.add.group();
      middle_layer.add(this.enemies);
      this.enemies.enableBody = true;
      this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
      var y = enemyY;

    	var numberOfRandomCars = enemyNumber;
      var lanes = [lane1, lane2, lane3, lane4];
    	for (var i=0; i < numberOfRandomCars; i++) {
        var x = lanes[Math.floor(Math.random()*lanes.length)];
        this.enemies.add(Enemy(x,y));
        y -=150;
      }

      this.enemies.forEach(function(enemy, index){
        game.physics.enable(enemy,Phaser.Physics.ARCADE);
        enemy.body.immovable = true;
      });
      this.enemies.enableBody = true;

	    // Civil Cars (Random Cars)
      this.civils = game.add.group();
      middle_layer.add(this.civils);
      addLanes([lane1, lane2, lane3, lane4]);     // Add an array of lanes to lane
    	this.civils.enableBody = true;
      var numberOfRandomCars = civNumber;
      var startingYAxis = civY;
      this.civils = addRandomCars(this.civils,numberOfRandomCars,startingYAxis);
      /* If you want to reset the random cars for every level, one suggestion is
      to use the following code in update: function() {}:

      addLanes([ list of lanes you want to set ]);
      this.civils = addRandomCars(this.civils, number Of RandomCars you want , starting Y-Axis of the first random car);
      */

      // Enemie's Motorbike
      if (this.curLevelInt == 2) {
        this.motorbikes = game.add.group();
        middle_layer.add(this.motorbikes);
        var numberOfMotorbikes = 3;          // Number of motorbikes
        var startingMotorYAxis = civY + 1000;  // Have it offscreen for its initial location
        this.motorbikes = addMotorbikes(this.motorbikes,numberOfMotorbikes,startingMotorYAxis);
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.motorbikes.forEach(function(motor){
          game.physics.enable(motor,Phaser.Physics.ARCADE);
          motor.body.immovable = true;
        });
        this.motorbikes.enableBody = true;
      }
    },  // create

    // Anything that needs to be checked, collisions, user input etc...
    update: function () {
      // Keyboard controls
      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        this.player.setDest(this.player.x - 30, this.player.y - 30);
        setSpeed(this.player, game.input.keyboard.isDown(Phaser.Keyboard.X));
        this.plyrMving = true;
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        this.player.setDest(this.player.x + 30, this.player.y - 30);
        setSpeed(this.player, game.input.keyboard.isDown(Phaser.Keyboard.X));
        this.plyrMving = true;
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        this.player.setDest(this.player.x + 50, this.player.y);
        //setSpeed(this.player, game.input.keyboard.isDown(Phaser.Keyboard.X));
        //this.plyrMving = true;
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        this.player.setDest(this.player.x - 50, this.player.y);
        //setSpeed(this.player, game.input.keyboard.isDown(Phaser.Keyboard.X));
        //this.plyrMving = true;
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        this.player.setDest(this.player.x, this.player.y - 38);
        setSpeed(this.player, game.input.keyboard.isDown(Phaser.Keyboard.X));
        this.plyrMving = true;
      }
      else if (this.plyrMving == true && this.plyrMvingBack == false){
        this.player.setDest(this.player.x, this.player.y - 10);
        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
          this.player.speed = this.player.speed - 50;
        } else {
          this.player.speed = this.player.speed - 5;
        }
        //this.player.speed = this.player.speed - 5;
        this.plyrMvingCount = this.plyrMvingCount + 1;
        if (this.player.speed <= 0){
          this.player.setDest(this.player.x, this.player.y);
          this.player.speed = 280;
          this.plyrMving = false;
        }
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

      // Player's current X and Y axis
      var temY = this.player.body.y;
      var temX = this.player.body.x;

      // Enemies check for player to attack if they are near the player
      if (attackTiming == 60) {
          enemyBullet = eBullets.getFirstExists(false);
          remainingEnemies.length=0;
          this.enemies.forEachAlive(function(enemy){  // Check for remaining enemies
            remainingEnemies.push(enemy);
          });
          if (enemyBullet && remainingEnemies.length > 0) {
              // Choose one enemy randomly to shoot
              var b = remainingEnemies[game.rnd.integerInRange(0,remainingEnemies.length-1)];
              // Also, that enemy only shoot if the distant is around 300 away from player
              if (((temY > b.body.y) && (temY - b.body.y < 300))
              ||  ((temY < b.body.y) && (b.body.y - temY < 300))) {
                enemyBullet.reset(b.body.x+9, b.body.y+70);
                game.physics.arcade.moveToObject(enemyBullet,this.player,120);
              }
          }
          attackTiming = 0;
        }
      attackTiming++;
      this.player.update();

      /*
       1. Civil's Car Movement Update
	        the smaller k equal to, the higher frequency NPC movement can be

       2. If the player is within the range of NPC cars, the NPC cars need move away from the player.
          2.1 The player is inside range is when the player is (plyer.Y-Axis - 200 Y-Axis) away behind the NPC cars
              or (player.Y-Axis + 200 Y-Axis) in front of the NPC cars, and
              within X-Axis ranges of NPC cars in which the range of each NPC car is [car.x-30, car.x+30].
          2.2 Another condition of range is when the player is (plyer.Y-Axis - 100 Y-Axis) away behind the NPC cars
              or (player.Y-Axis + 100 Y-Axis) in front of the NPC cars,
              and the NPC cars need to switch lanes, if it needs to, on the X-Axis where if its X-Axis > player.x,
              it needs to switch lanes to the one where X-Axis is larger than player.x, and vice versa to avoid collision.
      */
      //      var temY = this.player.body.y; Use above
      //      var temX = this.player.body.x; Use above

      /* Random Lanes Assignment After the Time Interval
         We use 'k' counting as the timer where it assigns random lanes to each cars
         once k value is reached. Since update function() occurs approximately 60 times per second
         we can consider the time to be equal to k/60.
         So if k==300, it takes around 5 seconds to assign random lanes each time.
      */
      if (k==300) {
        this.civils.forEach(function(car){
          var moveOrNot = [false, true];
          var moveCar = moveOrNot[Math.floor(Math.random()*moveOrNot.length)];
          var changeSpeedOrNot = [false, true];
          var changeSpeed = changeSpeedOrNot[Math.floor(Math.random()*changeSpeedOrNot.length)];
          var newSpeed = 50;
          if (moveCar == true) {
              car.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
          }
          if (changeSpeed == true) {
            newSpeed =  Math.floor(Math.random() * 96) + 50;
            car.update = function() {
              this.speed = newSpeed;
              move(this);
            };
          }
        });
        k = 0;
      }

      // Described in 2. above
      this.civils.forEach(function(car){
        if (((car.y < temY) && (car.y >= temY-200)) || ((car.y >= temY) && (car.y <= temY+200))) {
          /* The NPC car need to move away if the player moves along the X-Axis of range [temX-30, temX+30]
             In this case, the player is either behind or in front of NPC car.
          */
          if ((car.xDest <= temX+30) && (car.xDest >= temX-30)) {
            while ((car.xDest <= temX+30) && (car.xDest >= temX-30)) {
              car.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
            }
          }
          /* The NPC car need to stay on the right side if the player moves along the left side of its X-Axis,
              and it plans to move to the left.
          */
          else if (((car.y < temY) && (car.y >= temY-100)) || ((car.y >= temY) && (car.y <= temY+100))) {
            if ((car.xDest <= temX) && (car.body.x > temX)) {
              while ((car.xDest <= temX) && (car.body.x > temX)) {
                car.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
              }
            }
            /* The NPC car need to stay on the left side if the player moves along the right side of its X-Axis,
                and it plans to move to the right.
            */
            else if ((car.xDest > temX) && (car.body.x <= temX)) {
              while ((car.xDest > temX) && (car.body.x <= temX)) {
                car.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
              }
            }
          }
        }
        car.update();
      });
      k++;

      var otherCars = this.civils;

      // The function to avoid the NPC from overlapping each other.
      this.civils.forEach(function(car){
        otherCars.forEach(function(othercar){
          if (((car.body.y - 100 < othercar.body.y) && (car.body.y > othercar.body.y))
          ||  ((car.body.y + 100 > othercar.body.y) && (car.body.y < othercar.body.y))  ) {
            // 1. If there is a car at the front around 1 car away, slow down to speed
            // the same as the car at the front.
            if ((car.body.x == othercar.body.x)
            || ((car.body.x <= othercar.body.x+30) && (car.body.x > othercar.body.x-30))) {
              car.update = function() {
                this.speed = othercar.speed;
                move(this);
              };
            }
            // 2. Check for other cars before to avoid collision on either left or right.
            // 2.1. Check before moving to the left.
           else if  ((car.xDest - 20 <= othercar.x) && (car.body.x >= othercar.x)) {
              while ((car.xDest - 20 <= othercar.x) && (car.body.x >= othercar.x)) {
                  car.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
              }
              car.update();
            }
            // 2.2. Check before moving to the right.
            else if ((car.xDest + 20 >= othercar.x) && (car.body.x <= othercar.x)) {
              while ((car.xDest + 20 >= othercar.x) && (car.body.x <= othercar.x)) {
                  car.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
              }
              car.update();
            }
          }
        });
      });

      // Set the NPC cars to stop when they see the construction site
      var cstX = this.con.x;
      var cstY = this.con.y;
      this.civils.forEach(function(car){
        if ((cstY < car.y) && (cstY > car.y - 250)) { // Before reaching construction site
          if  ((car.xDest <= cstX + 10) && (car.x >= cstX)) {
            car.update = function() {
              this.speed = 0;
              move(this);
            };
          }
          else if ((car.xDest >= cstX + 35) && (car.x <= cstX + 35)) {
            car.update = function() {
              this.speed = 0;
              move(this);
            };
          }
          k = 100;
        }
      });

      // enemy's Car Movement Update
      // the smaller m equal to , the higher frequency enemy movement can be
      if (m==this.curLevel[15]) {         // Use counting instead of timing where the larger makes it rarely move
        this.enemies.forEach(function(enemy){
          var moving = [false, true];
          var moveEnemy = moving[Math.floor(Math.random()*moving.length)];
          if (moveEnemy == true) {
			    var lanes = [110, 180, 275, 335];
				  if (lanes.includes(enemy.xDest)) {
              enemy.xDest = lanes[Math.floor(Math.random()*lanes.length)];
            }
		      }
          if (((cstY < enemy.y) && (cstY > enemy.y - 1000))    // Before reaching construction site
          ||  ((cstY > enemy.y) && (cstY < enemy.y + 100))) { // After passing construction site
            if  ((enemy.xDest <= cstX + 10) && (enemy.x >= cstX)) {
               while ((enemy.xDest <= cstX + 10) && (enemy.x >= cstX)) {
                   enemy.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
               }
             }
            else if ((enemy.xDest >= cstX + 35) && (enemy.x <= cstX + 35)) {
              while ((enemy.xDest >= cstX + 35) && (enemy.x <= cstX + 35)) {
                   enemy.xDest = (lane)[Math.floor(Math.random()*(lane).length)];
               }
             }
          }
          // If any of the enemy reach the end of map first, game restart
          if (enemy.body.y < -100){
            condition = 3;
            game.state.start("preLevel");
          }
          enemy.update();
        });
        m = 0;
      }
      m++;

      if (this.curLevelInt == 2) {
        // Motorbike only available on level 2
        // Motorbike Update
        this.motorbikes.forEach(function(motor){
          if (motor.body.y + 200 < game.camera.y) motor.kill();
        });

        if (motorbikeAttackTime == 100) {          // Timer for the motor bike to start moving
          this.motorbikes.forEach(function(motor){
            motor.update = function() {
              this.speed = 500;
              move(this);
            };
          });
        }
        motorbikeAttackTime++;

        // If the motor reach the range of Y-Axis where the player is, they start to attack
        if (delayOperation == 0) {
          // Delay is used to let the motorbike has enough time to move on after attacking the player
          // after a short period of time.
          var pl = this.player;
          if (delayMotorShoot != 0) { delayMotorShoot--; }
          this.motorbikes.forEach(function(motor){
            if ((motor.y < temY - 200) && ( temY < motor.y + 400)){
              motor.update = function() {
                this.speed = 250;
                move(this);
              };
              enemyBullet = eBullets.getFirstExists(false);
              if (enemyBullet && delayMotorShoot == 0) {
                enemyBullet.reset(motor.body.x+5, motor.body.y+30);
                game.physics.arcade.moveToXY(enemyBullet,temX,temY-300, 200, 2000);
                delayMotorShoot = 200;
              }
            }
          });
        }
        if (delayOperation != 0) { delayOperation--;}

        // The motorbike move on after staying in similar speed to the player's car for a short time.
        if (motorbikeAttackStop == 200) {
          this.motorbikes.forEach(function(motor){
              motor.update = function() {
                if (this.speed == 250) {
                  this.speed = 800;
                  move(this);
                };
                enemyBullet = emBullets.getFirstExists(false);
                if (enemyBullet && delayMotorShoot == 0) {
                  enemyBullet.reset(motor.body.x+5, motor.body.y+30);
                  game.physics.arcade.moveToXY(enemyBullet,temX,temY-300, 200, 2000);
                  delayMotorShoot = 200;

                  delayOperation = 100; // Set delay to give the motorbike enough time to move on

                }
              };
          });
          motorbikeAttackStop = 0;
        }
        motorbikeAttackStop++;
      }

      // Kill NPC car that go off screen.
      this.civils.forEach(function(car) {
        if (car.body.y - 400 > game.camera.y) car.kill(); // Cars got passed by the players
        else if (car.body.y <= -100) car.kill(); // Cars that goes off the screen (Y-Axis == 0)
      });

      // Collisions
      game.physics.arcade.collide(this.player, this.enemies, function(p,e){
        p.health = p.health - 5;
      });
      game.physics.arcade.collide(this.player, this.Boss, function(p,e){
        p.health = p.health - 5;
      });
      game.physics.arcade.collide(this.player, this.con, function(p,e){
        p.health = p.health - 5;
      });
      game.physics.arcade.collide(this.civils, this.con, function(p,e){
        e.kill();
      });
      game.physics.arcade.overlap(this.healthbag, this.player,  function(p,h){
        h.kill();
        this.player.health = this.player.health + 25;
      }, null, this);

      game.physics.arcade.overlap(this.megahealth, this.player,  function(p,h){
        h.kill();
        this.player.health = this.player.health + 50;
      }, null, this);

      this.con.animations.play('running');

	     //The mega bullet comes with increased bullet speed, slightly better fire rate
      game.physics.arcade.overlap(this.megabullet, this.player,  function(p,h){
        h.kill();
        this.handgun = game.add.weapon(7, 'megabullet');
        this.handgun.bulletSpeed = 1000;
        this.handgun.fireRate = 700;
        this.handgun.bulletAngleOffset = 90;
        this.handgun.trackSprite(this.player, -2, -80);
        this.handgun.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      }, null, this);

      game.physics.arcade.overlap(this.trap, this.player,  function(p,t){
        this.player.health = this.player.health - 1;
      }, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.enemies, function(b,e){
        e.stop(this.player);
        b.kill();
        this.player.score = this.player.score + 5;
        this.player.updateScore();
        this.player.updateEnemies();
      }, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.civils, function(b,c){
        c.kill();
        b.kill();
        this.player.score = this.player.score - 5;
        this.player.updateScore();
      }, null, this);

      game.physics.arcade.overlap(this.ultskill.bullets, this.enemies, function(b,e){
        e.stop(this.player);
        b.kill();
        this.player.score = this.player.score + 5;
        this.player.updateScore();
        this.enemiesNum = this.enemiesNum -1;
        this.enemiesKilled.setText(this.enemiesNum)
      }, null, this);

      game.physics.arcade.overlap(this.ultskill.bullets, this.civils, function(b,c){
        c.kill();
        this.player.score = this.player.score - 5;
        this.player.updateScore();
      }, null, this);

      game.physics.arcade.overlap(eBullets, this.player, function(p,b){
        b.kill();
        p.health = p.health - 10;
      }, null, this);

      game.physics.arcade.overlap(eBullets, this.civils, function(b,c){
        b.kill();
        c.kill();
      }, null, this);

      game.physics.arcade.overlap(this.civils, this.civils, function(car1,car2){
        car1.kill();
        car2.kill();
      }, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.Boss, function(b,e){

            b.kill();
           e.health = e.health - 20;
           if(e.health <= 0){
               this.player.score = this.player.score + 100;
               this.player.updateScore();
               this.player.kills = this.player.kills+ 1;
             e.kill();
           }
        }, null, this);


      game.physics.arcade.overlap(this.ultskill.bullets, this.Boss, function(b,e){
        b.kill();
        e.health = e.health - 50;
        if(e.health <= 0){
          this.player.score = this.player.score + 100;
          this.player.updateScore();
          this.player.kills = this.player.kills+ 1;
          e.kill();
        }
      }, null, this);

      game.physics.arcade.overlap(this.enemies, this.civils, function(e,c){
        //console.log("crash! Enemy + Civil");
        //epsound.play();
        
        
        
		c.kill();


      }, null, this);

      game.physics.arcade.overlap(this.handgun.bullets, this.Boss, function(e,c){
        c.health  = c.health - 10;
        e.kill();
      }, null, this);

      game.physics.arcade.overlap(this.ultskill.bullets, this.Boss, function(e,c){
        c.health  = c.health - 50;
        e.kill();

      }, null, this);

      game.physics.arcade.overlap(this.player, this.civils, function(p,c){
        //console.log("crash! Player + Civil");
        //epsound.play
        //this.playerNPC.animations.add('boomm', [4,5,6,7,8], 4);
        //this.playerNPC.animations.play('boomm');
        this.player.animations.play('runningShoot');
        c.frame = 7;
        //c.kill();
        p.health = p.health - 0.1;
        //console.log(c.body.x);
        //this.playerNPC.animations.play('boomm');
      }, null, this);

      game.physics.arcade.collide(this.player, this.layer, function(p, l){
        p.stop();
        //console.log("side of road");
      });

      //updateScore(this.player);
      this.myHealthBar.setPercent(this.player.health);

      // Checks if player is at the end of map
      if (this.player.y < 100){
        nextLevel(this.player, this.curLevel[8], this.curLevelInt);
      } else if ((this.player.y > this.curLevel[14]) && (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))) {
        this.player.stopY();
      }

      // Control the timing
      if (second == -1) { condition = 3; game.state.start("preLevel");}
      else if (second <= 5) {
        this.timing.setText(second); beep = 0;
        this.timing.addColor('#FF0000', 0);
        this.timingText.addColor('#FF0000', 0);
      }
      else { this.timing.setText(second); }


    } // update
}; // playState

function render() {
  game.debug.spriteInfo(player, 20, 32);
  this.handgun.debug();
}

// Helper functions go below
function Player(x, y, enemyNumber) {
  var player = game.add.sprite(x, y, 'characters');
  middle_layer.add(player);

  player.frame = 0;
  player.animations.add('runningShoot', [0, 1, 2, 3], 0);
  player.speed = 280;
  player.xDest = x;
  player.yDest = y;
  player.anchor.setTo(.5, 1);

  player.health = 100;
  player.healthText = null;

  player.score = 0;
  player.scoreBuffer = 0;
  player.scoreText = null;

  player.enemyLeft = enemyNumber;
  player.enemyText = null;
  player.kills= 0;

  player.setDest = function (x, y) {
    player.xDest = x;
    player.yDest = y;
  };

  player.updateScore = function() {
    player.scoreText.setText(player.score);
    var scaleUp = game.add.tween(player.scoreText.scale).to({ x: 1.2, y: 1.2}, 200, Phaser.Easing.Linear.In);
    var scaleDown = game.add.tween(player.scoreText.scale).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
    scaleUp.start();
    scaleUp.chain(scaleDown);
  };

  player.updateEnemies = function(){
    player.enemyLeft = player.enemyLeft - 1;
    player.enemyText.setText(player.enemyLeft);
    var scaleUp = game.add.tween(player.enemyText.scale).to({ x: 1.2, y: 1.2}, 200, Phaser.Easing.Linear.In);
    var scaleDown = game.add.tween(player.enemyText.scale).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
    scaleUp.start();
    scaleUp.chain(scaleDown);

  };

  player.update = function() {
    move(this);
    game.camera.x = this.x - 150;
    game.camera.y = this.y - 300;
    this.animations.play('runningShoot');
    if (player.health < 0){
      player.kill();
      condition = 2;
      game.state.start("preLevel");
    }
  };

  player.stop = function() {
    this.xDest = this.x;
  };

  player.stopY = function() {
    this.yDest = this.y;
  };

  return player;
};

function Enemy(x, y){
	var enemy = game.add.sprite(x, y, 'characters');
	enemy.frame = 4;

	enemy.xDest = x;
	enemy.yDest = -200;

	enemy.goToXY = function(x){
		enemy.xDest = x;
	}

	enemy.update= function(){
		this.speed = 260;
		move(this);
	}
	enemy.stop = function(p){
		this.kill();
    p.kills = p.kills + 1;
	}

	return enemy;
}

//boss
function boss(x, y){
    var boss = game.add.sprite(x, y, 'Boss');
    boss.frame = 4;
    boss.health = 100;
    boss.xDest = x;
    boss.yDest = -200;

    boss.goToXY = function(x){
        boss.xDest = x;
    }

    boss.update= function(){
        this.speed = 260;
        // this.goToXY(this.x, this.y - 100);

        //enemy.body.velocity.y=-50;
        move(this);
    }


    return boss;
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

function nextLevel(player, noOfKills, curLevelInt){
  var level = 0;
  console.log(player.kills);
  console.log(noOfKills);
  if (player.kills === (noOfKills + 1) && curLevelInt <= 4) {       // add 1 for Boss
    var myJSON = localStorage.getItem("highScore");
    var p = JSON.parse(myJSON);
    p.shift();
    p.unshift(player.score);
    localStorage.setItem("highScore", JSON.stringify(p));
    level = curLevelInt + 1;
    localStorage.setItem("level", parseInt(level));
    condition = 1; // Player won, level up
  } else if (level > 3) {
    condition = 0; // Player won game, finished all levels
    localStorage.setItem("level", 0);
  } else {
    condition = 3; // Player lost, reset level
    localStorage.setItem("level", curLevelInt);
  }

  game.state.start("preLevel");

}



function addLanes(listOfLanes) {
  if (lane == []) {         // if no lane has been assigned, assign listOfLanes to it
    lane = listOfLanes;
  } else {
    for (var i=0; i<listOfLanes.length; i++) {
      if (!(lane.includes(listOfLanes[i]))) {   // add only the non-assigned element to lane
        lane.push(listOfLanes[i]);
      }
    }
  }
}

function addRandomCars(civils, numberOfRandomCars, y) {
  for (var i=0; i < numberOfRandomCars; i++) {
    var x = (lane)[Math.floor(Math.random()*(lane).length)];
    var car = civils.create(x, y, 'characters');
    car.xDest = x;
    car.yDest = -200;
    car.update = function() {
      this.speed = 50;
      move(this);
    };
    car.frame = 6;
    y -= 150;
  }
  return civils;
}

function setSpeed(player, speedUp) {
  if (speedUp){
    player.speed = 400;
  } else {
    player.speed = 280;
  }
}

function addMotorbikes(motorbikes, numberOfMotorbikes, y) {
  for (var i=0; i < numberOfMotorbikes; i++) {
    var motorLanes = [10,435];
    var x = (motorLanes)[Math.floor(Math.random()*(motorLanes).length)];
    var motor = motorbikes.create(x, y, 'motorbike');
    motor.xDest = x;
    motor.yDest = -1000;
    motor.update = function() {
      this.speed = 0;
      move(this);
    };
    motor.frame = 6;
    y += 1500;
  }
  return motorbikes;
}

function countDown() {
  second--;
}
