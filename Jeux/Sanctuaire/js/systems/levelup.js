// levelup.js
import { GameState, setState } from "./state.js";
import { chosenUpgrades } from "./upgradePanel.js";
import { player } from "./player.js";
import { resumeGame } from "./main.js";

const ALL_UPGRADES = [
    { name: "Vitesse +10%", apply: () => player.moveSpeedMultiplier += 0.1 },
    { name: "Dégâts +20%", apply: () => player.damage *= 1.2 },
    { name: "HP max +20", apply: () => { player.maxHp += 20; player.hp += 20; } },
    { name: "Crit +5%", apply: () => player.critChance += 0.05 },
    { name: "Bouclier +10", apply: () => player.shieldPhysical += 10 },
];

export function showLevelUpMenu() {
    setState(GameState.LEVELUP);

    const panel = document.getElementById("levelup-menu");
    const container = document.getElementById("upgrade-choices");

    panel.classList.remove("hidden");
    container.innerHTML = "";

    let options = [];
    while (options.length < 3) {
        let up = ALL_UPGRADES[Math.floor(Math.random() * ALL_UPGRADES.length)];
        if (!options.includes(up)) options.push(up);
    }

    options.forEach(up => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = up.name;

        btn.onclick = () => {
            console.log("CLICK OK");

            try {
                up.apply();
                console.log("APPLY OK");
            } catch (e) {
                console.error("ERREUR DANS APPLY :", e);
            }

            try {
                chosenUpgrades.push(up);
                console.log("PUSH OK");
            } catch (e) {
                console.error("ERREUR DANS PUSH :", e);
            }

            try {
                panel.classList.add("hidden");
                console.log("HIDE OK");
            } catch (e) {
                console.error("ERREUR DANS HIDE :", e);
            }

            try {
                resumeGame();
                console.log("RESUME OK");
            } catch (e) {
                console.error("ERREUR DANS RESUME :", e);
            }
        };

        container.appendChild(btn);
    });
}

