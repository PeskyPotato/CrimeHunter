var PlayerState = {

    create: function () {
        this.keyboard = game.input.keyboard;
        this.player = game.add.sprite(16, 16, 'player1');
        game.physics.enable(this.player, Phaser.Physics.ARCADE);

        //cursors = game.input.keyboard.createCursorKeys(); //keyboard move

        /**player.body.collideWorldBounds = true;  // world collide limit
         player.body.setSize(20, 32, 5, 16);

         player.animations.add('left', [0, 1, 2, 3], 10, true);
         player.animations.add('turn', [4], 20, true);
         player.animations.add('right', [5, 6, 7, 8], 10, true);

         game.camera.follow(player);

         **/
    },

    update: function () {
       // game.physics.arcade.collide(player, layer);  // ground collide
        //player.body.velocity.x = 0; // move speed

        /** if (cursors.left.isDown)
         {
             player.body.velocity.x = -150;

             if (facing != 'left')
             {
                 player.animations.play('left');
                 facing = 'left';
             }
         }
         else if (cursors.right.isDown)
         {
             player.body.velocity.x = 150;

             if (facing != 'right')
             {
                 player.animations.play('right');
                 facing = 'right';
             }
         }
         else
         {
             if (facing != 'idle')
             {
                 player.animations.stop();

                 if (facing == 'left')
                 {
                     player.frame = 0;
                 }
                 else
                 {
                     player.frame = 5;
                 }

                 facing = 'idle';
             }
         }

         },**/


    }

};