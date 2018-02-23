/* project dependencies */
//node modules
const fs = require('fs');
const os = require('os');
const CPU_COUNT = os.cpus().length;


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


const Soldier = gameFramework.Soldier;

const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    renderer: Phaser.WEBGL_MULTI,
    canvasId: 'app',
    antialias: true,
    multiTexture: true,
    roundPixels: true,
    enableDebug: false,
    state: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
}
let game = new Phaser.Game(config);
game.clearBeforeRender = false;
const __srcdir = __dirname + '../src';


/*Phaser game customitzations*/

game._units = [];
game._unitIds = {};

let SHOULD_GRID_UPDATE = undefined;
game.grid = {
    tileGrid: [],
    collisionGrid: [
        [],
        [],
        []
        //TODO: add more levels dynamically
    ]
};


game.__pathfinder__ = new gameFramework.ThreadManager(__dirname, '/gameFramework/workers/pathfinding.js', {
    amountOfWorkers: 2,
}, function (e) {
    const unit = gameFramework.utils.findById(e.data.id, game);
    if (unit) {
        unit.onPathResult(e.data.path);
    }

});

game.grid.onChange = function () {
    game.__pathfinder__.distributeWork('setGrid', {
        grid: game.grid.collisionGrid
    });
    SHOULD_GRID_UPDATE = true;
}

game.__AIManager__ = new gameFramework.ThreadManager(
    __dirname,
    '/gameFramework/workers/AIWorker.js',
    {
        amountOfWorkers: (CPU_COUNT * 1.5),
        sendingMethod: "regular"
    }
);

const regularAi = new gameFramework.AI(game, 'regularAi1');

game.__AIManager__.setEventHandler(regularAi.threadCallback.bind(regularAi));


//Define testing teams and players
game._teams = [];
game._players = [];

const redTeam = new gameFramework.Team('Red Team');
const blueTeam = new gameFramework.Team('Blue Team');
redTeam.addEnemy(blueTeam);
blueTeam.addEnemy(redTeam);
game._teams.push(redTeam);
game._teams.push(blueTeam);
const redPlayer = new gameFramework.Player(gameFramework.PlayerType.AI, undefined, redTeam, regularAi);
const bluePlayer = new gameFramework.Player(gameFramework.PlayerType.AI, undefined, blueTeam, regularAi);
game._players.push(redPlayer);
game._players.push(bluePlayer);




function preload() {
    if (env.name !== "production") {
        //WARNING: this has been reported to reduce performance substantially but its the only way to enable fps checking ingame
        game.time.advancedTiming = true;
    }
    logger.verbose({
        message: 'preloading assets...'
    });

    game.load.atlasJSONHash('frames', './../resources/spritesheets/spritesheet2.png', './../resources/spritesheets/spritesheet2.json');

    logger.debug({
        message: '...Finished preloading assets'
    });

}

//TODO: account for multilayer collision grid when creating the world
//paints the ground sprites and stores them into memory and creates the collision grid
function paintWorldGround() {
    for (var i = 0; i < window.innerHeight / 64; i++) {
        game.grid.collisionGrid[0][i] = [];
        game.grid.collisionGrid[1][i] = [];
        game.grid.tileGrid[i] = [];
        for (var j = 0; j < window.innerWidth / 64; j++) {
            var spriteNumber = 1 + Math.round(Math.random() * 6);
            game.grid.tileGrid[i][j] = new Phaser.Sprite(game,64 * j, 64 * i, 'frames', `tile_0${spriteNumber}.png`);
            game.add.existing(game.grid.tileGrid[i][j]);
            game.grid.tileGrid[i][j].anchor.set(0)
            game.physics.p2.enable(game.grid.tileGrid[i][j]);
            game.grid.tileGrid[i][j].body.enable = true;
            game.grid.tileGrid[i][j].body.kinematic = true;
            if (spriteNumber >= 7) {
                game.grid.collisionGrid[0][i][j] = 1;
                game.grid.collisionGrid[1][i][j] = 0;
                game.grid.tileGrid[i][j].body.setCollisionGroup(game._collisionGroups.walls);
                game.grid.tileGrid[i][j].body.collides([game._collisionGroups.level[0], game._collisionGroups.grass]);
            } else {
                game.grid.tileGrid[i][j].body.setCollisionGroup(game._collisionGroups.grass);
                game.grid.tileGrid[i][j].body.collides([game._collisionGroups.level[1],game._collisionGroups.walls]);
                game.grid.collisionGrid[0][i][j] = 0;
                game.grid.collisionGrid[1][i][j] = 1;
                
            }
            
        }
    }
}

//called on game start
function create() {

    game.renderer.setTexturePriority(['frames']);
    game.physics.startSystem(Phaser.Physics.P2JS);

    /*       Physics custom configuration        */
    //TODO: Optimize individual object configurations to avoid undesired computations
    //950 units yielded average of 13 fps on combat and with this config yield 19-20 fps
    //game.physics.p2.emitImpactEvent = false;
    game.physics.p2.applyGravity = false;
    game.physics.p2.applyDamping = false;
    game.physics.p2.applySpringForces = false;
    game.physics.p2.friction = 0;
    game.physics.p2.frameRate = 1 / 60;
    game.physics.p2.setImpactEvents(true);

    game._collisionGroups = {
        grass: game.physics.p2.createCollisionGroup(),
        walls: game.physics.p2.createCollisionGroup(),
        level:[
            game.physics.p2.createCollisionGroup(),
            game.physics.p2.createCollisionGroup(),
        ]
    };


    game.physics.p2.updateBoundsCollisionGroup();

    paintWorldGround();
    //basic initialization
    regularAi.update(true, true);

    game.__pathfinder__.broadcast('setGrid', {
        grid: game.grid.collisionGrid
    });

    const test = new gameFramework.SiegeTower(
        game,
        500,
        500,
        'tile_45.png',
        redPlayer,
        {
            health: 1500,
            ms: 30
        }
    )
    game._units.push(test);
    game._unitIds[test._id] = test;
    //instantiate all the units in recrangular formation
    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 30; i++) {
            let unit = new gameFramework.Soldier(
                game,
                32 + 32 * j,
                32 + 32 * i,
                'axeRed.png',
                redPlayer,
                {
                    health: 100,
                    ms: 90,
                    attack: [{
                        isOnCd: false,
                        cd: 456,
                        damage: 90,
                        range: 63
                    }]
                }
            );
            let unit2 = new gameFramework.Soldier(
                game,
                (window.innerWidth - 32) - 32 * j,
                32 + 32 * i,
                'axeBlue.png',
                bluePlayer,
                {
                    health: 1,
                    ms: 60,
                    attack: [{
                        isOnCd: false,
                        cd: 1456,
                        damage: 90,
                        range: 63
                    }]
                }
            );
            game._units.push(unit, unit2);
            game._unitIds[unit._id] = unit;
            game._unitIds[unit2._id] = unit2;
        }
    }


}


function update() {
    console.log(game.time.fps);
    regularAi.update(undefined, SHOULD_GRID_UPDATE);

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
