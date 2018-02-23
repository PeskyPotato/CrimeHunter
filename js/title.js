titleState = {
  // Start menu to be implemented
  create: function() {
    game.input.activePointer.capture = true;
    var image = game.add.image(0, 0, 'title');

    //game.state.start('play'); // Here until menu set-up
  },
  // Input listener for menu
  update: function() {
    if (game.input.activePointer.isDown){
      game.state.start('play');
    }

  }
}
