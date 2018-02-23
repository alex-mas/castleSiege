let gameContext = {};


const sendEmptyOrder = function (event, actor, error) {
    postMessage({
        event: event,
        order: {
            error,
            replace: false
        },
        actor: actor.id
    });
}

const sendAttackOrder = function (event, attackIndex, target, actor, replaceOrder = false) {
    postMessage({
        event: event,
        order: {
            type: 'attack',
            method: 'multiple',
            done: false,
            target: target.id,
            attack: attackIndex,
            replace: replaceOrder
        },
        actor: actor.id
    });
}

const sendDynamicMovementOrder = function (event, target, actor, replaceOrder = false) {
    postMessage({
        event: event,
        order: {
            type: 'dynamicMovement',
            target: target.id,
            points: undefined,
            computed: false,
            beingComputed: false,
            replace: replaceOrder
        },
        actor: actor.id
    });
}

const sendStaticMovementOrder = function (event, x, y, actor, replaceOrder = false) {
    postMessage({
        event: event,
        order: {
            type: 'staticMovement',
            x,
            y,
            points: undefined,
            computed: false,
            beingComputed: false,
            replace: replaceOrder
        },
        actor: actor.id
    });
}

const sendUseElevatorOrder = function (event, actor, replaceOrder = false) {
    postMessage({
        event: event,
        order: {
            type: 'useElevator',
            replace: replaceOrder
        },
        actor: actor.id
    });
}


const distributeUnits = function () {
    //reset unit arrays
    for (let j = 0; j < gameContext.teams.length; j++) {
        gameContext.teams[j].units = [];
    }
    //populate unit arrays in function of its team
    gameContext.elevators = [];
    for (let i = 0; i < gameContext.units.length; i++) {
        if (gameContext.units[i].type == 'siegeTower') {
            gameContext.elevators.push(gameContext.units[i]);
        }
        for (let j = 0; j < gameContext.teams.length; j++) {
            if (gameContext.teams[j].id === gameContext.units[i].team) {
                gameContext.teams[j].units.push(gameContext.units[i]);
            }
        }
    }
}

const getEnemies = function (teamId) {
    let enemies = [];
    //iterate teams
    for (let i = 0; i < gameContext.teams.length; i++) {
        const team = gameContext.teams[i];
        //itearate its enemies  id's
        for (let j = 0; j < team.enemies.length; j++) {
            const enemy = team.enemies[j];
            //if enemy id match with the provided id, it means both teams are enemies
            if (enemy === teamId) {
                //then we push the units of that team to enemies array
                enemies = enemies.concat(team.units);
            }
        }
    }
    return enemies;
}

/**
 * 
 * 
 * @param {gameFramework.Pawn} actor 
 * @returns {gameFramewor.SiegeTower} - closest ally siege tower to the actor
 */
const searchElevator = function (actor) {
    let closestElevator = undefined;
    let distanceToElevator = undefined;
    for (let i = 0; i < gameContext.elevators.length; i++) {
        const elevator = gameContext.elevators[i];
        if (
            elevator.team === actor.team
            //&& elevator.settled
        ) {
            if (closestElevator) {

                let distance = Math.sqrt((elevator.x - actor.x) ** 2 + (elevator.y - actor.y) ** 2);
                if (distance < distanceToElevator) {
                    closestElevator = elevator;
                }
            } else {
                closestElevator = elevator;
                distanceToElevator = Math.sqrt((elevator.x - actor.x) ** 2 + (elevator.y - actor.y) ** 2);
            }
        }
    }
    return closestElevator;
}

const chooseTargetFrom = function (enemies, actor) {
    let optimalTarget = undefined;
    let minimumDistance = 90000;
    //loop all enemies and save the closest target on memory
    for (var i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (enemy.health < 0) {
            continue;
        }
        if (enemy.altitudeLayer != actor.altitudeLayer) {
            continue;
        }
        let distance = Math.sqrt((enemy.x - actor.x) ** 2 + (enemy.y - actor.y) ** 2);
        if (distance < minimumDistance) {
            minimumDistance = distance;
            optimalTarget = enemy;
        }
    }
    //return closest target
    return optimalTarget;
}

const isInAttackRange = function (actor, attack, enemy) {
    let dx = enemy.x - actor.x,
        dy = enemy.y - actor.y,
        distance = Math.sqrt(dx ** 2 + dy ** 2);
    if (distance <= attack.range) {
        return true
    } else {
        return false
    }
}


