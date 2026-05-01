/*
   ROUTE : data/playerBase.js
   RÔLE : TEMPLATE PLAYER (AUCUN runtime logic)
   PRINCIPLE :
     - Données de base du joueur uniquement
     - Jamais de logique ou de calcul
*/

export const basePlayer = {

    // =====================
    // POSITION
    // =====================
    x: 0,
    y: 0,
    size: 32,

    // =====================
    // SURVIE
    // =====================
    hp: 100,
    maxHp: 100,
    hpRegen: 0,

    shield: 0,
    maxShield: 0,
    shieldRegen: 0,

    // =====================
    // MOBILITY
    // =====================
    speed: 240,

    // =====================
    // OFFENSE
    // =====================
    weapon: null,

    baseDamage: 0,
    bonusDamage: 0,

    // =====================
    // ECONOMY
    // =====================
    gold: 0,
    inventory: [],

    // =====================
    // MODIFIERS
    // =====================
    affixes: [],
    buffs: [],
    talents: [],

    // =====================
    // FLAGS
    // =====================
    isMob: false,
};