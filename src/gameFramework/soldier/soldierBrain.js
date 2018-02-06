

window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const Unit = require('../unit/unit.js');
const Brain = require('../brain/brain.js');
const Team = require('../team/team.js');
const utils = require('../utils/utils.js');


/**
 * 
 * 
 * @name SoldierBrain
 * @class SoldierBrain
 * @classdesc higher level AI logic container specificaly made for basic soldiers. implements target and movement decisions
 * @extends Brain 
 * @param {Phaser.Game} game - reference to the game instance where the brain is created
 * @param {Unit} host - reference to the unit that will be managed by the brain
 * @param {Player} owner -reference to the player that owns the brain
 */
const SoldierBrain = function (game, host, owner) {
    Brain.call(this, game, host, owner);
    this.__counter = 0;
}

SoldierBrain.prototype = Object.create(Brain.prototype);
SoldierBrain.prototype.constructor = SoldierBrain;




SoldierBrain.prototype.getHostContext = function(){
    return {
        team: this.host.owner.team._id,
        health: this.host.health,
        x: this.host.x,
        y: this.host.y,
        id: this.host._id,
        attributes: this.host.attributes,
        orders: this.sanitizeOrders()
    };
}



SoldierBrain.prototype.sanitizeOrders = function(){
    let orders = [];
    for(let i = 0; i <this.host.orders.length; i++){
        const order = this.host.orders[i];
        if(order.target){
            orders.push({
                type: order.type,
                target:{
                    id: order.targetId
                },
                points: order.points
            });
        }else{
            orders.push(order);
        }
    }
    return orders;
}



//BENCHMARKS: every unit calls this 9.2 times each second, creating a bottleneck 
//due to the structured clone of web workers
//TODO: Give only order specific information to AI after the context broadcasting
//      is refactored there
//executed on game loop, determines the course of action given a context
SoldierBrain.prototype.update = function (context) {

    Brain.prototype.update.call(this, context);
    this.__counter++;

    /* Second iteration, event based system to communicate with AI*/

    if (this.host.orders.length < 1) {
       // console.log('requesting ai computation');
        this.owner.AI.choose('soldierAI', this.getHostContext());
        this._computing = true;
    } else {
        if (this.host.currentOrder &&
            this.host.currentOrder.type === "dynamicMovement"&&
            this.__counter % 321 === 0
        ) {
           /* if(this.__counter > 2300){
                console.log(this.host.orders);
                console.log(this.host.orders[0].target.alive);
            }*/
            //console.log('requesting ai computation');
            this._computing = true;
            this.owner.AI.choose('soldierAI', this.getHostContext());
        }
    }
}


module.exports = SoldierBrain;