onmessage = function (e) {

    //DATA PARSING
    let context;
    let event;
    if (typeof e.data === 'object') {
        event = e.data.event;
        context = e.data.context;
    } else if (typeof e.data === 'string') {
        const data = JSON.parse(e.data);
        event = data.event;
        context = data.context;

    }

    //event handling
    switch (event) {
        case 'initializeContext':
            gameContext = context;
            distributeUnits();
            break;
        case 'setContext':
            gameContext.units = context.units;
            gameContext.window = context.window;
            if (context.grid) {
                gameContext.grid = context.grid;
            }
            distributeUnits();
            break;
        case 'soldierAI':
            /* QOL NAMING */
            const actor = context;
            const attacks = actor.attributes.attack;
            const orders = actor.orders;
            const windowData = gameContext.window;
            if (orders.length < 1) {
                let enemies = getEnemies(actor.team);
                if (enemies.length > 0) {
                    let enemy = chooseTargetFrom(enemies, actor);
                    if (!enemy) {
                        const elevator = searchElevator(actor);
                        console.log('here',elevator);
                        if (elevator) {

                            let distance = Math.sqrt((elevator.x - actor.x) ** 2 + (elevator.y - actor.y) ** 2);
                            //if in range, send order to climb either send static move
                            if (distance < 16) {
                                sendUseElevatorOrder(event, actor, true);
                                return;
                            } else {
                                sendStaticMovementOrder(event, elevator.x, elevator.y, actor);
                                return;
                            }

                        }
                    } else {
                        let maximumDamage = 0;
                        let optimalAttack = undefined;
                        let shouldCheckAttacks = true;
                        if (attacks.length === 1) {
                            if (isInAttackRange(actor, attacks[0], enemy)) {
                                optimalAttack = 0;
                            } else {
                                shouldCheckAttacks = false;
                            }

                        } else if (attacks.length < 1) {
                            shouldCheckAttacks = false;
                        } else if (shouldCheckAttacks) {
                            for (let i = 0; i < attacks.length; i++) {
                                let attack = attacks[i];
                                if (isInAttackRange(actor, attack, enemy)) {
                                    if (attack.damage > maximumDamage) {
                                        maximumDamage = attack.damage;
                                        optimalAttack = i;
                                    }
                                }
                            }
                        }
                        if (optimalAttack !== undefined) {
                            sendAttackOrder(event, optimalAttack, enemy, actor);
                            return;
                        } else {
                            sendDynamicMovementOrder(event, enemy, actor);
                            return;
                        }
                    }

                } else {
                    var x = Math.random() * windowData.width - 32,
                        y = Math.random() * windowData.height - 32;
                    sendStaticMovementOrder(event, x, y, actor);
                    return;

                }
            } else {
                if (orders[0].type === "dynamicMovement") {
                    let enemies = getEnemies(actor.team);
                    if (enemies.length > 0) {
                        let enemy = chooseTargetFrom(enemies, actor);
                        if (!enemy) {
                            const elevator = searchElevator(actor);
                            console.log('here',elevator);
                            if (elevator) {
                                let distance = Math.sqrt((elevator.x - actor.x) ** 2 + (elevator.y - actor.y) ** 2);
                                //if in range, send order to climb either send static move
                                if (distance < 16) {
                                    sendUseElevatorOrder(event, actor, true);
                                    return;
                                } else {
                                    sendStaticMovementOrder(event, elevator.x, elevator.y, actor);
                                    return;
                                }

                            }
                        } else {
                            if (enemy.id !== orders[0].target.id) {
                                let maximumDamage = 0;
                                let optimalAttack = undefined;
                                for (let i = 0; i < attacks.length; i++) {
                                    let attack = attacks[i];
                                    if (isInAttackRange(actor, attack, enemy)) {
                                        if (attack.damage > maximumDamage) {
                                            maximumDamage = attack.damage;
                                            optimalAttack = i;
                                        }
                                    }
                                }
                                if (optimalAttack !== undefined) {
                                    sendAttackOrder(event, optimalAttack, enemy, actor, true);
                                    return;
                                } else {
                                    sendDynamicMovementOrder(event, enemy, actor, true);
                                    return;
                                }
                            }
                        }

                    } else {
                        sendEmptyOrder(event, actor, 'ERROR: no enemy units found and unit has dynamic mov order');
                        return;
                    }
                }
                sendEmptyOrder(event, actor, 'ERROR: more than one order and first order isnt of type dynamic movement');
                return;
            }
            break;
        case 'siegeTowerAI':
            sendEmptyOrder(event, context, 'ERROR: siege towers are too scrub to have an ai');
            return;
        default:
            break;
    }
}

