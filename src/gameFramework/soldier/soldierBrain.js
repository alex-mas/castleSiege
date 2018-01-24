
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const Unit = require('../unit/unit.js');
const Brain = require('../brain/brain.js');
const Team = require('../team/team.js');


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
    this._events = {
        REQUEST_AI_UPDATE: false
    }
}

SoldierBrain.prototype = Object.create(Brain.prototype);
SoldierBrain.prototype.constructor = SoldierBrain;




SoldierBrain.prototype.searchForEnemies = function () {
    let enemies = [];
    let unitsArray = this.game._units;
    for (var i = 0; i < unitsArray.length; i++) {
        let gameObject = unitsArray[i];
        if (gameObject.owner.team.isEnemyOf(this.owner.team)) {
            //TODO: Find out why the fuck does this function get called 450 times
            if (gameObject.alive) {
                enemies.push(gameObject);
            }
        }

    }
    return enemies;
}


//TODO: Move this parsing logic to the AI and synchronize it in a centralized 
//      way with all workers, add team id and try to optimize data sent
//Extract relevant data from the unit data structure
SoldierBrain.prototype.parseUnitData = function (unit) {
    return {
        id: unit._id,
        health: unit.health,
        x: unit.x,
        y: unit.y
    };

}

SoldierBrain.prototype.searchUnits = function () {
    let enemies = [];
    let neutral = [];
    let allies = [];
    let unitsArray = this.game._units;
    for (var i = 0; i < unitsArray.length; i++) {
        let gameObject = unitsArray[i];
        if (gameObject.alive) {
            if (gameObject.owner.team.isEnemyOf(this.owner.team)) {
                enemies.push(this.parseUnitData(gameObject));
            } else if (gameObject.owner.team.isAllyOf(this.owner.team)) {
                allies.push(this.parseUnitData(gameObject));
            } else {
                neutral.push(this.parseUnitData(gameObject));
            }
        }
    }
    return {
        enemies,
        neutral,
        allies
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

/*
SoldierBrain.prototype.getHostContext = function () {
    return {
        units: this.searchUnits(),
        actor: {
            health: this.host.health,
            x: this.host.x,
            y: this.host.y,
            id: this.host._id,
            attributes: this.host.attributes,
            orders: this.sanitizeOrders()
        },
        window: {
            height: window.innerHeight,
            width: window.innerWidth
        },
    };
}
*/


//TODO: implement strength check to go for closest and weakest target
SoldierBrain.prototype.chooseTarget = function (enemies) {
    //fallback optimal target
    let optimalTarget = enemies[0];
    let minimumDistance = 90000;
    //loop all enemies and save the closest target on memory
    for (var i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let distance = Math.sqrt((enemy.x - this.host.x) ** 2 + (enemy.y - this.host.y) ** 2);
        if (distance < minimumDistance) {
            minimumDistance = distance;
            optimalTarget = enemy;
        }
    }
    //return closest target
    return optimalTarget;
}

//orders its host to attack the target multiple times until it dies or goes out of range
SoldierBrain.prototype.orderAttack = function (attackIndex, target) {
    this.host.orders.push({
        type: 'attack',
        method: 'multiple',
        done: false,
        target,
        attack: attackIndex,
    });
}




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
        this._events.REQUEST_AI_UPDATE = true;
    } else {
        if (this.host.currentOrder &&
            this.host.currentOrder.type === "dynamicMovement"&&
            this.__counter % 100 !== 0
        ) {
            this._events.REQUEST_AI_UPDATE = true;
        }
    }
    if (this._events.REQUEST_AI_UPDATE) {
        this._events.REQUEST_AI_UPDATE = false;
        this.owner.AI.choose('soldierAI', this.getHostContext());
    }
}


module.exports = SoldierBrain;