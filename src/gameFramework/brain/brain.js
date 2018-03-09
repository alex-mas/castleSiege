const {findById} = require('../utils/utils');

/**
 * @name Brain
 * @class Brain
 * @classdesc basic AI logic container with basic instructions such as give movement orders
 * @param {Phaser.Game} game - reference to the game where this brain is being created
 * @param {Unit} host - reference to the unit that hosts this brain
 * @param {Player} owner - reference to the owner of the brain (Syntactic sugar to convert this.host.owner to this.owner)
 */
const Brain = function(game,host,owner){
    //the pawn/unit that will be hosting this brain
    this._computing = false;
    this.game = game;
    this.host = host;
    this.owner = owner;
};


Brain.prototype.onAIOrder = function(order){
    this._computing = false;
    let isOrderCorrect = false;

    if(order.target){
        const target = findById(order.target,this.game);
        if(target){
            isOrderCorrect = true;
            order.targetId = order.target;
            order.target = target; 
        }else{
            console.warn('Unable to find target');
        }
    }else if(order.error){
        console.warn('AI_ERROR: ',order.error);
    }else{
        isOrderCorrect = true;
    }
    if(isOrderCorrect){

        this.host.orders.push(order);
        if(order.replace && this.host.orders[0] != order){
            this.host.clearOrder();
        }
        if(order.type == 'useElevator'){
            console.log(this.host.orders,this.host.currentOrder, order);
        }
    }
    
    
}


Brain.prototype.update = function(context){

    
}



module.exports = Brain;