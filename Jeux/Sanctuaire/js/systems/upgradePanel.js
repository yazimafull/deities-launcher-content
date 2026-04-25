// systems/upgradePanel.js

let chosenUpgrades = [];

export function addUpgradeToPanel(upgrade) {
    if (!upgrade) return;
    chosenUpgrades.push(upgrade);
    const list = document.getElementById("upgrade-list");
    if (!list) return;
    const item = document.createElement("li");
    item.textContent = upgrade.name;
    list.appendChild(item);
}

export function toggleUpgradePanel() {
    const panel = document.getElementById("upgrade-panel");
    if (!panel) return;
    panel.classList.toggle("hidden");
}

export function resetUpgradePanel() {
    chosenUpgrades.length = 0;
    const list = document.getElementById("upgrade-list");
    if (list) list.innerHTML = "";
}

export function initUpgradePanel() {
    resetUpgradePanel();
}

export function getChosenUpgrades() {
    return chosenUpgrades;
}
