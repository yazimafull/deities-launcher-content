/*
   ROUTE : Jeux/Sanctuaire/js/systems/xp/runXP.js

   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → xp → runXP.js

   RÔLE :
     Gestion complète de l’XP de run (progression temporaire).
     Centralise : calcul XP, orbes physiques, attraction, pickup, level-up.
     Reset total à chaque run. Indépendant de soulXP et jobXP.

   PRINCIPES :
     - computeXP(mob, config, playerStats) = formule unique
     - spawnXP(x, y, value) = création orbe
     - updateRunXP(player) = attraction + pickup
     - drawRunXP(ctx) = rendu des orbes
     - onEnemyKilled(mob, config, player) = point d’entrée unique
*/

import { randRange } from "../../core/utils.js";
import { openLevelUpMenu } from "../levelup.js";

// ================================
// STATE XP DE RUN
// ================================
export const runXP = {
    xp: 0,
    xpToNext: 100,
    level: 1
};

// ================================
// ORBES XP PHYSIQUES
// ================================
export const xpOrbs = [];

// ================================
// RESET (nouvelle run)
// ================================
export function resetRunXP() {
    runXP.xp = 0;
    runXP.level = 1;
    runXP.xpToNext = 100;
    xpOrbs.length = 0;
}

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
// SPAWN XP ORB
// ================================
export function spawnXP(x, y, value) {
    xpOrbs.push({
        x,
        y,
        size: 8,
        value: value ?? randRange(4, 8)
    });
}

// ================================
// EVENT : ENEMY DEATH
// ================================
export function onEnemyKilled(mob, config, player) {

    // 1) calcul XP
    const xpValue = computeXP(mob, config, player?.stats);

    // 2) création orbe
    spawnXP(mob.x, mob.y, xpValue);
}

// ================================
// AJOUT XP (pickup direct)
// ================================
export function addXP(amount) {
    runXP.xp += amount;

    while (runXP.xp >= runXP.xpToNext) {
        levelUp();
    }
}

// ================================
// LEVEL UP
// ================================
function levelUp() {
    runXP.xp -= runXP.xpToNext;
    runXP.level++;

    runXP.xpToNext = Math.floor(runXP.xpToNext * 1.25);

    openLevelUpMenu();
}

// ================================
// UPDATE XP (ATTRACTION + PICKUP)
// ================================
export function updateRunXP(player) {

    if (!player) return;

    const bonusPickup = player.stats?.pickupRange ?? 0;

    const basePickup = 20;
    const pickupDistance = basePickup + bonusPickup;

    const basePull = 1.5;
    const pull = basePull + bonusPickup * 0.05;

    for (let i = xpOrbs.length - 1; i >= 0; i--) {

        const orb = xpOrbs[i];

        const dx = player.x - orb.x;
        const dy = player.y - orb.y;
        const dist = Math.hypot(dx, dy);

        // attraction
        if (dist > 0) {
            orb.x += (dx / dist) * pull;
            orb.y += (dy / dist) * pull;
        }

        // pickup
        if (dist < pickupDistance) {

            addXP(orb.value);
            xpOrbs.splice(i, 1);
        }
    }
}

// ================================
// DRAW ORBS
// ================================
export function drawRunXP(ctx) {

    if (!ctx) return;

    ctx.fillStyle = "#4aa3ff";

    for (const o of xpOrbs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
