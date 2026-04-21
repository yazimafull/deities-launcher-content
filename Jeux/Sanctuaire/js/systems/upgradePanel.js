// upgradePanel.js

const chosenUpgrades = [];

function addUpgradeToPanel(up) {
    chosenUpgrades.push(up);

    const list = document.getElementById("upgrade-list");
    const li = document.createElement("li");
    li.textContent = up.name;
    list.appendChild(li);
}

function toggleUpgradePanel() {
    const panel = document.getElementById("upgrade-panel");
    panel.classList.toggle("hidden");
}
