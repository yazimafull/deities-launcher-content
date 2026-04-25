// Jeux/Sanctuaire/core/runManager.js
/* 
   ROUTE : Jeux/Sanctuaire/core/runManager.js
   RÔLE : Orchestration complète d’une RUN (préparation, biome, HUD, moteur)
   EXPORTS : startRunManager, cleanRun
   DÉPENDANCES : state.js, enemySystem.js, projectile.js, xp.js, boss.js,
                 hudSystem.js, gameLoop.js, Biomes (registre)
   NOTES : startRunManager prépare la run, startRun lance le moteur pur.
*/

import { setState, GameState } from "./state.js";
import { enemies } from "../systems/enemySystem.js";
import { projectiles } from "../systems/projectile.js";
import { xpOrbs } from "../systems/xp.js";
import { resetBoss } from "../systems/boss.js";
import { HUD } from "../UI/hud/hudSystem.js";
import { startRun } from "./gameLoop.js";
import { Biomes } from "../data/biomes.js";   // 🔥 AJOUT : registre central

// ============================================================================
// START RUN MANAGER
// ============================================================================
export function startRunManager(config) {

    console.log("🚀 startRunManager()", config);

    // 1. RESET DES SYSTÈMES
    enemies.length = 0;
    projectiles.length = 0;
    xpOrbs.length = 0;
    resetBoss();

    // 2. CHARGEMENT DU BIOME (NOUVELLE VERSION VIA REGISTRE)
    const biome = Biomes[config.biomeId];

    if (biome) {
        console.log("🌍 Chargement biome :", biome.id);

        biome.load()
            .then(module => {
                console.log("📦 Module biome chargé :", biome.id);
                biome.start(module, config);
            })
            .catch(err => console.error("❌ Erreur chargement biome :", err));
    } else {
        console.error("❌ Biome introuvable dans le registre :", config.biomeId);
    }

    // 3. DIFFICULTÉ
    console.log("⚙️ Difficulté :", config.difficulte);
    // TODO : appliquer les multiplicateurs selon ton système

    // 4. AFFIXE (optionnel)
    if (config.affix) {
        console.log("📦 Affixe appliqué :", config.affix);
        // TODO : appliquer les effets de la pierre
    }

    // 5. HUD
    HUD.show();

    // 6. OBJECTIFS (si tu en as)
    // TODO : initialiser ici

    // 7. ETAT DU JEU
    setState(GameState.PLAYING);

    console.log("✔ Run Manager prêt");

    // 8. LANCER LE MOTEUR
    startRun(config);
}

// ============================================================================
// CLEAN RUN
// ============================================================================
export function cleanRun() {

    console.log("🧹 Clean run...");

    setState(GameState.MENU);

    enemies.length = 0;
    projectiles.length = 0;
    xpOrbs.length = 0;

    resetBoss();

    const canvas = document.getElementById("game-canvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }

    HUD.hide();
}
