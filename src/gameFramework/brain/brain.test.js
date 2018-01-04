const Soldier = require('./../soldier/soldier.js');
const Brain = require('./brain.js');
const Team = require('../team/team.js');
const Player = require('../player/player.js');
const PlayerType = require('../global_variables/enums/playerType');
const expect = require('expect');
const PIXI = require('phaser-ce/build/custom/pixi');
const p2 = require('phaser-ce/build/custom/p2');
const Phaser = require('phaser-ce/build/custom/phaser-split');


let testElement = document.createElement('div');
let testSoldier;
let testSoldier2;
let redPlayer;
let testBrain;
let testGame;
let preload = function () {

}
let create = function () {
    const redTeam = new Team('Red Team');
    redPlayer = new Player('Red Player', PlayerType.IDLE_AI, redTeam);
    testSoldier = new Soldier(testGame, 0, 0, redPlayer, {
        health: 100,
        ms: 65,
        attack: [{
            isOnCd: false,
            cd: 250,
            damage: 25,
            range: 100
        }]
    });
    testSoldier2 = new Soldier(testGame, 0, 0, redPlayer, {
        health: 100,
        ms: 65,
        attack: [{
            isOnCd: false,
            cd: 250,
            damage: 25,
            range: 100
        }]
    });
    
}
let update = function () {

}
let render = function () {

}
testGame = new Phaser.Game(10, 10, Phaser.AUTO, testElement, { preload, create, update, render });

describe('Brain class tests', function () {

    it('Constructor should properly initialize an instance of brain with proper attributes', function () {
        expect(testBrain).toBeInstanceOf(Brain);
        expect(testBrain.host).toBe(testSoldier);
        expect(testBrain.owner).toBe(redPlayer);
        expect(testBrain.game).toBe(testGame);
        
    });
    //it('Order static move should properly concatenate an order of tpye static move inside its host orders array',function(){
        //expect(testBrain.host).toBe(testSoldier);
        //testBrain.orderStaticMove(9,9);
        //console.log(testBrain);
        //expect(testBrain.host.orders.length).toBe(1);
        //expect(testSoldier.orders[testSoldier.orders.length-1]).toHaveProperty('type', 'staticMovement');
    //})
});
