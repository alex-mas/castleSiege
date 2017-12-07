const logger = require('../../dev_modules/logger.js');
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const Unit = require('../unit/unit');
const SoldierBrain = require('./soldierBrain');

//TODO: Make team a own game object and extend its features -> team diplomacy, multiple players per team, etc...
/**
 * @name Soldier
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
Soldier = function (game, x, y, spriteName, player, attributes, brain) {
    logger.debug(`Soldier attributes: ${attributes}`);

    //unit implements moving and attributes
    Unit.call(this, game, x, y, spriteName, player, attributes);
    game.add.existing(this);
    //define its brain
    this.owner = player;
    this.brain = brain || new SoldierBrain(game, this);
    //container object for data that affects the unit such as debuffs, etc...
    this.status = {

    };


}

Soldier.prototype = Object.create(Unit.prototype);
Soldier.prototype.constructor = Soldier;


Soldier.prototype.damageTarget = function (target, damage) {
    target.damage(damage);
}

//TODO: Make sure soldiers are initialized with the proper data structure inside attributes
Soldier.prototype.attack = function (attackIndex, target) {
    let attack = this.attributes.attack[attackIndex];
    if (!attack.isOnCd && this.isInAttackRange(attackIndex, target)) {
        attack.isOnCd = true;
        //Handle reverting cd status after it expires
        setTimeout(() => {
            attack.isOnCd = false;
        }, attack.cd);
        //play animation
        //wait for the callback where the animation hits the target
        //apply the damage to the target life
        this.damageTarget(target, attack.damage);
    }
}

Soldier.prototype.isInAttackRange = function (attackIndex, entity) {
    let attack = this.attributes.attack[attackIndex];
    let dx = entity.x - this.x,
        dy = entity.y - this.y,
        distance = Math.sqrt(dx ** 2 + dy ** 2);
    if (distance <= attack.range) {
        return true
    } else {
        return false
    }
}



//take this line out of unit update conditionally if child provides method in case of clashing
//Unit.prototype.executeOrders.call(this);
Soldier.prototype.executeOrders = function () {
    Unit.prototype.executeOrders.call(this);
    if (this.currentOrder !== undefined) {
        if(this.currentOrder.type === 'attack'){
            logger.info(`We will execute attack order`);
        }
        //Check each possible case and perform its appropiate action either do nothing.
        switch (this.currentOrder.type) {
            case 'attack':
            logger.info(`Current order is of type attack = ${this.currentOrder}`);
                if (this.currentOrder.done === false) {
                    if (this.currentOrder.method === 'once') {
                        this.attack(currentOrder.attack, currentOrder.target);
                        this.currentOrder.done = true;

                    } else if (currentOrder.method === 'multiple') {
                        if(this.isInAttackRange(currentOrder.attack, currentOrder.target)){
                            this.attack(currentOrder.attack, currentOrder.target);
                        }else{
                            this.currentOrder.done = true;
                        }
                    }
                }else{
                    //nullify order so unit can assign next order
                    this.currentOrder = undefined;
                }

                break;
            default:
                logger.debug(`Order of type ${this.currentOrder.type} doesn't mach any valid option for soldier`);
                break;
        }

    }
}



Soldier.prototype.update = function () {
    Unit.prototype.update.call(this);
    this.brain.update(0);

}


module.exports = Soldier;