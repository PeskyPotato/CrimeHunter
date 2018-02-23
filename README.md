# CodeFarmer
[![Join the chat at https://gitter.im/_CodeFarmer/Lobby](https://badges.gitter.im/_CodeFarmer/Lobby.svg)](https://gitter.im/_CodeFarmer/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Prototype
[YouTube Demo](https://www.youtube.com/watch?v=Vm7XSoXGqyI)

### Running the game
To run the game a local host must be created, one of the ways to do this is through python.

Clone the repository using:
`git clone https://github.com/LameLemon/CodeFarmer.git`

For Python2 run the following command in the CodeFarmer folder:
`python -m SimpleHTTPServer`
For Python3 run the following command in the CodeFarmer folder:
`python3 -m http.server`

Both of these commands create a simple webserver in the CodeFarmer directory using the loopback IP on port 8000.
To play the game open your browser and type in `127.0.0.1:8000`.

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
* [Darasy Reth](https://github.com/darasy) - Game Objects Movements / Code Review
* [Yizhou](https://github.com/sunyizhou) - Game Environment / Game Objects
* [Gary Dos Santos](https://github.com/LameLemon) - In-Game Physics / Code Review / Graphics, Animation and Sound
* [Lin](https://github.com/linlinlin3) - Game Environment/Graphics, Animation and Sound
* [Jiayi Zheng](https://github.com/JiayiZheng) - In-Game Physics / Game Objects / Game Environment

More information on the team roles can be found on the [Wiki](https://github.com/LameLemon/CodeFarmer/wiki/Team-Roles)
