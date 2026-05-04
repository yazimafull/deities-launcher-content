/*
   ROUTE : systems/debugSystem.js
   RÔLE : Gestion centralisée du debug (touches → flags + effets runtime)
*/

import { getState, GameState } from "../core/state.js";
import { player } from "./player/player.js";

import { buildPlayerStats } from "./player/playerStatsSystem.js";
import { applyPlayerRuntimeStats } from "./player/playerRuntimeSystem.js";

const testWeapon = {
    name: "Debug Weapon",
    type: "ranged",

    attackRange: 180,

    attackDamage: 10,          // ✔️ utilisé par computeOffense
    attackCooldownMs: 600,     // ✔️ cadence correcte

    projectileSpeed: 600,
    projectileCount: 1,
    projectileRange: 600,

    element: "physical"
};


export const debugFlags = {
    ranges: false,
    testWeapon: false,
    hudEdit: false,
    collisions: false,
    ai: false,
    loot: false,
    fps: false
};

document.addEventListener("keydown", (e) => {

    if (getState() !== GameState.PLAYING) return;

    const k = e.key.toLowerCase();

    if (k === "r") debugFlags.ranges = !debugFlags.ranges;

    // ================================
    // 🔥 ARME DE DEBUG (A)
    // ================================
    if (k === "a") {

        debugFlags.testWeapon = !debugFlags.testWeapon;

        player.debugLockWeapon = debugFlags.testWeapon;

        player.testWeapon = debugFlags.testWeapon ? testWeapon : null;
        player.weapon     = debugFlags.testWeapon ? testWeapon : null;

        player.stats = buildPlayerStats(player);
        applyPlayerRuntimeStats(player);

        console.log("APPLIED AFTER LOAD:", player.weapon);
    }

    if (k === "h") debugFlags.hudEdit = !debugFlags.hudEdit;
    if (k === "c") debugFlags.collisions = !debugFlags.collisions;
    if (k === "i") debugFlags.ai = !debugFlags.ai;
    if (k === "l") debugFlags.loot = !debugFlags.loot;
    if (k === "f") debugFlags.fps = !debugFlags.fps;

    //console.log("KEY:", k);
    //console.log("WEAPON:", player.weapon);
});
