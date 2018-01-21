let PlayerType = require('../global_variables/enums/playerType.js');
const Team = require('../team/team.js');
const AI = require('../ai/ai.js');


/**
 * @description Implements AI in case of AI players and unit property through unit objects
 * @typedef {Object} Player
 * @param {ObjectId} id 
 * @param {PlayerType} type
 * @param {Team} team
 * @param {AI} Ai
 */
const Player = function(Ai,type,id,team){
    if(team && team instanceof Team){
        this.team = team;
        team.addMember(this);
    }else{
        this.team = new Team(`${id}'s team`,[this]);
    }
    //TODO: generate a new ID for each player
    this._id = id || 'defaultId';
    this.type = type || PlayerType.HUMAN;
    if(type === PlayerType.AI){
        if(Ai instanceof AI){
            Ai.managePlayer(this);
            this.AI = Ai;
        }else{
            throw new Error('Unable to initialize an AI player without an AI')
        }
    }
}


Player.prototype.manageBy = function(Ai){
    if(!this.AI){
        this.type = PlayerType.AI;
    }else{
        this.AI.stopManaging(this);
        this.AI = undefined;
    }
    Ai.managePlayer(this);
    this.AI = Ai;

}


module.exports = Player;