var playBut;
var scoreBut;
var backBut;
var scoreBoard;
var titleText;
var instruction;
var helpText;
var newBut;

titleState = {
	create : function() {

		var s = localStorage.getItem("highScore");
		// list of scores from the player
		var l = localStorage.getItem("level");
		// current level player left on
		var r = localStorage.getItem("returning");
		// is the player returning from an old game?

		if (!s) {
			var score = [];
			var myJSON = JSON.stringify(score);
			localStorage.setItem("highScore", myJSON);
			titleAction();
		} else {
			titleAction();
		}

		if (!l) {
			localStorage.setItem("level", 0);
		} else if (l > 4) {										// Change for more levels
			localStorage.setItem("level", 0);
		}

		if (!r) {
			//Intantiate score to 0, if not returning
			var myJSON = localStorage.getItem("highScore");
			console.log(myJSON);
			var p = JSON.parse(myJSON);
			p.unshift(0);
			localStorage.setItem("highScore", JSON.stringify(p));
			console.log(localStorage.getItem("highScore"));
			localStorage.setItem("returning", 1);
		} else {
			// do nothing, use latest score
		}

	},
	// Input listener for menu
	update : function() {
		//game.state.start('preLevel');

	}
}

function titleAction() {

	if (backBut !== undefined) {
		backBut.kill();
	}

	if (scoreBoard !== undefined) {
		scoreBoard.destroy();
	}

	if (instruction !== undefined) {
		instruction.destroy();
	}

	if (helpText !== undefined) {
		helpText.destroy();
	}
	//
	// titleText = game.add.text(game.world.centerX, 40, "Crime Hunter!", { font: "50px", fill: "#ffffff", align: "center" });
	// titleText.anchor.setTo(.5, .5);
	game.stage.backgroundColor = '#0';

	titleText = game.add.image(game.world.centerX, 45, 'title-header');
	titleText.anchor.setTo(.5, .5);

	newBut = game.add.button(game.world.centerX, 110, 'newButton', newAction, this, 2, 1, 0);
	playBut = game.add.button(game.world.centerX, 150, 'playButton', playAction, this, 2, 1, 0);
	helpBut = game.add.button(game.world.centerX, 190, 'helpButton', helpAction, this, 2, 1, 0);
	scoreBut = game.add.button(game.world.centerX, 230, 'scoreButton', scoreAction, this, 2, 1, 0);
	playBut.anchor.setTo(.5, .5);
	scoreBut.anchor.setTo(.5, .5)
	helpBut.anchor.setTo(.5, .5)
	newBut.anchor.setTo(.5, .5)
}

function helpAction() {
	playBut.kill();
	scoreBut.kill();
	helpBut.kill();
	titleText.destroy();
	newBut.kill();

	helpText = game.add.text(game.world.centerX, 20, "Help Here!", {
		font : "40px",
		fill : "#ffffff",
		align : "centre"
	});
	instruction = game.add.image(game.world.centerX, game.world.centerY, 'help_Screen');
	helpText.anchor.setTo(.5, .5);
	//instruction.scale.set(1,1);
	instruction.anchor.setTo(.5, .5);

	backBut = game.add.button(game.world.centerX, 340, 'backButton', titleAction, this, 2, 1, 0);
	backBut.anchor.setTo(.5, .5);
	backBut.scale.set(0.6, 0.6);

	game.stage.backgroundColor = '#0';
}

function scoreAction() {
	playBut.kill();
	scoreBut.kill();
	helpBut.kill();
	titleText.destroy();
	newBut.kill();

	scoreBoard = new ScoreBoard(this.game);

	console.log(localStorage.getItem("highScore"))
	var scores = JSON.parse(localStorage.getItem("highScore"));

	if (scores.length > 5) {
		//scores.shift();
		scores = scores.splice(0, 5);
		localStorage.setItem("highScore", JSON.stringify(scores));
	}

	scoreBoard.draw(scores);

	backBut = game.add.button(game.world.centerX, 220, 'backButton', titleAction, this, 2, 1, 0);
	backBut.anchor.setTo(.5, .5);
	game.stage.backgroundColor = '#0';
}

function playAction() {
	var modal = document.getElementById('myModal');

	var close_modal = document.getElementsByClassName("close")[0];

	modal.style.display = "block";
	close_modal.onclick = function() {
		modal.style.display = "none";
		game.state.start('preLevel');

	}
	// when anyhwere else in the window is clicked
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	var vehicles = "<option selected='selected'></option><option>Vehicle1</option>	<option>Vehicle2</option><option>Vehicle2</option><option>Vehicle2</option><option>Vehicle2</option><option>Vehicle2</option>";
	document.getElementById("vehicle").innerHTML = vehicles;

	//YOU NEED TO CHANGE THIS TO MEET YOUR SPECIFICATION
	var MAX_BULLET_SPEED =1000;
	var enemy_slider = document.getElementById("enemy_range");
	document.getElementById("enemy_range").setAttribute("max", MAX_BULLET_SPEED);
	var enemy_slider_val = document.getElementById("valEnemy");
	enemy_slider_val.innerHTML = enemy_slider.value;

	enemy_slider.oninput = function() {
		//enemy's bullet speed. YOU MIGHT WANT TO MODIFY THIS TO MAKE IT GLOBALLY ACCESSIBLE
		var bullets_speed_enemy = this.value;
		enemy_slider_val.innerHTML = bullets_speed_enemy;
	}
	var player_slider = document.getElementById("player_range");

	document.getElementById("player_range").setAttribute("max", MAX_BULLET_SPEED);

	var player_slider_val = document.getElementById("valPlayer");
	player_slider_val.innerHTML = player_slider.value;

	player_slider.oninput = function() {
		//player's bullet speed. YOU MIGHT WANT TO MODIFY THIS TO GLOBALLY ACCESSIBLE
		var bullets_speed_player = this.value;
		player_slider_val.innerHTML = bullets_speed_player;
	}
}

function myFunction() {
	var selectedVehicle = document.getElementById("vehicle");

	if (selectedVehicle != null) {
		var c = selectedVehicle.value + " color: ";

		/* YOU NEED TO MODIFY THIS TO MATCHES YOUR SPECIFICATION.
		 IF THERE IS A FUNCTION THAT HOLD ALL THE APPEARANCE YOU CAN JUST CALL THAT FROM HERE.
		 */
		var vehicle_appearance_options = "<br/><label>" + c + " </label><select> <option>green</option><ption>red</option><option>blue</option><option>white</option><option>green</option><option>gray</option> </select>";

		document.getElementById("vehicleColor").innerHTML = vehicle_appearance_options;
	}
}

function newAction() {
	localStorage.setItem("level", 0);
	// Set level to 0
	var myJSON = localStorage.getItem("highScore");
	console.log(myJSON);
	var p = JSON.parse(myJSON);
	p.unshift(0);
	localStorage.setItem("highScore", JSON.stringify(p));
	console.log(localStorage.getItem("highScore"));
	localStorage.setItem("returning", 1);
	game.state.start('preLevel');
}
