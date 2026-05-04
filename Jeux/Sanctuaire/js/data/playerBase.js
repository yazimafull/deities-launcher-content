/*
   ROUTE : data/playerBase.js
   RÔLE : TEMPLATE PLAYER (AUCUNE logique runtime)
   PRINCIPES :
     - Contient les données PERMANENTES du joueur.
     - Ne contient AUCUNE stat de combat.
     - Les stats finales viennent EXCLUSIVEMENT de playerStatsSystem.js.
*/

export const basePlayer = {

    // =====================
    // IDENTITÉ / POSITION
    // =====================
    x: 0,
    y: 0,
    size: 32,

    // =====================
    // STATS DE BASE (minimales)
    // =====================
    stats: {

        // 🟥 OFFENSE
        attackDamage: 0,
        attackDamageMultiplier: 0,

        attackSpeed: 0,
        attackSpeedMultiplier: 0,

        attackRange: 0,
        attackRangeMultiplier: 0,

        projectileSpeed: 0,
        projectileSpeedMultiplier: 0,

        projectileRange: 0,
        projectileRangeMultiplier: 0,

        projectileCount: 0,
        projectileCountMultiplier: 0,

        critChance: 0,
        critChanceMultiplier: 0,

        critMultiplier: 1,                 // valeur minimale cohérente
        critMultiplierMultiplier: 0,

        elementalDamage: 0,
        elementalDamageMultiplier: 0,

        dotDamage: 0,
        dotDamageMultiplier: 0,

        dotDuration: 0,
        dotDurationMultiplier: 0,


        // 🟩 DEFENSE
        maxHp: 1,                          // valeur minimale cohérente
        maxHpMultiplier: 0,

        regenHp: 0,
        regenHpMultiplier: 0,

        maxShield: 0,
        maxShieldMultiplier: 0,

        regenShield: 0,
        regenShieldMultiplier: 0,

        dodgeChance: 0,
        dodgeChanceMultiplier: 0,

        blockChance: 0,
        blockChanceMultiplier: 0,

        blockPower: 0,
        blockPowerMultiplier: 0,

        biomeResistance: 0,
        biomeResistanceMultiplier: 0,

        physicalResistance: 0,
        physicalResistanceMultiplier: 0,

        fireResistance: 0,
        fireResistanceMultiplier: 0,

        iceResistance: 0,
        iceResistanceMultiplier: 0,

        lightningResistance: 0,
        lightningResistanceMultiplier: 0,

        poisonResistance: 0,
        poisonResistanceMultiplier: 0,

        shadowResistance: 0,
        shadowResistanceMultiplier: 0,


        // 🟦 UTILITY
        moveSpeed: 40,                     // valeur minimale cohérente
        moveSpeedMultiplier: 0,

        lootQuantity: 0,
        lootQuantityMultiplier: 0,

        lootQuality: 0,
        lootQualityMultiplier: 0,

        currencyGain: 0,
        currencyGainMultiplier: 0,

        cooldownReduction: 0,
        cooldownReductionMultiplier: 0,

        xpGain: 0,
        xpGainMultiplier: 0,

        pickupRange: 0,
        pickupRangeMultiplier: 0,


        // 🟪 META
        spiritCost: 0,
        spiritCostMultiplier: 0,

        energyMax: 0,
        energyMaxMultiplier: 0,

        energyCost: 0,
        energyCostMultiplier: 0,
    },


    // =====================
    // PROGRESSION MÉTA
    // =====================
    soulXP: 0,
    soulLevel: 1,
    gold: 0,

    // =====================
    // INVENTAIRE PERMANENT
    // =====================
    inventory: [],

    // =====================
    // ÉQUIPEMENT PERMANENT
    // =====================
    equipment: {
        weapon: null,
        armor: null,
        trinkets: []
    },

    // =====================
    // SOURCES DE STATS PERMANENTES
    // =====================
    talents: [],
    affixes: [],
    buffs: [],

    // =====================
    // FLAGS
    // =====================
    isMob: false
};
