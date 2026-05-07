/*
   ROUTE : js/systems/xp/jobXP.js

   RÔLE :
     - Calculer l’XP de métier (Job XP) gagnée à la fin d’une run
     - Système unifié : base = difficulté
     - Multiplicateurs : timer, affixes, items %, chain, flat
     - NE STOCKE AUCUN ÉTAT JOUEUR

   EXPORT :
     computeJobXP(rewards)

   FORMAT D’ENTRÉE (rewards) :
     {
       difficulty: Number,               // difficulté réelle
       levelLootBonus: Number,           // % bonus timer
       runChain: Number,                 // % bonus d’enchaînement
       affixes: Array<Affix>,            // affixes appliqués sur la run
       playerJobXPBonusPercent: Number,  // % bonus XP métier (player.stats.jobXpGain)
       playerJobXPBonusFlat: Number      // bonus flat (rare)
     }

   FORMAT D’UNE AFFIXE :
     {
       jobXpBonus?: Number // % bonus XP métier
     }
*/

// ============================================================================
// CALCUL FINAL DE L'XP DE MÉTIER
// ============================================================================
export function computeJobXP(rewards) {

    const {
        difficulty = 1,
        levelLootBonus = 0,          // % timer
        runChain = 0,                // % chain
        affixes = [],                // affixes
        playerJobXPBonusPercent = 0, // % items (player.stats.jobXpGain)
        playerJobXPBonusFlat = 0     // flat
    } = rewards;

    // 1) Base XP = difficulté
    let xp = difficulty;

    // 2) Bonus affixes (%)
    let affixBonusPercent = 0;
    for (const a of affixes) {
        if (a && typeof a.jobXpBonus === "number") {
            affixBonusPercent += a.jobXpBonus;
        }
    }

    // 3) Multiplicateurs
    const multTimer = 1 + levelLootBonus / 100;
    const multAffix = 1 + affixBonusPercent / 100;
    const multItems = 1 + playerJobXPBonusPercent / 100;
    const multChain = 1 + runChain / 100;

    xp *= multTimer;
    xp *= multAffix;
    xp *= multItems;
    xp *= multChain;

    // 4) Ajout du flat
    xp += playerJobXPBonusFlat;

    const finalXP = Math.floor(xp);

    // 5) Retour complet pour le loot panel
    return {
        gained: finalXP,
        baseXP: difficulty,

        breakdown: {
            levelLootBonusPercent: levelLootBonus,
            affixBonusPercent,
            itemBonusPercent: playerJobXPBonusPercent,
            chainBonusPercent: runChain,
            flatBonus: playerJobXPBonusFlat
        }
    };
}
