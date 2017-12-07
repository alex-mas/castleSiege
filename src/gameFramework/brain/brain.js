const logger = require('../../dev_modules/logger.js');
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

/**
 * @name Brain
 * @class Brain
 * @classdesc basic AI logic container with basic instructions such as give movement orders
 * @param {Phaser.Game} game - reference to the game where this brain is being created
 * @param {Unit} host - reference to the unit that hosts this brain
 * @param {Player} owner - reference to the owner of the brain (Syntactic sugar to convert this.host.owner to this.owner)
 */
Brain = function(game,host,owner){
    //the pawn/unit that will be hosting this brain
    this.game = game;
    this.host = host;
    this.owner = owner;
};

//TODO: Wire it up with unit order system
Brain.prototype.orderStaticMove = function (x, y) {
    logger.debug(`Ordering static move`);
    //add the order to its host.
    this.host.orders.push({
        type: 'staticMovement',
        x: x,
        y: y,
        computed: false,
        points: []
    });
};

Brain.prototype.orderDynamicMove = function(target){
    logger.debug(`Ordering dynamic move`);
    //add the order to its host
    this.host.orders.push({
        type: 'dynamicMovement',
        target: target,
        points: undefined,
        computed: false
    });
}



//TODO: wire up an update method so the engine automaticly calls it each frame --> call it from its host update method?
Brain.prototype.update = function(context){

    
    
}



module.exports = Brain;