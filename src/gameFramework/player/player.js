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
Player = function(id,type,team, Ai){
    if(team){
        this.team = team;
        team.addMember(this);
    }else{
        this.team = new Team(`${id}'s team`,[this]);
    }
    //TODO: generate a new ID for each player
    this._id = id || 'defaultId';
    this.type = type || PlayerType.HUMAN;
    if(this.type === PlayerType.AI){
        if(Ai){
            this.AI = Ai;
        }else{
            console.warn(`${this._id} initialized as AI player without AI logic object provided`);
        }
        
    }
}



module.exports = Player;