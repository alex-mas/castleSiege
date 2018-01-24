const DiplomacyState = require('../global_variables/enums/diplomacystate.js');
const AI = require('../ai/ai');
const uuid = require('uuid/v4');


/**
 * 
 * @description Holds player and diplomacy data and implements utilities to manage diplomacy between teams
 * @typedef {Object} Team 
 * @property {Array[Player]} members - array of players that are in the team
 * @property {Map<Team, DiplomacyState>} diplomacy - an array of pairs that hold a team on the first member and a diplomacy setting in the second
 * @param {Array[Player]} initialMembers  - array of players inside the team
 * @param {Array[Array[Team, DiplomacyState]]} initialDiplomacy - array that holds arrays of 2 values, where 1st is a team and 2nd is a diplomacy state
 */
const Team = function (name, initialMembers, initialDiplomacy) {
    this.name = name;
    this.members = initialMembers || [];
    this.diplomacy = new Map(initialDiplomacy) || [];
    this._id = uuid();
}

/* ---------------------------------------------------------------------

                Methods to mutate members

----------------------------------------------------------------------*/


Team.prototype.addMember = function (player) {
    this.members.push(player);
}

Team.prototype.removeMember = function (player) {
    const index = this.members.findIndex(player);
    if (index > -1) {
        this.members.splice(index, 1);
    } else {
        console.warm('Attempted to remove a player from a team where he isn\'t in');
    }
}



/* ---------------------------------------------------------------------

                Methods to mutate diplomacy property

----------------------------------------------------------------------*/
Team.prototype.addEnemy = function(team){
    if(!this.hasRelationWith(team)){
        this.diplomacy.set(team, DiplomacyState.ENEMY);
    }else{
        warnOfExistingRelation(team, this);
    }
}

Team.prototype.addAlly = function(team){
    if(!this.hasRelationWith(team)){
        this.diplomacy.set(team, DiplomacyState.ALLY);
    }else{
        warnOfExistingRelation(team, this);
    }
}


Team.prototype.addNeutral = function(team){
    if(!this.hasRelationWith(team)){
        this.diplomacy.set(team, DiplomacyState.NEUTRAL);
    }else{
        warnOfExistingRelation(team, this);
    }
}


Team.prototype.removeRelation = function(team){
    if(this.hasRelationWith(team)){
        this.diplomacy.delete(team);
    }

}

Team.prototype.changeRelation = function(team, newRelation){
    this.diplomacy.set(team, newRelation);
}

/* ---------------------------------------------------------------------

                Methods to check relations between two teams

----------------------------------------------------------------------*/

/**
 * 
 * 
 * @param {Team} team 
 * @returns {Boolean}
 */
Team.prototype.hasRelationWith = function (team) {
    sanitizeInput(team);
    const relation = this.diplomacy.get(team);
    if (relation) {
        return true
    } else {
        return false
    }
}

/**
 * 
 * 
 * @param {Team} team 
 * @returns {Boolean}
 */
Team.prototype.getTeamRelation = function (team) {
    sanitizeInput(team);
    if (this.hasRelationWith(team)) {
        return this.diplomacy.get(team);
    } else {
        return DiplomacyState.NONE;
    }

}

/**
 * 
 * 
 * @param {Team} team 
 * @returns {Boolean}
 */
Team.prototype.isAllyOf = function (team) {
    sanitizeInput(team)
    if(team === this){
        return true;
    }
    let relation = this.getTeamRelation(team);
    if (relation === DiplomacyState.ALLY) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * 
 * @param {Team} team 
 * @returns {Boolean}
 */
Team.prototype.isEnemyOf = function (team) {
    sanitizeInput(team);
    let relation = this.getTeamRelation(team);
    if (relation === DiplomacyState.ENEMY) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * 
 * @param {Team} team 
 * @returns {Boolean}
 */
Team.prototype.isNeutralWith = function (team) {
    sanitizeInput(team);
    let relation = this.getTeamRelation(team);
    if (relation === DiplomacyState.NEUTRAL) {
        return true;
    } else {
        return false;
    }
}

/* ---------------------------------------------------------------------

                 Utility methods used privately by the class

----------------------------------------------------------------------*/


const isTeam = function(variable){
    if(variable instanceof Team){
        return true
    }else{
        return false
    }
}

const sanitizeInput = function(team){
    if(!isTeam(team)) console.warn(`Wrong argument type passed: was expecting a team and got a ${typeof team} with value: ${team}`);
}

const warnOfExistingRelation = function(param, caller){
    console.warn(`${param.name} and ${caller.name} already have relations, try the changeRelation() method instead`);
}

module.exports = Team;


