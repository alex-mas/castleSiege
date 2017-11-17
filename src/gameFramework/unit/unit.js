const pf = require('pathfinding');
const Pawn = require('../pawn/pawn.js');

Unit = function (game, x, y, spriteName, owner, attributes) {
    //parent constructor
    if (attributes.ms) {
        Pawn.call(this, game, x, y, spriteName, owner, attributes.ms);
    } else {
        Pawn.call(this, game, x, y, spriteName, owner);
    }
    game.add.existing(this);
    //TODO: Make an AI Brain class to implement the logic and then inport it into units via the owner argument
    if (owner = 'AI') {
        /*this.owner = new Brain();*/
    }
    this.att = attributes;
    this.orders = [];
    this.currentOrder = undefined;
    this.pathfinder.grid =new pf.Grid(this.game.grid.collisionGrid);
}

Unit.prototype = Object.create(Pawn.prototype);
Unit.prototype.constructor = Unit;


//TODO: Finish this method after finishing the brain order giving
Unit.prototype.computeMove = function (x, y) {
    var targetX = (x / 64) | 0;
    var targetY = (y / 64) | 0;
    this.currentOrder.points = this.findPath(x, y);
}


//TODO: Make shorter?
//TODO2: Think if the else logic should be put in a concludeOrder case 
Unit.prototype.executeMove = function () {

    if (this.currentOrder.points.length > 0) {
        console.log(this.currentOrder);
        //determine what is the next step in grid points
        var nextMoveStep = this.currentOrder.points[0];
        //check if the pawn is inside the grid coordinates of the next point
        if (this.gridX === nextMoveStep[0] && this.gridY === nextMoveStep[1]) {
            //remove the next point from the points array and reassign next step
            this.currentOrder.points.splice(0, 1);
            nextMoveStep = this.currentOrder.points[0];
        }
        console.log(this.currentOrder);
        //iterate deciding the direction to move
        var targetX = 32 + (this.currentOrder.points[0][0] * 64);
        var targetY = 32 + (this.currentOrder.points[0][1] * 64);
        if (this.x > targetX) {
            this.move('left');
        } else if (this.x < targetX) {
            this.move('right');
        } if (this.y > targetY) {
            this.move('up');
        } else if (this.y < targetY) {
            this.move('down');
        }

    } else {
        this.stop();
        this.currentOrder = undefined;
        console.log(this.currentOrder);
        console.log(this.body);
        this.orders.splice(0, 1);
    }
}

Unit.prototype.pathfinder = {
    //TODO: update the grid each time it changes up to each frame
    AStarFinder: new pf.AStarFinder(),
    BestFirstFinder: new pf.BestFirstFinder(),
    BreadthFirstFinder: new pf.BreadthFirstFinder(),
    DijkstraFinder: new pf.DijkstraFinder(),
    IDAStarFinder: new pf.IDAStarFinder(),
    JumpPointFinder: new pf.JumpPointFinder(),
    BiAstarFinder: new pf.BiAStarFinder(),
    BiBestFirstFinder:  new pf.BiBestFirstFinder(),
    BiBreadthFirstFinder: new pf.BiBreadthFirstFinder(),
    BiDijkstraFinder: new pf.BiDijkstraFinder()

};


//TODO: make this more performant --> if grid hasn't been modified do nothing in the body of this function besides checking a boolean.
Unit.prototype.updateGrid = function () {
    this.pathfinder.grid = new pf.Grid(this.game.grid.collisionGrid);
}


//TODO: Call this from the brain instance of the unit to give the order.
Unit.prototype.findPath = function (x, y, method) {
    var targetX = (x / 64) | 0;
    var targetY = (y / 64) | 0;
    var grid = this.pathfinder.grid;
    var pathArray;
    if (method) {
        pathArray = this.pathfinder[method].findPath(this.gridX, this.gridY, targetX, targetY, grid);
    } else {
        pathArray = this.pathfinder.AStarFinder.findPath(this.gridX, this.gridY, targetX, targetY, grid);
    }
    return pathArray;
}

//TODO: Function to handle removing the current order when its finished
Unit.prototype.concludeOrder = function () {

}

Unit.prototype.executeOrders = function () {

    if (this.currentOrder = undefined) {
        //check if the order queue has elements
        if (this.orders[0] !== undefined) {
            //give the pawn its next order
            this.currentOrder = this.orders[0];
        }

    } else {
        //Check each possible case and perform its appropiate action either do nothing.
        switch (this.currentOrder.type) {
            case 'movement':
                if (this.currentOrder.computed) {
                    this.executeMove();
                } else {
                    this.computeMove();
                }


        }

    }
}



Unit.prototype.update = function () {
    this.updateGrid();
    this.executeOrders();
}



module.exports = Unit;