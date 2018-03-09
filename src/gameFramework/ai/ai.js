const { findById } = require('../utils/utils');
const Team = require('../team/team');
const Player = require('../player/player');
const DiplomacyState = require('../global_variables/enums/diplomacystate');

const AI = function (game, id, eventCallbacks) {

    this.id = id;

    this.game = game;

    this.managing = [];

    this.nextContextUpdate;

    this.amountOfUnits;

    this.eventCallbacks = {};

    if (eventCallbacks) {
        for (let i = 0; i < eventCallbacks.length; i++) {
            const currentEvent = eventCallbacks[i];
            if (
                typeof currentEvent[0] === 'string' &&
                typeof currentEvent[1] === 'function'
            ) {
                this.eventCallbacks[currentEvent[0]] = currentEvent[1];
            } else {
                throw new Error(`Invalid pair provided for callback initialitzation at position ${i} of 
                eventCallbacks array. Expected a string identifier as first member and got a ${typeof currentEvent[0]}
                and expected a function as second member and got a ${typeof currentEvent[1]}`)
            }
        }
    }
}

AI.prototype.managePlayer = function (player) {
    if (player.AI instanceof AI) {
        throw new Error('Unit is already being managed by an AI');
    }
    this.managing.push(player);
}

AI.prototype.stopManaging = function (player) {
    for (let i = 0; i < this.managing.length; i++) {
        if (this.managing[i] === player) {
            this.managing.splice(i, 1);
        }
    }
}

/**
 * 
 * 
 * @param {gameFramework.Unit} unit 
 * @returns 
 */
AI.prototype.parseUnitData = function (unit) {
    var obj = {
        team: unit.owner.team._id,
        id: unit._id,
        health: unit.health,
        x: unit.centerX,
        y: unit.centerY,
        altitudeLayer: unit.altitudeLayer
    };
    
    if(unit.__type__ == 'siegeTower'){
        obj.type = 'siegeTower';
        obj.settled = unit.status.settled;
    }
    return obj;
}


AI.prototype.getGameContext = function () {
    let unitsArray = this.game._units;
    let units = [];
    for (var i = 0; i < unitsArray.length; i++) {
        let gameObject = unitsArray[i];
        /*toggle*/if (gameObject.alive) {
            units.push(this.parseUnitData(gameObject));
        }/*toggle*/
    }

    return {
        units,
        window: {
            height: window.innerHeight,
            width: window.innerWidth
        }
    }
}

/**
 * 
 * @param {Boolean} updateGrid 
 * @returns {void}
 */
AI.prototype.broadcastGameContext = function (updateGrid) {
    const context = this.getGameContext();
    if(updateGrid){
        context.grid = this.game.grid.collisionGrid;
    }
    this.amountOfUnits = context.units.length;
    this.game.__AIManager__.broadcast('setContext', context);
}

/** 
 * 
 * @returns {void}
 * 
*/
AI.prototype.broadcastContextInitialization = function () {
    const context = this.getGameContext();
    context.teams = [];
    for (let i = 0; i < this.game._teams.length; i++) {
        const team = this.game._teams[i];
        let allies = [];
        let enemies = [];
        team.diplomacy.forEach((diplomacy, team, map) => {
            if (diplomacy === DiplomacyState.ALLY) {
                allies.push(team._id);
            } else if (diplomacy === DiplomacyState.ENEMY) {
                enemies.push(team._id);
            }
        });
        context.teams.push({
            id: team._id,
            allies,
            enemies,
            units: []
        });
    }
    context.grid = this.game.grid.collisionGrid;
    this.amountOfUnits = context.units.length;
    this.game.__AIManager__.broadcast('initializeContext', context);
}


/**
 * 
 * 
 * @param {String} event 
 * @param {object} context 
 * @returns {void}
 */
AI.prototype.choose = function (event, context) {
    this.game.__AIManager__.distributeWork(event, context);
}


/**
 * 
 * 
 * @param {Object} data 
 * @returns {void}
 */
AI.prototype.broadcastOrder = function (data) {
    const actor = findById(data.actor, this.game);
    if (actor) {
        actor.brain.onAIOrder(data.order);
    }
}

AI.prototype.addEventHandler = function (event, handler) {
    if (!event || typeof event !== "string")
        throw new Error('can\'t add an event handler without providing an identifier for that event');

    if (!handler || typeof handler !== "function")
        throw new Error(`Expected a function as ${event} handler but got ${typeof handler} instead`);

    this.eventCallbacks[event] = handler;

}

AI.prototype.threadCallback = function (e) {
    let event = e.data.event;
    if (this.eventCallbacks[event]) {
        this.eventCallbacks[eventHandler](e.data);
        return;
    }
    this.broadcastOrder(e.data);

}



AI.prototype.update = function (init, updateGrid) {
    if (!this.nextContextUpdate || this.nextContextUpdate <= 0) {
        this.nextContextUpdate = 1 + this.amountOfUnits / (Math.E * Math.PI);
        if (init) {
            this.broadcastContextInitialization();
        } else {
            this.broadcastGameContext(updateGrid);
        }

    } else {
        this.nextContextUpdate--;
    }
}

module.exports = AI;