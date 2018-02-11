const id = require('uuid/v4');
const utils = require('./../utils/utils.js');
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const Player = require('../player/player.js');
const PlayerType = require('../global_variables/enums/playerType.js');




/**
 * @namespace GameFramework
 * @name Pawn
 * @typedef {Phaser.Sprite} Pawn
 * @classdesc Extends sprite class to provide integration with a body and some basic movement related utility methods
 * @extends {Phaser.Sprite}
 * @param {Phaser.Game} game - reference to the game where the pawn is being created
 * @param {Number} x - x position where the pawn will be created
 * @param {Number} y  -y position where the pawn will be created
 * @param {String} spriteName - string name of a saved texture
 * @param {Player} owner - player game object representing the owner player
 * @param {Number} ms  - number that denotes how fast does the unit move
 */
const Pawn = function (game, x, y, spriteName, player, attributes) {
    //parent constructor
    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y,'frames',spriteName);
    game.add.existing(this);
    game.physics.p2.enable(this);
    this.body.mass = 15+Math.random()*45;
    this.body.clearShapes();
    this.body.addCircle(16);
    //this.body.debug = true;
    //this.body.kinematic = true;

    //set the owner of the unit type checking
    if (player) {
        this.owner = player;
    } else {
        this.owner = new Player(PlayerType.IDLE_AI);
    }


    //initialize grid positions
    this.setGridPosition();


    //id initialization
    this._id = id();


    //Attribute initialization
    this.attributes = {};
    if (attributes) {
        this.attributes = attributes;
        if (attributes.health) {
            this.maxHealth = attributes.health;
            this.setHealth(this.maxHealth);
        }
    } else {
        this.attributes.ms = 125;
    }

};

/*        Inheritance required methods            */
Pawn.prototype = Object.create(Phaser.Sprite.prototype);
Pawn.prototype.constructor = Pawn;

//TODO: Find why this breaks pathfinding worker completely, it doesn't seem to make much sense
/*
Pawn.prototype.kill = function(){
    console.log('unit died', this);
    console.log(`Number of units alive: ${this.game._units.length}`);
    Phaser.Sprite.prototype.kill.call(this);
    let index = this.game._units.indexOf(this);
    if(index > -1){
        this.game._units.splice(this, 1);
    }
    this.game._unitIds[this._id] = undefined;
    this.body.destroy();
    this.destroy();
}*/




/**
 * @description - With a static square grid of 64 pixels this takes x,y position of the unit and transforms them to gird points
 * 
 */
Pawn.prototype.setGridPosition = function () {
    //grids are 64 pixels wide
    //divide for gride size and truncate with bitwise operation
    this.gridX = utils.pointToGrid(this.x);
    this.gridY = utils.pointToGrid(this.y);
};



/* Basic movement functions */
Pawn.prototype.move = function (xDir, yDir) {
    if (xDir === 'left') {
        this.body.moveLeft(this.attributes.ms);
    } else if (xDir === 'right') {
        this.body.moveRight(this.attributes.ms);
    }
    if (yDir === 'up') {
        this.body.moveUp(this.attributes.ms);
    } else if (yDir = 'down') {
        this.body.moveDown(this.attributes.ms);
    }
}

/**
 * @description reset x and y velocities to 0
 * 
 */
Pawn.prototype.stop = function () {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}


/* Basic movement functions */

Pawn.prototype.update = function () {
    this.setGridPosition();

};


module.exports = Pawn;