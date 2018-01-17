/* project dependencies */
//node modules
const fs = require('fs');



//Styles
import "./stylesheets/reset.css";
import "./stylesheets/main.css";

//Logging module
const logger = require('./dev_modules/logger.js');
//Game engine

/*
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
*/

//Custom game engine modules
//TODO: Use ES6 destructuring to export relevant classes - Pay for what you use n stuff
const gameFramework = require('./gameFramework/gameFramework.js');
//Custom environment variables 
import env from "env";

let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'app', { preload: preload, create: create, update: update, render: render });
const __srcdir = __dirname+'../src';
/*Phaser game customitzations*/
game._units = [];
game.grid = {
    tileGrid: [],
    collisionGrid: []
};
game.grid.onChange = function(){
    game.__pathfinder__.distributeWork('setGrid',{
        grid: game.grid.collisionGrid
    });
}
game.__pathfinder__ = new gameFramework.ThreadManager(__dirname,'/gameFramework/workers/pathfinding.js',{
    ammountOfWorkers: 2,
},function(e){
    const id = e.data.id;
    for(let i = 0; i< game._units.length; i++){
        const unit = game._units[i];
        if(unit._id === id){
            unit.onPathResult(e.data.path);
        }
    }
});


function preload() {
    logger.verbose({
        message: 'preloading assets...'
    });
    for (var i = 1; i <= 538; i++) {
        if (unexistentAsset(i)) {
            continue;
        }
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
    game.load.image(`axe_red`, `./../resources/units/axeRed.png`);
    game.load.image(`axe_blue`, `./../resources/units/axeBlue.png`);
    logger.debug({
        message: '...Finished preloading assets'
    });

}


//paints the ground sprites and stores them into memory and creates the collision grid
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
}

//called on game start
function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    paintWorldGround();
    game.__pathfinder__.distributeWork('setGrid',{
        grid: game.grid.collisionGrid
    });
    game.__pathfinder__.distributeWork('setGrid',{
        grid: game.grid.collisionGrid
    });

    //Define testing teams and players
    const redTeam = new gameFramework.Team('Red Team');
    const blueTeam = new gameFramework.Team('Blue Team');
    redTeam.addEnemy(blueTeam);
    blueTeam.addEnemy(redTeam);
    const redPlayer = new gameFramework.Player('Red Player', gameFramework.PlayerType.IDLE_AI, redTeam);
    const bluePlayer = new gameFramework.Player('Blue Player', gameFramework.PlayerType.IDLE_AI, blueTeam);


    //instantiate all the units in recrangular formation
    for (let j = 0; j < 1; j++) {
        for (let i = 0; i < 10; i++) {
            game._units.push(new gameFramework.Soldier(
                game,
                32 + 32 * j,
                32 + 32 * i,
                'axe_red',
                redPlayer,
                {
                    health: 100,
                    ms: 65,
                    attack: [{
                        isOnCd: false,
                        cd: 250,
                        damage: 25,
                        range: 100
                    }]
                }
            ));
            game._units.push(new gameFramework.Soldier(
                game,
                (window.innerWidth - 32) - 32 * j,
                32 + 32 * i,
                'axe_blue',
                bluePlayer,
                {
                    health: 150,
                    ms: 65,
                    attack: [{
                        isOnCd: false,
                        cd: 250,
                        damage: 25,
                        range: 100
                    }]
                }
            ));
        }
    }


}


function update() {

    //custom game update logic, most logic is called on the update methods of instantiated game objects tho
}


function render() {

}


//function to circumvent the fact that some assets are missing in the tiles folder
const unexistentAsset = function (i) {
    if (i === 27 || i === 54 || i === 81 || i === 108 || i === 135 || i === 162
        || i === 189 || i === 216 || i === 458 || i === 459 || i === 485 || i === 486
        || i === 512 || i === 513) {
        return true;
    } else {
        return false
    }
}