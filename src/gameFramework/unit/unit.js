
const pf = require('../customPathfinding/index.js');
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
const Unit = function (game, x, y, spriteName, player, attributes) {
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
    this.brain = new Brain(game, this, player);
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
    this.currentOrder.beingComputed = true;
    this.game.__pathfinder__.distributeWork('findPath', {
        from: [this.gridX, this.gridY],
        to: [x, y],
        id: this._id
    });
}



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
            //TODO: Change this as removing elements from an array greatly reduces the performance
            this.currentOrder.points.splice(0, 1);
        } else {
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
        }
    } else {
        this.clearOrder();
    }
}


Unit.prototype.onPathResult = function (path) {
    //Warning: if other orders isue path computation requests we will need to account for them here
    if (this.currentOrder &&
        (this.currentOrder.type === 'staticMovement' ||
            this.currentOrder.type === 'dynamicMovement')
    ) {
        if (path.length != 0) {
            this.currentOrder.points = path;
            this.currentOrder.computed = true;
            this.currentOrder.beingComputed = false;
        } else {
            this.currentOrder.beingComputed = false;
        }
    }
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
Unit.prototype.pushOrder = function (order) {
    /*
    const isValid = this.isOrderValid(order);
    if (isValid) {
        this.orders.push(order);
    } else {
        console.warn(`Invalid order provided to ${this}`);
    }
    */
    //TODO: validate
    this.orders.push(order);
}

//TODO: implement - checks for necessary characteristics of diferent order archetypes
Unit.prototype.isOrderValid = function (order) {
    /*
    let isValid = false;
    //validate
    */
    return true;
}



Unit.prototype.executeOrders = function () {
    if (!this.currentOrder) {
        if (this.orders[0] !== undefined) {
            //check if the order queue has elements
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
            } else if (!this.currentOrder.beingComputed) {
                this.computeMove(this.currentOrder.x, this.currentOrder.y);
            }
            break;
        //WARNING: dynamic movement never ends because the unit collision doesn't allow it to reach the other unit
        case 'dynamicMovement':
            var targetX = this.currentOrder.target.gridX;
            var targetY = this.currentOrder.target.gridY;
            //check if we have arrived at destination
            if (this.gridX === targetX && this.gridY === targetY) {
                this.clearOrder();
            } else {
                //check if target has moved from its grid position
                //TODO: Problem with undesired unit behaviour seem to be related to workers not responding
                if (
                    this.currentOrder.points === undefined ||
                    this.currentOrder.points.length === 0 ||
                    targetX !== this.currentOrder.points[this.currentOrder.points.length - 1][0] ||
                    targetY !== this.currentOrder.points[this.currentOrder.points.length - 1][1]
                ) {
                    if (!this.currentOrder.beingComputed) {
                        if (this.currentOrder.target.x && this.currentOrder.target.x) {
                            this.computeMove(this.currentOrder.target.x, this.currentOrder.target.y);
                        }
                    }
                }
                if (this.currentOrder.computed) {
                    this.executeMove();
                }

            }
            break;
        default:
            break;
    }
}



Unit.prototype.update = function () {
    Pawn.prototype.update.call(this);
    this.executeOrders();
}



module.exports = Unit;
