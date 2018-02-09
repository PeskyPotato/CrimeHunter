# CodeFarmer
[![Join the chat at https://gitter.im/_CodeFarmer/Lobby](https://badges.gitter.im/_CodeFarmer/Lobby.svg)](https://gitter.im/_CodeFarmer/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Project Description

### Minimal Viable Product
* The 2D game is to be developed in JavaScript using the Phaser library which will then be released on a web platform upon completion.
* The gameplay will include the user navigating a busy street with the goal of shooting down the targeted vehicle. If the bullet fired by the user hits the target vehicle, the program will detect the collision and score will be increased.
* The script will be able to detect collisions between vehicles and health points will be deducted based on the severity of the impact.
* Non-player characters (NPC) should be able to navigate the screen without crashing into the user's vehicle. Unless the crash was initiated by the user. Through the co-ordinate systems the NPCs will be able to actively try and avoid the user's vehicle.
* As the score increases, the difficulty does too. The game speeds up, more instances of NPCs, more targeted vehicles and limited visibility.
* In-game physics models will be used to angle bullets fired by the user to give a sense of realism.

### Add-on Features
* A 3D version of the game, where the user has a third-person point-of-view.
* A version that is playable on mobile and can be published to an app store.
* Multiplayer functionality locally or through the internet.

## User Story
* I want to be able to drive my vehicle through the street in between other cars.
* I want to be able to fire bullets at anything I point to.
* I want to be able to level-up.
* I want to see all my high-scores from previous games.
* I want to be able to save my game progress.

## Team Roles
* [Darasy Reth](https://github.com/darasy) - Game Objects/Graphics, Animation and Sound
* [Yizhou](https://github.com/sunyizhou) - Game Environment/Game Objects
* [Gary Dos Santos](https://github.com/LameLemon) - In-Game Physics/Code Review
* [Lin](https://github.com/linlinlin3) - Game Environment/Graphics, Animation and Sound
* [Jiayi Zheng](https://github.com/JiayiZheng) - In-Game Physics/Game Objects

### Role Descriptions
* In-Game Physics:
  * Bullet mechanics
  * Handling collisions between vehicles
  * Sliding on turns
* Game Objects:
  * Creating game object and properties (i.e. User health, co-ordinate location etc...)
  * Tracking and updating movements on screen (in coordination with animation)
  * Link graphics and animation to relevant object
* Game Environment:
  * Orchestrate NPC movements during gameplay (avoid crashes as much as possible)
  * Setup vehicles, road conditions etc...
* Graphics, Animation and Sound
  * Works in coordination with Game objects to display appropriate vehicles
  * Rendering frames that is supported by the browser
  * Animate movements of vehicles smoothly
  * Sound design and application during gameplay
