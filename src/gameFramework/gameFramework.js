const Pawn = require('./pawn/pawn.js');
const Unit = require('./unit/unit.js');
const Brain = require('./brain/brain.js');
const SoldierBrain = require('./soldier/soldierBrain.js');
const Soldier = require('./soldier/soldier.js');
const SiegeTowerBrain = require('./siegeTower/siegeTowerBrain.js');
const SiegeTower = require('./siegeTower/siegeTower.js');
const globalVars = require('./global_variables/globals.js');
const Player = require('./player/player.js');
const Team = require('./team/team.js');
const AI = require('./ai/ai');
const ThreadManager = require('./threadManager/threadManager.js');
const utils = require('./utils/utils.js');

//TODO: Perform unit tests on individual classes
//TODO: Document classes
//TODO: Just export top level classes, leave basic classes as internal dependencies of the actual game classes
//TODO: Think of potential exceptions to the previous statement.

module.exports = {
    Pawn,
    Unit,
    Brain,
    Soldier,
    SoldierBrain,
    SiegeTower,
    SiegeTowerBrain,
    Player,
    Team,
    ThreadManager,
    AI,
    utils
};



// glb stands for shorthand global
for (let glb in globalVars) {
    if (globalVars.hasOwnProperty(glb)){
        if(module.exports[glb]){
            throw new Error(`Namespace clash ocurred while bootstraping ${glb} into gameFramework object`);
        }else{
            module.exports[glb] = globalVars[glb];
        }

    }
}
