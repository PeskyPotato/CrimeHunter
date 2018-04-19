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
		} else if (l > 3) {// Change for more levels
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
	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the button that opens the modal
	//var btn = document.getElementById("displayModal");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks the button, open the modal
	//btn.onclick = function() {
	modal.style.display = "block";
	//}
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
		game.state.start('preLevel');

	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	var enemy_slider = document.getElementById("enemy_range");
	var enemy_slider_val = document.getElementById("valEnemy");
	enemy_slider_val.innerHTML = enemy_slider.value;
	// Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	enemy_slider.oninput = function() {
		enemy_slider_val.innerHTML = this.value;
	}
	
	var player_slider = document.getElementById("player_range");
	var player_slider_val = document.getElementById("valPlayer");
	player_slider_val.innerHTML = player_slider.value;

	player_slider.oninput = function() {
		player_slider_val.innerHTML = this.value;
	}
	
	
	
}
function myFunction(){
	var selectedVehicle = document.getElementById("vehicle");
	

	if (selectedVehicle != null) {
		var c= selectedVehicle.value +" color: ";
		document.getElementById("vehicleColor").innerHTML="<br/><label>"+ c+" </label><select> <option>green</option><ption>red</option><option>blue</option><option>white</option><option>green</option><option>gray</option> </select>";
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
