/*
   ROUTE : js/systems/xp/soulXP.js

   RÔLE :
     - Calculer l’XP d’âme (Soul XP) gagnée à la fin d’un niveau
     - Fournir une base XP en fonction de la difficulté (tiers infinis)
     - Appliquer tous les multiplicateurs (timer, affixes, items, chain)
     - NE STOCKE AUCUN ÉTAT JOUEUR (le joueur garde ses propres stats)

   PROTOCOLE :
     - Appelé par : runManager / lootScreen
     - Entrée : un objet `rewards` (voir format plus bas)
     - Sortie : un objet de breakdown + `gained` (XP finale à ajouter au joueur)

   FORMAT D’ENTRÉE (rewards) :
     {
       difficulty: Number,          // difficulté réelle (1, 2, 3, ... infini)
       levelLootBonus: Number,      // % bonus timer pour CE niveau (ex : 20 pour +20%)
       runChain: Number,            // % bonus d’enchaînement (1% par niveau consécutif)
       affixes: Array<Affix>,       // affixes appliqués sur la run (optionnel)
       playerXPBonusPercent: Number,// % bonus XP des items (équipement)
       playerXPBonusFlat: Number    // BONUS XP FLAT (futur gobelin rare, etc.) → 0 pour l’instant
     }

   FORMAT D’UNE AFFIXE (minimal) :
     {
       xpBonus?: Number // % bonus XP (ex : 10 pour +10%)
     }
*/

// ============================================================================
// CONSTANTES DE BASE
// ============================================================================
const BASE_TIER_XP = 100;   // XP de base du Tier 1
const BASE_STEP_XP = 5;     // Incrément de base par niveau dans le Tier 1

// ============================================================================
// CALCUL DU TIER À PARTIR DE LA DIFFICULTÉ
//   T1 : 1–9, T2 : 10–19, T3 : 20–29, etc.
// ============================================================================
export function getTierFromDifficulty(difficulty) {
    return Math.floor((difficulty - 1) / 10) + 1;
}

// ============================================================================
// CALCUL DE LA BASE XP SELON TES RÈGLES
//   - Tier 1 : base 100, +5 par niveau (1–9)
//   - Tier 2 : base 200, +10 par niveau (10–19)
//   - Tier 3 : base 400, +15 par niveau (20–29)
//   - etc. (base ×2, step +5 par Tier)
// ============================================================================
export function computeBaseSoulXP(difficulty) {

    const tier = getTierFromDifficulty(difficulty);

    const baseXP = BASE_TIER_XP * Math.pow(2, tier - 1); // 100, 200, 400, 800, ...
    const bonusPerLevel = BASE_STEP_XP * tier;           // 5, 10, 15, 20, ...
    const offset = (difficulty - 1) % 10;                // 0 → 9

    return {
        tier,
        baseXP,
        bonusPerLevel,
        offset,
        value: baseXP + bonusPerLevel * offset
    };
}

// ============================================================================
// NOTE IMPORTANTE (FUTUR) :
//   playerXPBonusFlat est prévu pour des sources rares de bonus XP FLAT
//   (ex : gobelin rare, bénédiction, objet de quête).
//   Pour l’instant, tu peux le laisser à 0 côté joueur.
// ============================================================================

// ============================================================================
// CALCUL FINAL DE L'XP D'ÂME GAGNÉE
//   - Applique : timer, affixes, items %, chain, puis XP flat
//   - Ne touche PAS au joueur : il retourne juste les valeurs
// ============================================================================
export function computeSoulXP(rewards) {

    const {
        difficulty,
        levelLootBonus = 0,       // % timer
        runChain = 0,             // % chain
        affixes = [],             // affixes
        playerXPBonusPercent = 0, // % items
        playerXPBonusFlat = 0     // flat (futur gobelin rare)
    } = rewards;

    // 1) Base XP
    const base = computeBaseSoulXP(difficulty);
    let xp = base.value;

    // 2) Bonus affixes (%)
    let affixBonusPercent = 0;
    for (const a of affixes) {
        if (a && typeof a.xpBonus === "number") {
            affixBonusPercent += a.xpBonus;
        }
    }

    // 3) Multiplicateurs (en % → convertis en multiplicateurs)
    const multTimer   = 1 + levelLootBonus      / 100;
    const multAffix   = 1 + affixBonusPercent   / 100;
    const multItems   = 1 + playerXPBonusPercent/ 100;
    const multChain   = 1 + runChain            / 100;

    xp *= multTimer;
    xp *= multAffix;
    xp *= multItems;
    xp *= multChain;

    // 4) Ajout du flat (non multiplié)
    xp += playerXPBonusFlat;

    const finalXP = Math.floor(xp);

    // 5) Retour complet pour le loot panel
    return {
        gained: finalXP,                 // XP finale à ajouter au joueur
        baseXP: base.value,              // XP de base avant bonus
        tier: base.tier,                 // Tier utilisé
        bonusPerLevel: base.bonusPerLevel,
        offset: base.offset,             // position dans le Tier (0–9)

        breakdown: {
            levelLootBonusPercent: levelLootBonus,
            affixBonusPercent,
            itemBonusPercent: playerXPBonusPercent,
            chainBonusPercent: runChain,
            flatBonus: playerXPBonusFlat
        }
    };
}
