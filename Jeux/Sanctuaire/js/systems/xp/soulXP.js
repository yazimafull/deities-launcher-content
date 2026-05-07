/*
   ROUTE : js/systems/xp/soulXP.js

   RÔLE :
     - Calculer l’XP d’âme (Soul XP) gagnée à la fin d’une run
     - Système unifié : base = difficulté
     - Multiplicateurs : timer, affixes, items %, chain, flat
     - NE STOCKE AUCUN ÉTAT JOUEUR

   EXPORT :
     computeSoulXP(rewards)

   FORMAT D’ENTRÉE (rewards) :
     {
       difficulty: Number,          // difficulté réelle
       levelLootBonus: Number,      // % bonus timer
       runChain: Number,            // % bonus d’enchaînement
       affixes: Array<Affix>,       // affixes appliqués
       playerXPBonusPercent: Number,// % bonus XP (player.stats.soulXpGain)
       playerXPBonusFlat: Number    // bonus flat (rare)
     }

   FORMAT D’UNE AFFIXE :
     {
       xpBonus?: Number // % bonus XP
     }
*/

// ============================================================================
// CALCUL FINAL DE L'XP D’ÂME
// ============================================================================
export function computeSoulXP(rewards) {

    const {
        difficulty = 1,
        levelLootBonus = 0,       // % timer
        runChain = 0,             // % chain
        affixes = [],             // affixes
        playerXPBonusPercent = 0, // % items (player.stats.soulXpGain)
        playerXPBonusFlat = 0     // flat (rare)
    } = rewards;

    // 1) Base XP = difficulté
    let xp = difficulty;

    // 2) Bonus affixes (%)
    let affixBonusPercent = 0;
    for (const a of affixes) {
        if (a && typeof a.xpBonus === "number") {
            affixBonusPercent += a.xpBonus;
        }
    }

    // 3) Multiplicateurs
    const multTimer = 1 + levelLootBonus / 100;
    const multAffix = 1 + affixBonusPercent / 100;
    const multItems = 1 + playerXPBonusPercent / 100; // ← player.stats.soulXpGain
    const multChain = 1 + runChain / 100;

    xp *= multTimer;
    xp *= multAffix;
    xp *= multItems;
    xp *= multChain;

    // 4) Ajout du flat (non multiplié)
    xp += playerXPBonusFlat;

    const finalXP = Math.floor(xp);

    // 5) Retour complet pour le loot panel
    return {
        gained: finalXP,     // XP finale à ajouter au joueur
        baseXP: difficulty,  // XP de base avant bonus

        breakdown: {
            levelLootBonusPercent: levelLootBonus,
            affixBonusPercent,
            itemBonusPercent: playerXPBonusPercent,
            chainBonusPercent: runChain,
            flatBonus: playerXPBonusFlat
        }
    };
}
