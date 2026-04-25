// Jeux/Sanctuaire/core/runManager.js
// ============================================================================
// ROLE
// Gestion complète d’une RUN : préparation, chargement du biome, application
// de la difficulté et des affixes, initialisation des systèmes, affichage du HUD,
// puis lancement du moteur (startRun). Gère aussi la fin de run (cleanRun).
//
// ============================================================================
// EXPORTS
// - startRunManager(config)
// - cleanRun()
//
// ============================================================================
// DEPENDANCES
// - state.js → setState, GameState
// - enemySystem.js → enemies
// - projectile.js → projectiles
// - xp.js → xpOrbs
// - boss.js → resetBoss
// - hudSystem.js → HUD
// - gameLoop.js → startRun (appelé depuis sanctuary.js)
// - biomes dynamiques → import(`../world/biome_xxx.js`)
//
// ============================================================================
// SCREEN
// Utilisé pendant la RUN (HUD + canvas).
//
// ============================================================================
// NOTES
// - startRunManager() prépare la run : biome, difficulté, affixe, systèmes.
// - startRun() (dans gameLoop.js) lance uniquement la boucle moteur.
// - cleanRun() remet tout à zéro et retourne au MENU.
// - Architecture propre : moteur pur, manager logique séparé.
// ============================================================================

import { setState, GameState } from "./state.js";
import { enemies } from "../systems/enemySystem.js";
import { projectiles } from "../systems/projectile.js";
import { xpOrbs } from "../systems/xp.js";
import { resetBoss } from "../systems/boss.js";
import { HUD } from "../ui/hud/hudSystem.js";

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

    // 2. CHARGEMENT DU BIOME
    if (config.biome) {
        const biomeId = config.biome.toLowerCase().replaceAll(" ", "_");

        import(`../world/biome_${biomeId}.js`)
            .then(module => {
                if (module.startBiome) {
                    console.log("🌍 Biome chargé :", biomeId);
                    module.startBiome(config);
                } else {
                    console.warn(`Biome ${biomeId} trouvé mais pas de startBiome()`);
                }
            })
            .catch(err => console.error("❌ Erreur chargement biome :", err));
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

    // 6. OBJECTIFS
    // TODO : si tu as un système d’objectifs, initialise-le ici

    // 7. ETAT DU JEU
    setState(GameState.PLAYING);

    console.log("✔ Run Manager prêt");
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
