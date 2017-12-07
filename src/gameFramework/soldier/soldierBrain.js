const logger = require('../../dev_modules/logger.js');
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const Unit = require('../unit/unit.js');
const Brain = require('../brain/brain.js');


//TODO: Implement one brain for multiple units
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
SoldierBrain = function (game, host, owner) {
    Brain.call(this, game, host, owner);
}

SoldierBrain.prototype = Object.create(Brain.prototype);
SoldierBrain.prototype.constructor = SoldierBrain;

//TODO: implement
SoldierBrain.prototype.searchForEnemies = function () {
    let enemies = [];
    this.game.world.forEach((gameObject) => {
        if (gameObject instanceof Unit) {
            logger.silly(`GameObject: ${gameObject} is an instance of Unit`);
            //TODO: implement check if the other team is actually unfriendly
            if (gameObject.owner !== this.host.owner) {
                if(gameObject.alive){
                    enemies.push(gameObject);
                }
            }
        }
    });
    return enemies;

}

//TODO: implement range and strength check to go for closest and weakest target
SoldierBrain.prototype.chooseTarget = function (enemies) {
    return enemies[0];
}

//TODO: implement
SoldierBrain.prototype.orderAttack = function (attackIndex, target) {
    logger.info(`Ordering attack move`);
    this.host.orders.push({
        type: 'attack',
        method: 'multiple',
        done: false,
        target,
        attack: attackIndex,
    });
}


/**
 * 
 * @todo the problem is that you only give one order ignoring that your target might move, fix it.
 */
//executed on game loop, determines the course of action given a context
//TODO: Create basic AI for soldiers, namely, look for enemies in game grid and order move to their position
SoldierBrain.prototype.update = function (context) {
    //call base brain class
    Brain.prototype.update.call(this,context);
    //class specific behaviour
    //TODO: remove hardcoded behaviour.
    if (this.host.orders.length < 1) {
        let enemies = this.searchForEnemies();
        if (enemies.length > 0) {
            let enemy = this.chooseTarget(enemies);
            let maximumDamage = 0;
            let optimalAttack = undefined;
            for(let i = 0; i < this.host.attributes.attack.length; i++){
                logger.debug(`inside loop to choose attack`);
                let thisAttack = this.host.attributes.attack[i];
                logger.debug(`this attack is `, thisAttack);
                if(this.host.isInAttackRange(i,enemy)){
                    logger.debug(`attack is in range`);
                    if(thisAttack.damage > maximumDamage){
                        maximumDamage = thisAttack.damage;
                        optimalAttack = i;
                    }
                }
            }
            if(optimalAttack !== undefined){
                logger.debug(`We should order attack now`);
                console.log(`Enemy is: `,enemy);
                this.orderAttack(optimalAttack, enemy);
            }else{
                logger.debug(`We should order a dynamic move now`);
                logger.debug(`this x: ${this.host.x}, this y: ${this.host.y}`);
                logger.debug(`Enemy x: ${enemy.x}, Enemy y: ${enemy.y}`);
                this.orderDynamicMove(enemy);
            }
        } else {
            logger.debug(`We should order a static move`);
            let x = Math.random() * window.innerWidth - 32,
                y = Math.random() * window.innerHeight - 32;
            this.orderStaticMove(x, y);
        }
        
    }else{
    }
    
}


module.exports = SoldierBrain;