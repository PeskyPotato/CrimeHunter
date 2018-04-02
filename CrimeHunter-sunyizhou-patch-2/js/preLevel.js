var levelText;
var condition;

var preLevelState = {
  create: function() {
    game.stage.backgroundColor = "#eeeee";
    l = localStorage.getItem("level");
    //console.log("l "+ l )
    var enemies = 5;
    if (l == "0") {
      enemies = 1;
    } else if (l === "1") {
        enemies = 2;
    } else if (l === "2"){
      enemies = 3;
    }

    if ( l <= 2) {
      if (condition == 2) {         // Player had died, restart level
        levelText = game.add.text(game.world.centerX, 110, "Level " + l, { font: "50px", fill: "#ffffff", align: "centre" });
        levelText1 = game.add.text(game.world.centerX, 180, "Kill " + enemies + " enemies", { font: "30px", fill: "#ffffff", align: "centre" });
        levelText2 = game.add.text(game.world.centerX, 220, "You died", { font: "30px", fill: "#ffffff", align: "centre"});
        levelText.anchor.setTo(.5, .5);
        levelText1.anchor.setTo(.5, .5);
        levelText2.anchor.setTo(.5, .5);

      } else if (condition == 1) {  // Player won, level up
        levelText = game.add.text(game.world.centerX, 110, "Level " + l, { font: "50px", fill: "#ffffff", align: "centre" });
        levelText1 = game.add.text(game.world.centerX, 180, "Kill " + enemies + " enemies", { font: "30px", fill: "#ffffff", align: "centre" });
        levelText2 = game.add.text(game.world.centerX, 220, "You won", { font: "30px", fill: "#ffffff", align: "centre"});
        levelText.anchor.setTo(.5, .5);
        levelText1.anchor.setTo(.5, .5);
        levelText2.anchor.setTo(.5, .5);

      } else if (condition == 3) {
        levelText = game.add.text(game.world.centerX, 110, "Level " + l, { font: "50px", fill: "#ffffff", align: "centre" });
        levelText1 = game.add.text(game.world.centerX, 180, "Kill " + enemies + " enemies", { font: "30px", fill: "#ffffff", align: "centre" });
        levelText2 = game.add.text(game.world.centerX, 220, "You lose, try again", { font: "30px", fill: "#ffffff", align: "centre"});
        levelText.anchor.setTo(.5, .5);
        levelText1.anchor.setTo(.5, .5);
        levelText2.anchor.setTo(.5, .5);

      } else {
        levelText = game.add.text(145, 110, "Level " + l, { font: "50px", fill: "#ffffff", align: "centre" });
        levelText1 = game.add.text(130, 180, "Kill " + enemies + " enemies", { font: "30px", fill: "#ffffff", align: "centre" });
      }

      game.time.events.add(Phaser.Timer.SECOND * 5, fadePicture, this);

    } else {
      levelText = game.add.text(game.world.centerX, 110, "You won! Restarting...", { font: "30px", fill: "#ffffff", align: "centre"});
      levelText.anchor.setTo(.5, .5);
      localStorage.setItem("level", 0);
      game.time.events.add(Phaser.Timer.SECOND * 5, fadePicture, this);
      localStorage.setItem("returning", null);
      // Reset score to 0 after winning, new spot on score boar
      var myJSON = localStorage.getItem("highScore");
      console.log(myJSON);
      var p = JSON.parse(myJSON);
      p.unshift(0);
      localStorage.setItem("highScore", JSON.stringify(p));
      console.log(localStorage.getItem("highScore"));
      localStorage.setItem("returning", 1);
    }
  }
}

function fadePicture() {
    game.add.tween(levelText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    game.state.start('play');
    condition = null;

}
