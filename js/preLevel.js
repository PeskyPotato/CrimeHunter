var levelText;
var preLevelState = {
  create: function() {
    game.stage.backgroundColor = "#eeeee";
    l = localStorage.getItem("level");
    console.log(typeof l )
    var enemies = 5;
    if (l == "0") {
      enemies = 1;
    } else if (l === "1") {
        enemies = 2;
    } else if (l === "2"){
      enemies = 3;
    }
    if ( l <= 2) {
      levelText = game.add.text(145, 110, "Level " + l, { font: "50px", fill: "#ffffff", align: "centre" });
      levelText1 = game.add.text(130, 180, "Kill " + enemies + " enemies", { font: "30px", fill: "#ffffff", align: "centre" });

      game.time.events.add(Phaser.Timer.SECOND * 2, fadePicture, this);

    } else {
      levelText = game.add.text(120, 110, "More levels soon...", { font: "35px", fill: "#ffffff", align: "centre" });


    }
  }
}

function fadePicture() {
    game.add.tween(levelText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    game.state.start('play');

}
