// systems/xp.js
/*
   ROUTE : Jeux/Sanctuaire/js/systems/xp.js
   RÔLE : Gestion de l’XP de run (orbes, pickup, level-up) + calcul XP finale d’un mob
   EXPORTS : xpOrbs, xpSystem, spawnXP, updateXP, drawXP, computeXP
   DÉPENDANCES :
      - utils.js (randRange)
      - levelup.js (openLevelUpMenu)
   NOTES :
      - computeXP utilise baseXP du Bestiary + difficulté + affixes + stats du joueur
      - spawnXP(x, y, value) crée une orbe d’XP avec une valeur précise
      - updateXP gère attraction + pickup + multi-level-up
      - pickupRange du joueur augmente portée + force d’attraction
      - XP de run ≠ XP d’âme (gérée dans rewardPanel)
*/

import { randRange } from "../core/utils.js";
import { openLevelUpMenu } from "./levelup.js";

export const xpOrbs = [];

export const xpSystem = {
    xp: 0,
    xpToNext: 50,
    level: 1
};

// ================================
// CALCUL XP FINALE D’UN MOB
// ================================
export function computeXP(mob, config, playerStats = {}) {

    // baseXP du Bestiary
    let xp = mob.baseXP ?? 1;

    // difficulté (I=1, II=2, III=3)
    xp *= config.difficulty ?? 1;

    // affixes globaux (exemple)
    if (config.affix === "xp_bonus") {
        xp *= 1.25;
    }

    // stats du joueur (xpGain additive)
    const xpGain = playerStats.xpGain ?? 0;
    xp *= (1 + xpGain / 100);

    return Math.floor(xp);
}

// ================================
// SPAWN XP ORB (VALEUR DIRECTE)
// ================================
export function spawnXP(x, y, value) {
    xpOrbs.push({
        x,
        y,
        size: 8,
        value: value ?? randRange(4, 8) // fallback sécurité
    });
}

// ================================
// UPDATE XP SYSTEM
// ================================
export function updateXP(player) {

    if (!player) {
        console.warn("⚠️ updateXP : player manquant");
        return;
    }

    // Stat du joueur : portée de pickup
    const bonusPickup = player.stats?.pickupRange ?? 0;

    // Distance de pickup
    const basePickup = 20;
    const pickupDistance = basePickup + bonusPickup;

    // Force d’attraction
    const basePull = 1.5;
    const pull = basePull + bonusPickup * 0.05;

    for (let i = xpOrbs.length - 1; i >= 0; i--) {

        const orb = xpOrbs[i];

        const dx = player.x - orb.x;
        const dy = player.y - orb.y;
        const dist = Math.hypot(dx, dy);

        // attraction dynamique
        if (dist > 0) {
            orb.x += (dx / dist) * pull;
            orb.y += (dy / dist) * pull;
        }

        // pickup dynamique
        if (dist < pickupDistance) {

            xpSystem.xp += orb.value;
            xpOrbs.splice(i, 1);

            // LEVEL UP LOOP (multi-level safe)
            while (xpSystem.xp >= xpSystem.xpToNext) {

                xpSystem.xp -= xpSystem.xpToNext;
                xpSystem.level++;
                xpSystem.xpToNext = Math.floor(xpSystem.xpToNext * 1.25);

                openLevelUpMenu();
            }
        }
    }
}

// ================================
// DRAW ORBS
// ================================
export function drawXP(ctx) {

    if (!ctx) {
        console.warn("⚠️ drawXP : ctx manquant");
        return;
    }

    ctx.fillStyle = "#4aa3ff";

    for (const o of xpOrbs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
