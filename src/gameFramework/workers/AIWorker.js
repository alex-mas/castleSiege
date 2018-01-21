const chooseTargetFrom = function (enemies, actor) {
    let optimalTarget = enemies[0];
    let minimumDistance = 90000;
    //loop all enemies and save the closest target on memory
    for (var i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
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

onmessage = function (e) {
    //DATA PARSING
    let { event, context } = e.data;
    context = JSON.parse(context);
    /* QOL NAMING */
    const enemies = context.units.enemies;
    const allies = context.units.allies;
    const actor = context.actor;
    const attacks = actor.attributes.attack;
    const orders = actor.orders;
    const windowData = context.window;

    switch (event) {
        case 'soldierAI':
            if (orders.length < 1) {
                if (enemies.length > 0) {
                    let enemy = chooseTargetFrom(enemies, actor);
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
                        sendAttackOrder(event, optimalAttack, enemy, actor);
                    } else {
                        sendDynamicMovementOrder(event, enemy, actor);
                    }
                } else {
                    const
                        x = Math.random() * windowData.width - 32,
                        y = Math.random() * windowData.height - 32;
                    sendStaticMovementOrder(event, x, y, actor);
                }
            } else {
                if (orders[0].type === "dynamicMovement") {
                    if (enemies.length > 0) {
                        let enemy = chooseTargetFrom(enemies, actor);
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
                            } else {
                                sendDynamicMovementOrder(event, enemy, actor, true);
                            }
                        }
                    }
                }
            }
            break;
        default:
            break;
    }
}

