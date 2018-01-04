const logger = require('../../dev_modules/logger.js');
const pf = require('pathfinding');
const Pawn = require('../pawn/pawn.js');
const Brain = require('../brain/brain.js');
const utils = require('../utils/utils.js');
const Player = require('../player/player.js');


/**
 * @typedef {Pawn} Unit
 * @param {Phaser.Game} game - reference to the game where the unit is being instantiated
 * @param {Number} x - x point where the unit is being created
 * @param {Number} y - y point where the unit is being created 
 * @param {String} spriteName - string referencing a certain sprite (sprites are stored in string variables inside Phaser)
 * @param {Player} owner - String/object to identify the owner of the unit
 * @param {Object} attributes  - object that holds all attributes that might want to be specified for the instantianted unit
 */
Unit = function (game, x, y, spriteName, player, attributes) {
    //parent constructor
    if (attributes) {
        Pawn.call(this, game, x, y, spriteName, player, attributes);
    } else if (player) {
        Pawn.call(this, game, x, y, spriteName, player);
    } else {
        Pawn.call(this, game, x, y, spriteName);
    }

    //initialize properties
    this.orders = [];
    this.currentOrder = undefined;
    this.pathfinder.grid = new pf.Grid(this.game.grid.collisionGrid);
    //TODO: Give empty brain to units
}

Unit.prototype = Object.create(Pawn.prototype);
Unit.prototype.constructor = Unit;


/**
 * 
 * 
 * @param {Number} x - Grid number where the unit will be ordered to move
 * @param {Number} y - Grid Y number where the unit will be ordered to move
 */
Unit.prototype.computeMove = function (x, y) {
    var targetX = utils.pointToGrid(x),
        targetY = utils.pointToGrid(y);
    this.currentOrder.points = this.findPath(x, y);
    this.currentOrder.computed = true;
}


//TODO: Make shorter?
//TODO2: Think if the else logic should be put in a concludeOrder case
/**
 * Function responsible for executing a move order
 */
Unit.prototype.executeMove = function () {
    if (this.currentOrder.points.length > 0) {
        //determine what is the next step in grid points
        let nextMoveStep = this.currentOrder.points[0];
        //check if the pawn is inside the grid coordinates of the next point
        if (this.gridX === nextMoveStep[0] && this.gridY === nextMoveStep[1]) {
            //remove the next point from the points array and reassign next step
            this.currentOrder.points.splice(0, 1);
            nextMoveStep = this.currentOrder.points[0];
        }
        if (this.currentOrder.points.length > 0) {
            //iterate deciding the direction to move
            let xDir,
                yDir;
            const targetX = utils.gridToPoint(nextMoveStep[0], true),
                targetY = utils.gridToPoint(nextMoveStep[1], true);
            if (this.body.x > targetX) {
                xDir = 'left';
            } else if (this.body.x < targetX) {
                xDir = 'right';
            }
            if (this.body.y > targetY) {
                yDir = 'up';
            } else if (this.body.y < targetY) {
                yDir = 'down'
            }
            this.move(xDir, yDir);
        } else {
            this.clearOrder();
        }


    } else {
        this.clearOrder();
    }
}

Unit.prototype.pathfinder = {
    //TODO: update the grid each time it changes up to each frame
    AStarFinder: new pf.AStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true
    }),
    BestFirstFinder: new pf.BestFirstFinder(),
    BreadthFirstFinder: new pf.BreadthFirstFinder(),
    DijkstraFinder: new pf.DijkstraFinder(),
    IDAStarFinder: new pf.IDAStarFinder(),
    JumpPointFinder: new pf.JumpPointFinder(),
    BiAstarFinder: new pf.BiAStarFinder(),
    BiBestFirstFinder: new pf.BiBestFirstFinder(),
    BiBreadthFirstFinder: new pf.BiBreadthFirstFinder(),
    BiDijkstraFinder: new pf.BiDijkstraFinder()

};


//TODO: make this more performant --> if grid hasn't been modified do nothing in the body of this function besides checking a boolean.
Unit.prototype.updateGrid = function () {
    this.pathfinder.grid = new pf.Grid(this.game.grid.collisionGrid);
}





/**
 * 
 * @description Finds a path in a grid from the position of the unit to the target (x,y) coordinates
 * @param {any} x - X position to go
 * @param {any} y - Y position to go
 * @param {any} method - Pathfinding method used to find the path
 * @returns {Array[Array[Number]} Path in terms of x,y pairs
 */
Unit.prototype.findPath = function (x, y, method){
    const targetX = utils.pointToGrid(x),
        targetY = utils.pointToGrid(y);
    let grid = this.pathfinder.grid,
        pathArray;
    //if method is provided we use that one to find the path, else we fallback to A*
    if (method) {
        pathArray = this.pathfinder[method].findPath(this.gridX, this.gridY, targetX, targetY, grid);
    } else {
        pathArray = this.pathfinder.AStarFinder.findPath(this.gridX, this.gridY, targetX, targetY, grid);
    }
    return pathArray;
}

Unit.prototype.clearOrders = function () {
    this.stop();
    this.currentOrder = undefined;
    this.orders = [];
}

//TODO: revise and get your shit together about where to do each task in terms of resetting orders
Unit.prototype.clearOrder = function () {
    this.stop();
    this.currentOrder = undefined;
    this.orders.splice(0, 1);
}

//TODO: implement - Adds the given order to the list of orders if its valid
Unit.prototype.pushOrder = function(order) {
    const isValid = this.isOrderValid(order);
    if(isValid){
        this.orders.push(order);
    }else{
        console.warn(`Invalid order provided to ${this}`);
    }
//TODO: validate
this.orders.push(order);
}

//TODO: implement - checks for necessary characteristics of diferent order archetypes
Unit.prototype.isOrderValid = function(order){
    let isValid = false;
//validate
    return isValid;
}



Unit.prototype.executeOrders = function () {
    if (!this.currentOrder) {
        //check if the order queue has elements
        if (this.orders[0] !== undefined) {
            //give the pawn its next order
            //WARNING: we keep the original order of the array intact, that is, we might just stay in a bucle giving ourselves the same order over and over
            //TODO: decide if we splice it on each order bases or we do it centralized here and if we do it here try to make the change without breaking the code
            this.currentOrder = this.orders[0];

        } else {
            return;
        }

    }
    //Check each possible case and perform its appropiate action either do nothing.
    switch (this.currentOrder.type) {
        case 'staticMovement':
            if (this.currentOrder.computed) {
                this.executeMove();
            } else {
                this.computeMove(this.currentOrder.x, this.currentOrder.y);
            }
            break;
        //WARNING: dynamic movement never ends because the unit collision doesn't allow it to reach the other unit
        case 'dynamicMovement':
            //check if we have arrived at destination
            const targetX = this.currentOrder.target.gridX,
                targetY = this.currentOrder.target.gridY;
            if (this.gridX === targetX && this.gridY === targetY) {
                this.clearOrder();
            } else {
                //check if target has moved from its grid position
                if (this.currentOrder.points === undefined || targetX !== this.currentOrder.points[this.currentOrder.points.length - 1][0] ||
                    targetY !== this.currentOrder.points[this.currentOrder.points.length - 1][1]) {
                    this.computeMove(this.currentOrder.target.x, this.currentOrder.target.y);
                }
                this.executeMove();
            }
            break;


    }
}


//TODO: determine if the unit should be destroyed with pooling
Unit.prototype.update = function () {
    //console.log('updating unit');
    Pawn.prototype.update.call(this);
    this.updateGrid();
    this.executeOrders();
}



module.exports = Unit;