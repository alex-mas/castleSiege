
/**
 * @description Implements various diplomacy states
 * @readonly
 * @typedef {Object} DiplomacyState 
 * @property {Symbol} ALLY
 * @property {Symbol} NEUTRAL
 * @property {Symbol} ENEMY 
 */
const DiplomacyState = {
    ALLY: Symbol(1),
    NEUTRAL: Symbol(2),
    ENEMY: Symbol(3),
    NONE: Symbol(4)
}


module.exports = DiplomacyState;