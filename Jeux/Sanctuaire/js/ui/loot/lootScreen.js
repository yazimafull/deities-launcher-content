/*
   ROUTE : Jeux/Sanctuaire/js/ui/loot/lootScreen.js

   RÔLE :
     - Afficher le panneau de loot de fin de run
     - Afficher : Gold (G/S/C), Soul XP, Job XP, Items, infos de run
     - Appliquer les récompenses : addCurrency(), soulXP, jobXP
     - Ne calcule rien : reçoit tout de runManager (rewards)
*/

import { returnToSanctuary, startRunManager, cleanRunOnExtract } from "../../core/runManager.js";
import { setState, GameState } from "../../core/state.js";
import { player } from "../../systems/player/player.js";
import { addCurrency, convertCopperToGSC } from "../../systems/currencySystem.js";

let lootScreen;
let lootContainer;
let itemsContainer;
let breakdownContainer;
let btnContinue;
let btnReturn;

/* ============================================================================
   INITIALISATION
============================================================================ */
export function initLootScreen() {

    lootScreen         = document.getElementById("loot-screen");
    lootContainer      = document.getElementById("loot-values");
    itemsContainer     = document.getElementById("loot-items");
    breakdownContainer = document.getElementById("loot-breakdown");

    btnContinue        = document.getElementById("loot-continue");
    btnReturn          = document.getElementById("loot-return");

    if (!lootScreen) {
        console.error("❌ loot-screen introuvable dans le DOM");
        return;
    }

    // CONTINUER LA RUN (enchaînement)
    btnContinue?.addEventListener("click", () => {

        lootScreen.classList.add("hidden");
        setState(GameState.PLAYING);

        // 🔥 BONUS XP DE RUN : +3% par étage
        player.runXpBonus = (player.runXpBonus ?? 0) + 0.03;

        if (window.lastRunConfig) {
            const nextConfig = structuredClone(window.lastRunConfig);
            nextConfig.difficulty = (nextConfig.difficulty ?? 1) + 1;
            nextConfig.continueRun = true;
            window.lastRunConfig = nextConfig;
            startRunManager(nextConfig);
        }
    });

    // RETOUR SANCTUAIRE
    btnReturn?.addEventListener("click", () => {
        lootScreen.classList.add("hidden");
        cleanRunOnExtract();     // 🔥 extraction = reset propre sans perte stuff
        returnToSanctuary();     // 🔥 retour sanctuaire
    });


    console.log("🎁 LootScreen initialisé");
}

/* ============================================================================
   UTILITAIRES UI
============================================================================ */
function createLootLine(label, value) {
    const line = document.createElement("div");
    line.className = "loot-line";

    line.innerHTML = `
        <span class="loot-label">${label}</span>
        <span class="loot-value">${value}</span>
    `;

    return line;
}

function createSeparator() {
    const sep = document.createElement("div");
    sep.className = "loot-separator";
    sep.textContent = "──────────────────────────";
    return sep;
}

/* ============================================================================
   OUVERTURE DU PANNEAU DE LOOT
============================================================================ */
export function openLootScreen(rewards) {

    if (!lootScreen) return;

    const {
        goldFinal = 0,        // en copper !
        soulXPFinal = 0,
        jobXPFinal = 0,
        items = [],
        difficulty = 1,
        runChain = 0,
        levelLootBonus = 0
    } = rewards || {};

    lootContainer.innerHTML = "";
    itemsContainer.innerHTML = "";

    /* ============================================================================
       GOLD (G/S/C)
    ============================================================================ */
    addCurrency("gold", goldFinal);

    const { gold, silver, copper } = convertCopperToGSC(goldFinal);

    lootContainer.appendChild(
        createLootLine("Or gagné :", `+${gold}🟡 ${silver}⚪ ${copper}🟤`)
    );
    lootContainer.appendChild(createSeparator());

    /* ============================================================================
       XP D’ÂME (permanent)
    ============================================================================ */
    player.soulXP = (player.soulXP ?? 0) + soulXPFinal;

    lootContainer.appendChild(
        createLootLine("XP d’âme :", `+${soulXPFinal} 💠`)
    );
    lootContainer.appendChild(createSeparator());

    /* ============================================================================
       XP DE MÉTIER (permanent)
    ============================================================================ */
    player.jobXP = (player.jobXP ?? 0) + jobXPFinal;

    lootContainer.appendChild(
        createLootLine("XP de métier :", `+${jobXPFinal} 🛠️`)
    );
    lootContainer.appendChild(createSeparator());

    /* ============================================================================
       BREAKDOWN (infos de run)
    ============================================================================ */
    breakdownContainer.innerHTML = `
        <div class="break-line">Difficulté : ${difficulty}</div>
        <div class="break-line">Enchaînement de runs : x${runChain}</div>
        <div class="break-line">Bonus timer : +${levelLootBonus}%</div>
    `;
    breakdownContainer.classList.remove("hidden");

    /* ============================================================================
       ITEMS (coffre permanent)
    ============================================================================ */
    if (items.length > 0) {
        for (const it of items) {

            // Ajout au coffre permanent
            player.inventory.push(it);

            const div = document.createElement("div");
            div.className = "loot-item";
            div.textContent = it.name ?? it.id ?? "Objet";
            itemsContainer.appendChild(div);
        }
    } else {
        itemsContainer.textContent = "Aucun objet trouvé.";
    }

    /* ============================================================================
       AFFICHAGE + PAUSE
    ============================================================================ */
    lootScreen.classList.remove("hidden");

    // 🔥 Débloque le niveau suivant
    player.unlockedLevels = Math.max(player.unlockedLevels, difficulty + 1);
    localStorage.setItem("unlockedLevels", player.unlockedLevels);

    setState(GameState.PAUSED);

    console.log("📦 Loot affiché :", rewards);
}
