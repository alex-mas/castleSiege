var pf = require('pathfinding');
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

//TODO: Logging
//TODO: implement strategies
Brain = function(game,host){
    //the pawn/unit that will be hosting this brain
    this.game = game;
    this.host = host;
};

//TODO: Wire it up with unit order system
Brain.prototype.orderMove = function (x, y) {
    //add the order to its host.
    this.host.orders.push({
        type: 'movement',
        x: x,
        y: y,
        computed: false,
        points: []
    });
};




//TODO: wire up an update method so the engine automaticly calls it each frame --> call it from its host update method?
Brain.prototype.update = function(){
    
}



module.exports = Brain;