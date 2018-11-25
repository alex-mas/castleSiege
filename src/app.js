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



//Custom game engine modules
//TODO: Use ES6 destructuring to import relevant classes
const gameFramework = require('./gameFramework/gameFramework.js');
const Soldier = gameFramework.Soldier;
//Custom environment variables
import env from "env";

import testScenario from './scenarios/testScenario/map.json';
import testP1 from './scenarios/testScenario/player_1.json';
import testP2 from './scenarios/testScenario/player_2.json';




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
game._walls = [];

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
// player init
/*
const redPlayer = new gameFramework.Player(gameFramework.PlayerType.AI, undefined, redTeam, regularAi);
const bluePlayer = new gameFramework.Player(gameFramework.PlayerType.AI, undefined, blueTeam, regularAi);
game._players.push(redPlayer);
game._players.push(bluePlayer);
*/

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

//paints the ground sprites and stores them into memory and creates the collision grid
function paintWorldGround() {
    for (var y = 0; y < window.innerHeight / 64; y++) {
        game.grid.collisionGrid[0][y] = [];
        game.grid.collisionGrid[1][y] = [];
        game.grid.tileGrid[y] = [];
        for (var x = 0; x < window.innerWidth / 64; x++) {
            var spriteNumber = 1 + Math.round(Math.random() * 6);
            game.grid.tileGrid[y][x] = new Phaser.Sprite(game, 32 + (64 * x), 32 + (64 * y), 'frames', `tile_0${spriteNumber}.png`);
            var currentTile = game.grid.tileGrid[y][x];
            currentTile.anchor.y = 0.5;
            currentTile.anchor.y = 0.5;
            game.add.existing(currentTile);
            game.physics.p2.enable(currentTile);
            currentTile.body.kinematic = true;
            if (spriteNumber >= 7) {
                currentTile.body.debug = true;
                game.grid.collisionGrid[0][y][x] = 1;
                game.grid.collisionGrid[1][y][x] = 0;
                game.walls
                currentTile.body.setCollisionGroup(game._collisionGroups.walls);
                currentTile.body.collides([game._collisionGroups.level[0], game._collisionGroups.grass]);
            } else {
                currentTile.body.setCollisionGroup(game._collisionGroups.grass);
                currentTile.body.collides([game._collisionGroups.level[1], game._collisionGroups.walls]);
                game.grid.collisionGrid[0][y][x] = 0;
                game.grid.collisionGrid[1][y][x] = 1;

            }

        }
    }
}

function loadScenario(scenario) {
    game.world.setBounds(0, 0, scenario.layout[0].length * 64, scenario.layout.length * 64);
    for (var y = 0; y < scenario.layout.length; y++) {
        game.grid.collisionGrid[0][y] = [];
        game.grid.collisionGrid[1][y] = [];
        game.grid.tileGrid[y] = [];
        for (var x = 0; x < scenario.layout[y].length; x++) {
            if (scenario.layout[y][x] == 0) {
                var spriteNumber = 1 + Math.round(Math.random() * 5);
                game.grid.tileGrid[y][x] = new Phaser.Sprite(game, 32 + (64 * x), 32 + (64 * y), 'frames', `tile_0${spriteNumber}.png`);
                var currentTile = game.grid.tileGrid[y][x];
                currentTile.anchor.y = 0.5;
                currentTile.anchor.y = 0.5;
                game.add.existing(currentTile);
                game.physics.p2.enable(currentTile);
                currentTile.body.kinematic = true;
                currentTile.body.setCollisionGroup(game._collisionGroups.grass);
                currentTile.body.collides([game._collisionGroups.level[1], game._collisionGroups.walls]);
                game.grid.collisionGrid[0][y][x] = 0;
                game.grid.collisionGrid[1][y][x] = 1;

            } else {
                game.grid.tileGrid[y][x] = new Phaser.Sprite(game, 32 + (64 * x), 32 + (64 * y), 'frames', `tile_07.png`);
                var currentTile = game.grid.tileGrid[y][x];
                currentTile.anchor.y = 0.5;
                currentTile.anchor.y = 0.5;
                game.add.existing(currentTile);
                game.physics.p2.enable(currentTile);
                currentTile.body.kinematic = true;
                currentTile.body.setCollisionGroup(game._collisionGroups.walls);
                currentTile.body.collides([game._collisionGroups.level[0], game._collisionGroups.grass]);
                game.grid.collisionGrid[0][y][x] = 1;
                game.grid.collisionGrid[1][y][x] = 0;
                game._walls.push(currentTile);

            }
        }
    }
}


