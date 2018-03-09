var playBut;
var scoreBut;
var backBut;
var scoreBoard;
var titleText;

titleState = {
  // Start menu to be implemented
  create: function() {

    // console.log(localStorage.getItem("highScore") + " :");
    //
    // if (localStorage.getItem("highScore") === null){
    //   console.log("here");
    //   var score = [];
    //   var myJSON = JSON.stringify(score);
    //   localStorage.setItem("highScore", myJSON);
    // }
    //
    // console.log(localStorage.getItem("highScore"));
    //
    // titleAction();

    var s = localStorage.getItem("highScore");

    if (!s) {
      console.log("1");
      var score = [];
      var myJSON = JSON.stringify(score);
      localStorage.setItem("highScore", myJSON);
      titleAction();
    } else {
      titleAction();
    }

  },
  // Input listener for menu
  update: function() {
  }
}


function titleAction() {
  if (backBut !== undefined){
      backBut.kill();
  }

  if (scoreBoard !== undefined){
    scoreBoard.destroy();
  }

  titleText = game.add.text(60, 20, "Crime Hunter!", { font: "50px", fill: "#ffffff", align: "centre" });
  game.stage.backgroundColor = '#004141';

  playBut = game.add.button(200, 100, 'playButton', playAction, this, 2, 1, 0);
  scoreBut = game.add.button(200, 140, 'scoreButton', scoreAction, this, 2, 1, 0);
}

function scoreAction() {
  playBut.kill();
  scoreBut.kill();
  titleText.destroy();

  scoreBoard = new ScoreBoard(this.game);

  console.log(localStorage.getItem("highScore"))
  var scores = JSON.parse(localStorage.getItem("highScore"));

  if (scores.length > 5) {
    scores.shift();
    localStorage.setItem("highScore", JSON.stringify(scores));
  }

  scoreBoard.draw(scores);

  backBut = game.add.button(200, 200, 'backButton', titleAction, this, 2, 1, 0);

  game.stage.backgroundColor = '#004141';
}

function playAction() {
  game.state.start('play');
}
