const PlayerType = require('./enums/playerType.js');
const DiplomacyState = require('./enums/diplomacystate.js');

/*NOTE: we inject this properties into the game framework object later
    in case of name clash properties won't be copied into the global scope and program will exit throwing an error
*/
module.exports = {
    PlayerType,
    DiplomacyState
}