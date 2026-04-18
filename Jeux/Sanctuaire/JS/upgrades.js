// upgrades.js
import { player } from "./player.js";
import { addUpgradeToPanel } from "./upgradePanel.js";
import { setState, GameState } from "./state.js";

export const allUpgrades = [
    {
        name: "Feu - brûlure",
        apply() { player.element = "fire"; }
    },
    {
        name: "Glace - ralentissement",
        apply() { player.element = "ice"; }
    },
    {
        name: "Foudre - surcharge",
        apply() { player.element = "lightning"; }
    },
    {
        name: "+20% vitesse",
        apply() { player.speed *= 1.2; }
    },
    {
        name: "+20% dégâts",
        apply() { player.damage *= 1.2; }
    },
    {
        name: "+20% cadence",
        apply() { player.fireRate *= 0.8; }
    },
    {
        name: "+10% crit",
        apply() { player.critChance += 0.1; }
    },
];

export function showUpgradeChoices() {
    const menu = document.getElementById("levelup-menu");
    const container = document.getElementById("upgrade-choices");

    container.innerHTML = "";
    menu.classList.remove("hidden");

    // 3 upgrades aléatoires
    let choices = [];
    while (choices.length < 3) {
        let up = allUpgrades[Math.floor(Math.random()*allUpgrades.length)];
        if (!choices.includes(up)) choices.push(up);
    }

    choices.forEach(up => {
        let btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = up.name;

        btn.onclick = () => {
            up.apply();
            addUpgradeToPanel(up);
            menu.classList.add("hidden");
            setState(GameState.PLAYING);
        };

        container.appendChild(btn);
    });
}
