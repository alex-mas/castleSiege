/* project dependencies */

//Styles
import "./stylesheets/reset.css";
import "./stylesheets/main.css";

//Logging module
const winston = require('winston');
console.log(winston);

//Game engine
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

//Custom game engine modules
const gameFramework = require('./gameFramework/gameFramework.js');

//Custom environment variables 
import env from "env";
console.log(env);
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: "debug"}),
        new winston.transports.File({
            filename: 'warnings.log'
        })
    ]
});


//TODO: FIX THIS LOGGING MESS
if (env.name === "development") {
    //development specific logic
    console.log('env is development');
    logger.level = 'info';
    logger.debug({
        message: `env is ${env.name} debug`
    });
    logger.verbose({
        message: `env is ${env.name} verbose`
    });
    logger.info({
        message: `env is ${env.name} info`
    });
    logger.warn({
        message: `env is ${env.name} warn`
    });
    logger.error({
        message: `env is ${env.name} error`
    });

} else if (env.name === "test") {
    //testing specific logic
    console.log('env is test');
    logger.level = 'debug';
    logger.debug({
        message: `env is ${env.name}`
    });
} else {
    //production specific logic
    console.log('env is production');
    logger.level = 'warn';

}


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
    logger.debug({
        message: '...Finished preloading assets'
    });

}



function populateWorld() {
    for (var i = 0; i < window.innerHeight / 64; i++) {
        game.grid.collisionGrid[i] = [];
        game.grid.tileGrid[i] = [];
        for (var j = 0; j < window.innerWidth / 64; j++) {
            var spriteNumber = 1 + Math.round(Math.random() * 7);
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
    populateWorld();
    testPawn = new Pawn(game, 32, 32, 'tile_214', "Player_1");
    game.physics.p2.enable(testPawn);
    testPawn.orderMove(window.innerWidth * Math.random(), window.innerHeight * Math.random());
    console.log(testPawn.moveQueue);
}


function update() {

    if (testPawn.gridX === testPawn.moveQueue[0][0] && testPawn.gridY === testPawn.moveQueue[0][1]) {
        testPawn.moveQueue.splice(0, 1);
    }
    console.log(testPawn.moveQueue);
    if (testPawn.moveQueue.length > 0) {
        var targetX = 32 + (testPawn.moveQueue[0][0] * 64);
        var targetY = 32 + (testPawn.moveQueue[0][1] * 64);
        if (testPawn.x > targetX) {
            testPawn.body.moveLeft(50);
        } else if (testPawn.x < targetX) {
            testPawn.body.moveRight(50);
        }
        if (testPawn.y > targetY) {
            testPawn.body.moveUp(50);
        } else if (testPawn.y < targetY) {
            testPawn.body.moveDown(50);
        }

    }

}

function render() {

}