function initializeSoldier(player, x, y) {
    let skin = 'axeRed.png'
    if (player._id !== 'player1') {
        skin = 'axeBlue.png'
    }
    let unit = new gameFramework.Soldier(
        game,
        x,
        y,
        skin,
        player,
        {
            health: 100,
            ms: 60,
            attack: [{
                isOnCd: false,
                cd: 456,
                damage: 60,
                range: 63,
                ranged: false
            }],
            isRanged: false
        }
    );
    game._units.push(unit);
    game._unitIds[unit._id] = unit;
}
function initializeArcher(player, x, y) {
    let skin = 'bowRed.png'
    if (player._id !== 'player1') {
        skin = 'bowBlue.png'
    }
    let unit = new gameFramework.Soldier(
        game,
        x,
        y,
        skin,
        player,
        {
            health: 85,
            ms: 60,
            attack: [{
                isOnCd: false,
                cd: 456,
                damage: 40,
                range: 663,
                ranged: true
            }],
            isRanged: true
        }
    );
    game._units.push(unit);
    game._unitIds[unit._id] = unit;
    console.log(player);
    console.log(unit.altitudeLayer);
}
function initializeUnit(type, player, x, y) {
    if (type === 'soldier') {
        initializeSoldier(player, x, y);
    } else if (type === 'siegeTower') {

    } else if (type === 'archer') {
        initializeArcher(player, x, y);
    }
}
function initializePlayer(_player) {
    let player = undefined;
    if (_player.id === 'player1') {
        player = new gameFramework.Player(gameFramework.PlayerType.AI, _player.id, redTeam, regularAi);
    } else if (_player.id === 'player2') {
        player = new gameFramework.Player(gameFramework.PlayerType.AI, _player.id, blueTeam, regularAi);
    }
    game._players.push(player);
    for (var i = 0; i < _player.units.length; i++) {
        const unit = _player.units[i]
        initializeUnit(unit.type, player, unit.x, unit.y);
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
        level: [
            game.physics.p2.createCollisionGroup(),
            game.physics.p2.createCollisionGroup(),
        ]
    };


    game.physics.p2.updateBoundsCollisionGroup();

    //paintWorldGround();
    loadScenario(testScenario);
    initializePlayer(testP1);
    initializePlayer(testP2);
    console.log(game.grid.collisionGrid);
    console.log(game.grid.tileGrid);
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
        game._players[0],
        {
            health: 2500,
            ms: 30
        }
    )
    game._units.push(test);
    game._unitIds[test._id] = test;
    const test2 = new gameFramework.SiegeTower(
        game,
        500,
        600,
        'tile_45.png',
        game._players[0],
        {
            health: 2500,
            ms: 30
        }
    )
    game._units.push(test2);
    game._unitIds[test2._id] = test2;
    const test3 = new gameFramework.SiegeTower(
        game,
        500,
        300,
        'tile_45.png',
        game._players[0],
        {
            health: 2500,
            ms: 30
        }
    )
    game._units.push(test3);
    game._unitIds[test3._id] = test3;


    const test4 = new gameFramework.SiegeTower(
        game,
        500,
        900,
        'tile_45.png',
        game._players[0],
        {
            health: 2500,
            ms: 30
        }
    )
    game._units.push(test4);
    game._unitIds[test4._id] = test4;


}


function update() {
    console.log(game.time.fps);
    regularAi.update(undefined, SHOULD_GRID_UPDATE);
    game.camera.x += 0.15 * (game.input.mousePointer.x - window.innerWidth / 2);
    game.camera.y += 0.15 * (game.input.mousePointer.y - window.innerHeight / 2);

    //console.log(game.input.mousePointer.x, game.input.mousePointer.y);
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
