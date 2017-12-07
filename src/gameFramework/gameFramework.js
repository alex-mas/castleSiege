require('./pawn/pawn.js');
require('./unit/unit.js');
require('./brain/brain.js');
require('./soldier/soldierBrain.js');
require('./soldier/soldier.js');

//TODO: Perform unit tests on individual classes
//TODO: Document classes
//TODO: Just export top level classes, leave basic classes as internal dependencies of the actual game classes
//TODO: Think of potential exceptions to the previous statement.
module.exports = {
    Pawn,
    Unit,
    Brain,
    Soldier,
    SoldierBrain  
};