var playState = {
  // Global variables declaration
  enemy: null,
  enemies: null,

  // Instantiate and assign game objects
  create: function() {
	  
	// Enemy
	this.enemies = game.add.group();
	this.enemies.add(Enemy(250, 250));
	this.enemies.forEach(function(enemy, index){
		game.physics.enable(enemy,Phaser.Physics.ARCADE);
		enemy.body.immovable = true;
	});
  },

  // Anything that needs to be checked
  // Collisions, user input etc...
  update: function() {
	 //Enemy update
	this.enemies.forEach(function(enemy, index){
		enemy.update();
	 });

	 
  },
};

// Helper functions go below
function Enemy(x, y){
	var enemy = game.add.sprite(x, y, 'enemy'); //x=480 y=360
	//enemy.speed= 7000;
	enemy.update= function(){	
		enemy.body.velocity.y=-50;
	}
	return enemy;
}
