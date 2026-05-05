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

// ============================================================================
// INITIALISATION
// ============================================================================
export function initLootScreen() {

    lootScreen         = document.getElementById("loot-screen");
    soulXPLine         = document.getElementById("loot-soulxp");
    goldLine           = document.getElementById("loot-gold");
    itemsContainer     = document.getElementById("loot-items");
    breakdownContainer = document.getElementById("loot-breakdown");

    btnContinue        = document.getElementById("loot-continue");
    btnReturn          = document.getElementById("loot-return");

    if (!lootScreen) {
        console.error("❌ loot-screen introuvable dans le DOM");
        return;
    }

    // CONTINUER LA RUN
    btnContinue?.addEventListener("click", () => {

        lootScreen.classList.add("hidden");
        window.dispatchEvent(new CustomEvent("game:resume"));

        if (window.lastRunConfig) {
            const nextConfig = structuredClone(window.lastRunConfig);
            nextConfig.difficulty = (nextConfig.difficulty ?? 1) + 1;
            startRunManager(nextConfig);
        }
    });

    // RETOUR SANCTUAIRE
    btnReturn?.addEventListener("click", () => {
        lootScreen.classList.add("hidden");
        returnToSanctuary();
    });

    console.log("🎁 LootScreen initialisé");
}

// ============================================================================
// OUVERTURE DU PANNEAU DE LOOT
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

    // XP D’ÂME
    soulXPLine.textContent = `XP d'âme gagnée : ${soulXP}`;

    // OR
    goldLine.textContent = `Or gagné : ${gold}`;

    // BREAKDOWN
    breakdownContainer.innerHTML = `
        <div class="break-line">Difficulté : ${difficulty}</div>
        <div class="break-line">Enchaînement de runs : x${runChain}</div>
        <div class="break-line">Bonus de niveau (timer) : +${levelLootBonus}%</div>
    `;

    // ITEMS
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

    // AFFICHAGE + PAUSE
    lootScreen.classList.remove("hidden");
    window.dispatchEvent(new CustomEvent("game:pause"));

    console.log("📦 Loot affiché :", rewards);
}
