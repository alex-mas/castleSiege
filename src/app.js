/* project dependencies */

//Styles
import "./stylesheets/reset.css";
import "./stylesheets/main.css";

//Logging module
const logger = require('./dev_modules/logger.js');
//Game engine
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

//Custom game engine modules
//TODO: Use ES6 destructuring to export relevant classes - Pay for what you use n stuff
const gameFramework = require('./gameFramework/gameFramework.js');

//Custom environment variables 
import env from "env";


var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'app', { preload: preload, create: create, update: update, render: render });

game.grid = {
    tileGrid: [],
    collisionGrid: []
};
var testPawn;

logger.warn({
    message: 'shit is about to get real'
});
function preload() {
    logger.verbose({
        message: 'preloading assets...'
    });
    for (var i = 1; i <= 538; i++) {
        if (i < 10) {
            logger.silly({
                message: `loaded tile_${i} from ./../resources/tiles/tile_${i}.png`
            });
            game.load.image(`tile_${i}`, `./../resources/tiles/tile_0${i}.png`);
        } else {
            logger.silly({
                message: `loaded tile_${i} from ./../resources/tiles/tile_${i}.png`
            });
            game.load.image(`tile_${i}`, `./../resources/tiles/tile_${i}.png`);
        }

    }
    game.load.image(`king`, `./../resources/structures/king.png`);
    game.load.image(`knight_blue`, `./../resources/structures/knightBlue.png`);
    game.load.image(`knight_red`, `./../resources/structures/knightRed.png`);
    logger.debug({
        message: '...Finished preloading assets'
    });

}



function paintWorldGround() {
    for (var i = 0; i < window.innerHeight / 64; i++) {
        game.grid.collisionGrid[i] = [];
        game.grid.tileGrid[i] = [];
        for (var j = 0; j < window.innerWidth / 64; j++) {
            var spriteNumber = 1 + Math.round(Math.random() * 5);
            game.grid.tileGrid[i][j] = game.add.sprite(64 * j, 64 * i, `tile_${spriteNumber}`);
            if (spriteNumber >= 7) {
                game.grid.collisionGrid[i][j] = 1;
            } else {
                game.grid.collisionGrid[i][j] = 0;
            }
        }
    }
    console.log(game.grid.tileGrid);
    console.log(game.grid.collisionGrid);
}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    paintWorldGround();
    var soldier = new gameFramework.Soldier(
        game, 
        0, 
        0, 
        'king', 
        'AI', 
        {
        ms: 50,
        damage: 30,
        attack: [{
            isOnCd: false,
            cd: 250,
            attackDamage: 10,
            attackRange: 150
        }]
        }
    );
    var soldier2 = new gameFramework.Soldier(
        game,
        500,
        500,
        'knight_red',
        'no-one',
        {
            ms: 50,
            damage: 30,
            attack: [{
                isOnCd: false,
                cd: 250,
                attackDamage: 10,
                attackRange: 150
            }]
        },
    );
    var soldier3 = new gameFramework.Soldier(
        game,
        800,
        1000,
        'knight_blue',
        'no-one2',
        {
            ms: 50,
            damage: 30,
            attack: [{
                isOnCd: false,
                cd: 250,
                attackDamage: 10,
                attackRange: 150
            }]
        },
    );
}


function update() {

}

function render() {

}

