const logger = require('../../dev_modules/logger.js');
const pf = require('pathfinding');
const Pawn = require('../pawn/pawn.js');
const Brain = require('../brain/brain.js');
const utils = require('../utils/utils.js');

/**
 * @class Unit 
 * @extends {Pawn}
 * @param {Phaser.Game} game - reference to the game where the unit is being instantiated
 * @param {Number} x - x point where the unit is being created
 * @param {Number} y - y point where the unit is being created 
 * @param {String} spriteName - string referencing a certain sprite (sprites are stored in string variables inside Phaser)
 * @param {Any} owner - String/object to identify the owner of the unit
 * @param {Object} attributes  - object that holds all attributes that might want to be specified for the instantianted unit
 */
Unit = function (game, x, y, spriteName, player, attributes) {
    logger.debug('created unit');
    logger.info(`unit attributes: ${JSON.stringify(attributes)}`);

    //parent constructor
    if (attributes) {
        Pawn.call(this, game, x, y, spriteName, player, attributes);
    } else if (player) {
        Pawn.call(this, game, x, y, spriteName, player);
    } else {
        Pawn.call(this, game, x, y, spriteName);
    }
    //game.add.existing(this);

    //set the owner of the unit
    if (player) {
        this.owner = player;
    } else {
        this.owner = "defaultAI";
    }
    //initialize properties
    this.orders = [];
    this.currentOrder = undefined;
    this.pathfinder.grid = new pf.Grid(this.game.grid.collisionGrid);
}

Unit.prototype = Object.create(Pawn.prototype);
Unit.prototype.constructor = Unit;


//TODO: Finish this method after finishing the brain order giving

/**
 * 
 * 
 * @param {Number} x - Grid number where the unit will be ordered to move
 * @param {Number} y - Grid Y number where the unit will be ordered to move
 */
Unit.prototype.computeMove = function (x, y) {
    logger.silly('begining to compute move');
    let targetX = utils.pointToGrid(x),
        targetY = utils.pointToGrid(y);
    console.log(`this is the unit: `, this);
    this.currentOrder.points = this.findPath(x, y);
    logger.debug(`Current order points: ${JSON.stringify(this.currentOrder.points)}`);
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

        logger.debug(`Unit grid x position is : ${this.gridX}`);
        logger.debug(`Unit grid y position is : ${this.gridY}`);
        logger.debug(`next move is going to x grid coordinates: ${nextMoveStep[0]}`);
        logger.debug(`next move is going to Y grid coordinates: ${nextMoveStep[1]}`);
        logger.debug(`Pathing at next point is', ${this.game.grid.collisionGrid[nextMoveStep[0]][nextMoveStep[1]]}`);

        //check if the pawn is inside the grid coordinates of the next point
        if (this.gridX === nextMoveStep[0] && this.gridY === nextMoveStep[1]) {
            //remove the next point from the points array and reassign next step
            logger.debug(`Current order: ${this.currentOrder}`);
            logger.debug(`splicing move point: ${JSON.stringify(nextMoveStep)}`);

            this.currentOrder.points.splice(0, 1);
            nextMoveStep = this.currentOrder.points[0];
        }
        if (this.currentOrder.points.length > 0) {
            //iterate deciding the direction to move
            let xDir,
                yDir,
                targetX = utils.gridToPoint(nextMoveStep[0], true),
                targetY = utils.gridToPoint(nextMoveStep[1], true);

            logger.debug(`Target X point for current movement is: ${targetX}`);
            logger.debug(`Target Y point for current movement is: ${targetY}`);

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
            logger.debug(`Moving direction will be: ${xDir} ${yDir}`);
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
 * 
 * @param {any} x - X position to go
 * @param {any} y - Y position to go
 * @param {any} method - Pathfinding method used to find the path
 * @returns {Array[Array[Number]} Path in terms of x,y pairs
 */
Unit.prototype.findPath = function (x, y, method) {
    logger.debug(`target x point: ${x}`);
    logger.debug(`target y point: ${y}`);

    let targetX = utils.pointToGrid(x),
        targetY = utils.pointToGrid(y),
        grid = this.pathfinder.grid,
        pathArray;

    if (method) {
        logger.debug('method provided');
        pathArray = this.pathfinder[method].findPath(this.gridX, this.gridY, targetX, targetY, grid);
    } else {
        logger.debug('method not provided');
        logger.debug(`target X grid point: ${targetX}`);
        logger.debug(`target y grid point: ${targetY}`);
        logger.debug(`unit grid X position is ${this.grid}`);
        logger.debug(`unit grid Y position is ${this.gridY}`);
        pathArray = this.pathfinder.AStarFinder.findPath(this.gridX, this.gridY, targetX, targetY, grid);
    }
    return pathArray;
}

//TODO: Function to handle removing the current order when its finished
Unit.prototype.clearOrders = function () {
    this.stop();
    this.currentOrder = undefined;
    this.orders = [];
}
Unit.prototype.clearOrder = function () {
    this.stop();
    this.currentOrder = undefined;
    this.orders.splice(0, 1);
}


//wtf?
Unit.prototype.concludeOrder = function () {
}

/**
 * 
 * @memberOf Unit
 * 
 * 
 * 
 * 
 * @returns {nothing}
 */
Unit.prototype.executeOrders = function () {
    //logger.debug(`currentOrder is: ${JSON.stringify(this.currentOrder)}`);
    //logger.debug(`Orders are: ${JSON.stringify(this.orders)}`);
    //logger.silly(`current order is: `, this.currentOrder);
    if (!this.currentOrder) {
        console.log('order is undefined');
        //check if the order queue has elements
        if (this.orders[0] !== undefined) {
            logger.info(`Executing unit change of orders`);
            //give the pawn its next order
            logger.info(`Before splicing orders current order is : {type:${this.currentOrder}}`);
            this.currentOrder = this.orders[0];
            //console.log('Order queue: ',this.orders);
            console.log(`There are pending orders, assigning the following order: `, this.currentOrder);
            console.log(`The points to move to are : ${this.currentOrder.points}`);

        } else {
            //console.log('returning');
            return;
        }

    }
    console.log('order is not undefined');
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
            logger.silly(`executing dynamic movement`);
            //check if we have arrived at destination
            let targetX = utils.pointToGrid(this.currentOrder.target.x);
            let targetY = utils.pointToGrid(this.currentOrder.target.y);
            if (this.gridX === targetX && this.gridY === targetY) {
                //nullify order
                this.clearOrder();
            } else {
                //check if target has moved from its grid position
                //console.log(`target x is: ${targetX}`);
                //console.log(`current order last x point is: ${this.currentOrder.points[this.currentOrder.points.length-1][0]}`);
                if (this.currentOrder.points === undefined || targetX != this.currentOrder.points[this.currentOrder.points.length - 1][0]) {
                    console.log(`About to compute the following order : `, this.currentOrder);
                    this.computeMove(this.currentOrder.target.x, this.currentOrder.target.y);
                }
                logger.silly(`executing dynamic movement NOW`);
                this.executeMove();
            }
            break;


    }
}


//TODO: determine if the unit should be destroyed with pooling
Unit.prototype.update = function () {
    Pawn.prototype.update.call(this);
    this.updateGrid();
    this.executeOrders();
}



module.exports = Unit;