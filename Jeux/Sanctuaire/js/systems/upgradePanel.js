﻿// systems/upgradePanel.js
/*
   ROUTE : systems/upgradePanel.js
   RÔLE : Gestion de l’affichage des upgrades choisis
   EXPORTS : addUpgradeToPanel, toggleUpgradePanel, resetUpgradePanel, initUpgradePanel, getChosenUpgrades
   DÉPENDANCES : DOM (#upgrade-list, #upgrade-panel)
   NOTES :
   - Sécurisation DOM : warnings si éléments absents
   - Aucune modification de logique
*/

let chosenUpgrades = [];

export function addUpgradeToPanel(upgrade) {
    if (!upgrade) return;

    chosenUpgrades.push(upgrade);

    const list = document.getElementById("upgrade-list");
    if (!list) {
        console.warn("⚠️ upgradePanel : #upgrade-list introuvable");
        return;
    }

    const item = document.createElement("li");
    item.textContent = upgrade.name;
    list.appendChild(item);
}

export function toggleUpgradePanel() {
    const panel = document.getElementById("upgrade-panel");
    if (!panel) {
        console.warn("⚠️ upgradePanel : #upgrade-panel introuvable");
        return;
    }
    panel.classList.toggle("hidden");
}

export function resetUpgradePanel() {
    chosenUpgrades.length = 0;

    const list = document.getElementById("upgrade-list");
    if (list) {
        list.innerHTML = "";
    } else {
        console.warn("⚠️ upgradePanel : #upgrade-list introuvable pour reset");
    }
}

export function initUpgradePanel() {
    resetUpgradePanel();
}

export function getChosenUpgrades() {
    return chosenUpgrades;
}
