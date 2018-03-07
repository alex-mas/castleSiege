
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const utils = require('../utils/utils');
const Unit = require('../unit/unit');
const SiegeTowerBrain = require('./siegeTowerBrain');


/**
 * @name SiegeTower
 * @class 
 * @classdesc Object that holds object to move and find paths trought extending classes and that implements attacking behaviour and AI
 * @extends Unit
 * @param {Phaser.Game} game - reference to the game where the soldier is being created
 * @param {any} x - x position
 * @param {any} y  - y position
 * @param {String} spriteName - string referencing a certain sprite (sprites are stored in string variables inside Phaser)
 * @param {Object} attributes  - object that holds all attributes that might want to be specified for the instantianted unit
 * @param {Brain} brain - Optional parameter that gives the unit a brain(AI)
 * @param {Player} player - reference to the player that owns this unit
 */
const SiegeTower = function (game, x, y, spriteName, player, attributes, brain) {
    this.__type__ = 'siegeTower';
    //unit implements moving and attributes
    Unit.call(this, game, x, y, spriteName, player, attributes);

    this.body.mass = 2385+Math.random()*45;
    //define its brain
    this.brain = brain || new SiegeTowerBrain(game, this, player);
    //container object for data that affects the unit such as debuffs, etc...
    this.status = {
        settled: false
    };
}

SiegeTower.prototype = Object.create(Unit.prototype);
SiegeTower.prototype.constructor = SiegeTower;


//Sets up the unit staticly in its current position
SiegeTower.prototype.settle = function(){
    console.log('settled');
    this.body.static = true;
    this.status.settled = true;
    this.body.immovable = true;
    this.body.moves = false;
    this.body.debug = true;
    this.brain.isHostSettled = true;
    this.attributes.ms = 0;
    this.body.clearCollision();
    this.body.collides(this.game._collisionGroups.walls);
    this.stop();
}


/**
 * @description changes the altitude of the given unit
 * @param {gameFramework.Unit} unit 
 */
SiegeTower.prototype.lift = function(unit){
    console.log('lifting unit');
    if(unit.altitudeLayer){
        unit.altitudeLayer = 0;
    }else{
        unit.altitudeLayer = 1;
    }
    unit.updateCollisionGroup();
    unit.updateCollisionParams();
}



//take this line out of unit update conditionally if child provides method in case of clashing
//Unit.prototype.executeOrders.call(this);
SiegeTower.prototype.executeOrders = function () {
    Unit.prototype.executeOrders.call(this);
    if (this.currentOrder !== undefined) {
        //Check each possible case and perform its appropiate action either do nothing.
        switch (this.currentOrder.type) {
            case 'settle':
                console.log('should settle');
                this.settle();
                this.clearOrder();
                break;
            case 'staticMovement':
                if(                    
                    this.currentOrder.points &&
                    this.currentOrder.points.length === 1
                ){
                    console.log(this.currentOrder.points.length);
                    const x = utils.gridToPoint(this.currentOrder.points[0][0],true);
                    const y = utils.gridToPoint(this.currentOrder.points[0][1],true);
                    const distance = utils.getDistance([this.x, this.y], [x,y]);
                    console.log(distance);
                    if(distance <= 87.137){
                        this.clearOrder();
                    }
                }
            default: 
                break;
        }

    }
}



SiegeTower.prototype.update = function () {
    if (this.alive) {
        Unit.prototype.update.call(this);
        this.brain.update(0);
    }
    if(this.status.settled)
    {
        this.stop();
        this.body.setZeroDamping();
        this.body.setZeroForce();
        this.body.setZeroVelocity();
    }

}


module.exports = SiegeTower;