// ROUTE : data/playerBase.js

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
        damage: 1,
        damageMultiplier: 0,

        physicalDamage: 0,
        fireDamage: 0,
        iceDamage: 0,
        lightningDamage: 0,
        shadowDamage: 0,
        poisonDamage: 0,

        physicalDamageMultiplier: 0,
        fireDamageMultiplier: 0,
        iceDamageMultiplier: 0,
        lightningDamageMultiplier: 0,
        shadowDamageMultiplier: 0,
        poisonDamageMultiplier: 0,

        critChance: 0.1,
        critChanceMultiplier: 0,

        critMultiplier: 1.1,
        critMultiplierMultiplier: 0,

        projectileSpeed: 0,
        projectileSpeedMultiplier: 0,

        projectileRange: 0,
        projectileRangeMultiplier: 0,

        projectileCount: 0,
        projectileCountMultiplier: 0,

        dotDamage: 0,
        dotDamageMultiplier: 0,

        dotDuration: 0,
        dotDurationMultiplier: 0,

        attackSpeed: 0,
        attackSpeedMultiplier: 0,

        attackRange: 0,
        attackRangeMultiplier: 0,


        // 🟩 DÉFENSE
        maxHp: 1,
        maxHpMultiplier: 0,

        regenHp: 0.01,
        regenHpMultiplier: 0,

        maxShield: 1,
        maxShieldMultiplier: 0,

        regenShield: 0.01,
        regenShieldMultiplier: 0,

        dodgeChance: 0,
        parryChance: 0,
        blockChance: 0,
        blockPower: 0,

        physicalResistance: 0,
        fireResistance: 0,
        iceResistance: 0,
        lightningResistance: 0,
        poisonResistance: 0,
        shadowResistance: 0,

        shieldEfficiencyPhysical: 0,
        shieldEfficiencyFire: 0,
        shieldEfficiencyIce: 0,
        shieldEfficiencyLightning: 0,
        shieldEfficiencyPoison: 0,
        shieldEfficiencyShadow: 0,


        // 🟦 UTILITY
        moveSpeed: 60,
        moveSpeedMultiplier: 0,

        lootQuantity: 0,
        lootQuality: 0,

        currencyGain: 0,
        xpGain: 0,

        pickupRange: 0,


        // 🟪 META
        spiritMax: 0,
        spiritRegen: 0,
        spiritCostReduction: 0,

        energyMax: 0,
        energyRegen: 0,
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
