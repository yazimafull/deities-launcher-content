// ROUTE : Jeux/Sanctuaire/js/UI/loot/lootScreen.js
// ============================================================================
// RÔLE :
//   - Afficher le panneau de loot de fin de run
//   - Afficher : XP d’âme, or, items, infos de run (difficulté, enchaînement…)
//   - Permettre : Continuer la run OU Retour Sanctuaire
//   - Ne calcule rien : reçoit tout de runManager (rewards)
// ============================================================================

import { returnToSanctuary, startRunManager } from "../../core/runManager.js";

let lootScreen;
let soulXPLine;
let goldLine;
let itemsContainer;
let breakdownContainer;
let btnContinue;
let btnReturn;

export function initLootScreen() {

    // Récupération des éléments DOM
    lootScreen        = document.getElementById("loot-screen");
    soulXPLine        = document.getElementById("loot-soulxp");
    goldLine          = document.getElementById("loot-gold");
    itemsContainer    = document.getElementById("loot-items");
    breakdownContainer= document.getElementById("loot-breakdown");

    btnContinue       = document.getElementById("loot-continue");
    btnReturn         = document.getElementById("loot-return");

    if (!lootScreen) {
        console.error("❌ loot-screen introuvable dans le DOM");
        return;
    }

    // ========================================================================
    // BOUTON : CONTINUER LA RUN (niveau suivant)
    // ========================================================================
    btnContinue?.addEventListener("click", () => {

        lootScreen.classList.add("hidden");
        window.dispatchEvent(new CustomEvent("game:resume"));

        // Si on a une config de run précédente → on enchaîne
        if (window.lastRunConfig) {
            const nextConfig = structuredClone(window.lastRunConfig);
            nextConfig.difficulty = (nextConfig.difficulty ?? 1) + 1;
            startRunManager(nextConfig);
        }
    });

    // ========================================================================
    // BOUTON : RETOUR SANCTUAIRE (validation + retour)
    // ========================================================================
    btnReturn?.addEventListener("click", () => {
        lootScreen.classList.add("hidden");
        returnToSanctuary();
    });

    console.log("🎁 LootScreen initialisé");
}

// ============================================================================
// OUVERTURE DU PANNEAU DE LOOT
//   - rewards est fourni par runManager.boss:dead
//   - structure attendue :
//       {
//         gold,
//         items,
//         soulXP,
//         difficulty,
//         runChain,
//         levelLootBonus
//       }
// ============================================================================
export function openLootScreen(rewards) {

    if (!lootScreen) return;

    const {
        gold = 0,
        items = [],
        soulXP = 0,
        difficulty = 1,
        runChain = 0,
        levelLootBonus = 0
    } = rewards || {};

    // =========================================================================
    // 1) XP D’ÂME
    // =========================================================================
    soulXPLine.textContent = `XP d'âme gagnée : ${soulXP}`;

    // =========================================================================
    // 2) OR
    // =========================================================================
    goldLine.textContent = `Or gagné : ${gold}`;

    // =========================================================================
    // 3) BREAKDOWN / INFOS DE RUN
    // =========================================================================
    if (breakdownContainer) {
        breakdownContainer.innerHTML = `
            <div class="break-line">Difficulté : ${difficulty}</div>
            <div class="break-line">Enchaînement de runs : x${runChain}</div>
            <div class="break-line">Bonus de niveau (timer) : +${levelLootBonus}%</div>
        `;
        breakdownContainer.classList.remove("hidden");
    }

    // =========================================================================
    // 4) ITEMS
    // =========================================================================
    itemsContainer.innerHTML = "";

    if (items.length > 0) {
        for (const it of items) {
            const div = document.createElement("div");
            div.className = "loot-item";
            div.textContent = it.name ?? it.id ?? "Objet";
            itemsContainer.appendChild(div);
        }
    } else {
        itemsContainer.textContent = "Aucun objet trouvé.";
    }

    // =========================================================================
    // 5) AFFICHAGE DU PANNEAU + PAUSE
    // =========================================================================
    lootScreen.classList.remove("hidden");
    window.dispatchEvent(new CustomEvent("game:pause"));

    console.log("📦 Loot affiché :", rewards);
}
