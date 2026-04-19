// upgradePanel.js

export const chosenUpgrades = [];

export function addUpgradeToPanel(up) {
    chosenUpgrades.push(up);

    const list = document.getElementById("upgrade-list");
    const li = document.createElement("li");
    li.textContent = up.name;
    list.appendChild(li);
}

export function toggleUpgradePanel() {
    const panel = document.getElementById("upgrade-panel");
    panel.classList.toggle("hidden");
}
