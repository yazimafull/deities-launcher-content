/*
   ROUTE : Jeux/Sanctuaire/js/systems/xp/runXP.js

   RÔLE :
     Gestion complète de l’XP de run (temporaire).
     - Orbes physiques visibles
     - Taille dynamique selon la valeur
     - Couleur dynamique selon la valeur
     - Attraction + pickup
*/

import { openLevelUpMenu } from "../levelup.js";

/* ============================================================================
   STATE XP DE RUN
============================================================================ */
export const runXP = {
    xp: 0,
    xpToNext: 100,
    level: 1
};

/* ============================================================================
   ORBES XP PHYSIQUES
============================================================================ */
export const xpOrbs = [];

/* ============================================================================
   RESET (nouvelle run)
============================================================================ */
export function resetRunXP() {
    runXP.xp = 0;
    runXP.level = 1;
    runXP.xpToNext = 100;
    xpOrbs.length = 0;
}

/* ============================================================================
   FORMULE XP UNIFIÉE
============================================================================ */
export function computeXP(mob, config, playerStats = {}) {

    let xp = mob.baseXP ?? 1;

    // Bonus affixes (%)
    let affixBonusPercent = 0;
    if (Array.isArray(config.affixes)) {
        for (const a of config.affixes) {
            if (a && typeof a.xpBonus === "number") {
                affixBonusPercent += a.xpBonus;
            }
        }
    }
    xp *= (1 + affixBonusPercent / 100);

    // Bonus XP de run
    const runXpBonus = playerStats.runXpBonus ?? 0;
    xp *= (1 + runXpBonus);

    return Math.floor(xp);
}

/* ============================================================================
   SPAWN XP ORB
   - Taille dynamique (petite)
   - Couleur dynamique (majuscules OK)
============================================================================ */
export function spawnXP(x, y, value) {

    const xp = Math.max(value, 1); // jamais invisible

    // Taille dynamique (entre 2 et 12 px)
    const size = 2 + Math.min(Math.sqrt(xp) * 1.0, 10);

    // Couleur dynamique
    let color = "#4AA3FF"; // bleu normal

    if (xp > 20)  color = "#FFFFFF"; // blanc
    if (xp > 50)  color = "#E500FA"; // violet clair (ta couleur)
    if (xp > 100) color = "#FAB800"; // doré (ta couleur)

    xpOrbs.push({
        x,
        y,
        size,
        value: xp,
        color
    });
}


/* ============================================================================
   EVENT : ENEMY DEATH
============================================================================ */
export function onEnemyKilled(mob, config, player) {
    const xpValue = computeXP(mob, config, {
        ...player.stats,
        runXpBonus: player.runXpBonus ?? 0
    });
    spawnXP(mob.x, mob.y, xpValue);
}


/* ============================================================================
   AJOUT XP
============================================================================ */
export function addXP(amount) {
    runXP.xp += amount;

    while (runXP.xp >= runXP.xpToNext) {
        levelUp();
    }
}

/* ============================================================================
   LEVEL UP
============================================================================ */
function levelUp() {
    runXP.xp -= runXP.xpToNext;
    runXP.level++;
    runXP.xpToNext = Math.floor(runXP.xpToNext * 1.25);
    openLevelUpMenu();
}

/* ============================================================================
   UPDATE XP (ATTRACTION + PICKUP)
============================================================================ */
export function updateRunXP(player) {

    if (!player) return;

    // Bonus d'affixes
    const bonusPickup = player.stats?.pickupRange ?? 0;

    // Distance où l’orbe COMMENCE à bouger
    const attractionDistance = 100 + bonusPickup;

    // Distance où l’orbe est RAMASSÉE (collision)
    const pickupDistance = 30;

    // Vitesse d’attraction
    const basePull = 0.5;
    const pull = basePull + bonusPickup * 0.05;

    for (let i = xpOrbs.length - 1; i >= 0; i--) {

        const orb = xpOrbs[i];

        const dx = player.x - orb.x;
        const dy = player.y - orb.y;
        const dist = Math.hypot(dx, dy);

        // 🎯 Attraction : l’orbe commence à bouger quand tu es dans la zone
        if (dist < attractionDistance && dist > pickupDistance) {
            orb.x += (dx / dist) * pull;
            orb.y += (dy / dist) * pull;
        }

        // 🎯 Pickup : seulement quand ça TOUCHE le joueur
        if (dist <= pickupDistance) {
            addXP(orb.value);
            xpOrbs.splice(i, 1);
        }
    }
}


/* ============================================================================
   DRAW ORBS
============================================================================ */
export function drawRunXP(ctx) {

    if (!ctx) return;

    for (const o of xpOrbs) {
        ctx.fillStyle = o.color;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
