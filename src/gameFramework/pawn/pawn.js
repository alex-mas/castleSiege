window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');



//custom class that extends from Phaser.Sprite
Pawn = function (game, x, y, spriteName, owner, ms) {
    //parent constructor
    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, spriteName);

    game.add.existing(this);

    //TODO: Make an AI Brain class to implement the logic and then inport it into units via the owner argument
    this.owner = owner;

    //grid position attributes and methods
    this.setGridPosition();

    //general attributes
    this.ms = ms || 50;

};

/*        Inheritance required methods            */
Pawn.prototype = Object.create(Phaser.Sprite.prototype);
Pawn.prototype.constructor = Pawn;


//TODO: Make a method in another module to convert points to grid points
Pawn.prototype.setGridPosition = function () {
    //grids are 64 pixels wide
    //divide for gride size and truncate with bitwise operation
    this.gridX = (this.x / 64) | 0;
    this.gridY = (this.y / 64) | 0;
};


/* Basic movement functions */
Pawn.prototype.move = function (xDir,yDir){
        if(xDir === 'left'){
            this.body.moveLeft(this.ms);
        }else if (xDir === 'right'){
            this.body.moveRight(this.ms);
        }
        if(yDir === 'up'){
            this.body.moveUp(this.ms);
        }else if(yDir = 'down'){
            this.body.moveDown(this.ms);
        }

}

Pawn.prototype.stop = function (){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}


/* Basic movement functions */

Pawn.prototype.update = function () {
    this.setGridPosition();

};


module.exports = Pawn;