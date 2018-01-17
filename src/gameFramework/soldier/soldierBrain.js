
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
}

SoldierBrain.prototype = Object.create(Brain.prototype);
SoldierBrain.prototype.constructor = SoldierBrain;




SoldierBrain.prototype.searchForEnemies = function () {
    let enemies = [];
    let unitsArray = this.game._units;
    for (var i = 0; i < unitsArray.length; i++) {
        let gameObject = unitsArray[i];
        if (gameObject.owner.team.isEnemyOf(this.host.owner.team)) {
            //TODO: Find out why the fuck does this function get called 450 times
            if (gameObject.alive) {
                enemies.push(gameObject);
            }
        }

    }
    return enemies;

}

//TODO: implement strength check to go for closest and weakest target
SoldierBrain.prototype.chooseTarget = function (enemies) {
    //fallback optimal target
    let optimalTarget = enemies[0];
    let minimumDistance = 90000;
    //loop all enemies and save the closest target on memory
    for (var i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
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


/**
 * @todo - Inspect script execution data to determine if its soldierBrain, soldier or unit movements that are creating the bottleneck
 * @todo - Problem regarding the static nature of the current targeting system.
 * @todo - Performance problems, script execution throtles in this zone, remove logging and try to optimize code (async+multithreading?)
 */
//executed on game loop, determines the course of action given a context
SoldierBrain.prototype.update = function (context) {

    Brain.prototype.update.call(this, context);

    //class specific behaviour
    //TODO: remove hardcoded behaviour.
    if (this.host.orders.length < 1) {
        const enemies = this.searchForEnemies();
        if (enemies.length > 0) {
            const enemy = this.chooseTarget(enemies);
            let maximumDamage = 0;
            let optimalAttack = undefined;
            for (var i = 0; i < this.host.attributes.attack.length; i++) {
                let thisAttack = this.host.attributes.attack[i];
                if (this.host.isInAttackRange(i, enemy)) {
                    if (thisAttack.damage > maximumDamage) {
                        maximumDamage = thisAttack.damage;
                        optimalAttack = i;
                    }
                }
            }
            if (optimalAttack !== undefined) {
                this.orderAttack(optimalAttack, enemy);
            } else {
                this.orderDynamicMove(enemy);
            }
        } else {
            const x = Math.random() * window.innerWidth - 32,
                y = Math.random() * window.innerHeight - 32;
            this.orderStaticMove(x, y);
        }

    } else {
        /*
        if (this.host.currentOrder.type === "dynamicMovement") {
            const enemies = this.searchForEnemies();
            if (enemies.length > 0) {
                let enemy = this.chooseTarget(enemies);
                if (enemy !== this.host.currentOrder.target) {
                    let maximumDamage = 0;
                    let optimalAttack = undefined;
                    for (let i = 0; i < this.host.attributes.attack.length; i++) {
                        let thisAttack = this.host.attributes.attack[i];
                        if (this.host.isInAttackRange(i, enemy)) {
                            if (thisAttack.damage > maximumDamage) {
                                maximumDamage = thisAttack.damage;
                                optimalAttack = i;
                            }
                        }
                    }
                    if (optimalAttack !== undefined) {
                        this.orderAttack(optimalAttack, enemy);
                        this.host.clearOrder();
                    } else {
                        this.orderDynamicMove(enemy);
                        this.host.clearOrder();
                    }
                }
            }
        }
*/
    }

}


module.exports = SoldierBrain;