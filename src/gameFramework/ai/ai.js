const { findById } = require('../utils/utils');
const Team = require('../team/team');
const Player = require('../player/player');

const AI = function (game, id, eventCallbacks) {
    this.id = id;
    this.game = game;
    this.managing = [];
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

AI.prototype.choose = function (event, context) {
    this.game.__AIManager__.distributeWork(event, JSON.stringify(context));
}

AI.prototype.addEventHandler = function (event, handler) {
    if (!event || typeof event !== "string")
        throw new Error('can\'t add an event handler without providing an identifier for that event');

    if (!handler || typeof handler !== "function")
        throw new Error(`Expected a function as ${event} handler but got ${typeof handler} instead`);

    this.eventCallbacks[event] = handler;

}

AI.prototype.broadcastOrder = function (data) {
    const actor = findById(data.actor, this.game);
    if (actor) {
        actor.brain.onAIOrder(data.order);
    }
}

AI.prototype.threadCallback = function (e) {
    const event = e.data.event;
    let isThereCallback = false
    for (var eventHandler in this.eventCallbacks) {
        if (this.eventCallbacks.hasOwnProperty(eventHandler)) {
            if (eventHandler === event) {
                isThereCallback = true;
                this.eventCallbacks[eventHandler](e.data);
            }
        }
    }
    if (!isThereCallback) {
        this.broadcastOrder(e.data);
    }
}


module.exports = AI;