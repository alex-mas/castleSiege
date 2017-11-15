var pf = require('pathfinding');
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');



//custom class that extends from Phaser.Sprite
Pawn = function (game, x, y, spriteName, ms, owner) {
    //parent constructor
    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, spriteName);

    game.add.existing(this);

    //TODO: Make an AI Brain class to implement the logic and then inport it into units via the owner argument
    this.owner = owner;

    //TODO: Abstract and refactor the movement logic into methods or subclasses
    //Reimaining moves
    this.orderQueue = [];
    this.currentOrder;

    //grid position attributes and methods
    this.gridX;
    this.gridY;
    this.setGridPosition();

    //general attributes
    this.ms = ms;

};


Pawn.prototype = Object.create(Phaser.Sprite.prototype);
Pawn.prototype.constructor = Pawn;

Pawn.prototype.pathfinder = new pf.AStarFinder();

//TODO: Make a method in another module to convert points to grid points
Pawn.prototype.setGridPosition = function () {
    //grids are 64 pixels wide
    //divide for gride size and truncate with bitwise operation
    this.gridX = (this.x / 64) | 0;
    this.gridY = (this.y / 64) | 0;

};

//TODO: externalize order giving to a brain class
Pawn.prototype.orderMove = function (x, y) {
    //set grid points
    var targetX = (x / 64) | 0;
    var targetY = (y / 64) | 0;
    //find the path
    var grid = new pf.Grid(this.game.grid.collisionGrid);
    var moveOrder = this.pathfinder.findPath(this.gridX,this.gridY,targetX,targetY,grid);
    //push the path movements to the orderQueue
    this.orderQueue.push({
        moveOrder,
        type: 'movement'
    });
};


Pawn.prototype.move = function (){
    //determine what is the next step in grid points
    var nextMoveStep = this.currentOrder.moveOrder[0];
    //check if the pawn is inside the grid coordinates of the next point
    if (this.gridX === nextMoveStep[0] && this.gridY === nextMoveStep[1]) {
        //remove the next point from the moveOrder array and reassign next step
        this.currentOrder.moveOrder.splice(0, 1);
        nextMoveStep = this.currentOrder.moveOrder[0];
    }
    console.log(this.currentOrder.moveOrder);
    //
    if (this.currentOrder.moveOrder.length > 0) {
        var targetX = 32+(this.currentOrder.moveOrder[0][0] * 64);
        var targetY = 32+(this.currentOrder.moveOrder[0][1] * 64);
        if(this.x > targetX){
            this.body.moveLeft(50);
        }else if (this.x < targetX){
            this.body.moveRight(50);
        }
        if(this.y > targetY){
            this.body.moveUp(50);
        }else if(this.y < targetY){
            this.body.moveDown(50);
        }

    }
}

Pawn.prototype.moveNew = function (xDir,yDir){
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

Pawn.prototype.update = function () {
    this.setGridPosition();
    if(currentOrder.type === 'movement'){
        this.move();
    }


};


module.exports = Pawn;