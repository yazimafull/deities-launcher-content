 // systems/upgradePanel.js

// ================================
// STATE LOCAL
// ================================
let chosenUpgrades = [];

// ================================
// API
// ================================
export function addUpgradeToPanel(upgrade) {

    if (!upgrade) return;

    chosenUpgrades.push(upgrade);

    const list = document.getElementById("upgrade-list");
    if (!list) return;

    const item = document.createElement("li");
    item.textContent = upgrade.name;

    list.appendChild(item);
}

// ================================
// PANEL VISIBILITY
// ================================
export function toggleUpgradePanel() {

    const panel = document.getElementById("upgrade-panel");
    if (!panel) return;

    panel.classList.toggle("hidden");
}

// ================================
// RESET (IMPORTANT POUR RUNS)
// ================================
export function resetUpgradePanel() {

    chosenUpgrades.length = 0;

    const list = document.getElementById("upgrade-list");
    if (list) list.innerHTML = "";
}

// ================================
// GETTER (future usage build system)
// ================================
export function getChosenUpgrades() {
    return chosenUpgrades;
}