/*
   ROUTE : js/UI/menu/coffrePanel.js
   RÔLE : Affichage du coffre (inventaire permanent)
   EXPORTS : openCoffrePanel, closeCoffrePanel
*/

import { basePlayer as player } from "../../data/playerBase.js";
import { removeFromInventory } from "../../systems/inventorySystem.js";

let overlay = null;
let panel = null;

/* ============================================================
   FORMATAGE TOOLTIP (stats + affixes)
============================================================ */

// Formatage universel → 2 décimales si nombre
function formatValue(v) {
    return typeof v === "number" ? v.toFixed(2) : v;
}

function buildTooltip(item) {
    let lines = [];

    // Nom
    lines.
    
    
    (item.name);

    // Stats
    if (item.stats) {
        for (const [key, value] of Object.entries(item.stats)) {
            lines.
            
            
            (formatStat(key, value));
        }
    }

    // Affixes
    if (item.affixes) {
        for (const [key, value] of Object.entries(item.affixes)) {
            lines.
            (formatAffix(key, value));
        }
    }

    return lines.join("\n");
}

function formatStat(key, value) {
    const v = formatValue(value);

    switch (key) {
        case "attackDamage": return `+${v} Dégâts`;
        case "attackSpeed": return `+${(value * 100).toFixed(2)}% Vitesse d’attaque`;
        case "armor": return `+${v} Armure`;
        case "maxHp": return `+${v} PV`;
        default: return `${key} : ${v}`;
    }
}

function formatAffix(key, value) {
    const v = formatValue(value);

    switch (key) {
        case "critChance": return `+${(value * 100).toFixed(2)}% Chance de critique`;
        case "fireRes": return `+${v}% Résistance Feu`;
        default: return `${key} : ${v}`;
    }
}

/* ============================================================
   CRÉATION DU PANEL
============================================================ */

function createPanel() {

    overlay = document.createElement("div");
    overlay.id = "coffre-overlay";
    overlay.classList.add("overlay");
    overlay.style.zIndex = "9000";

    panel = document.createElement("div");
    panel.id = "coffre-panel";
    panel.classList.add("modal");
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";

    const title = document.createElement("h2");
    title.textContent = "Coffre du Sanctuaire";
    title.style.textAlign = "center";
    panel.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Fermer";
    closeBtn.classList.add("btn");
    closeBtn.style.marginBottom = "10px";
    closeBtn.onclick = closeCoffrePanel;
    panel.appendChild(closeBtn);

    const list = document.createElement("div");
    list.id = "coffre-list";
    panel.appendChild(list);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
}

/* ============================================================
   REMPLIR LE PANEL
============================================================ */

function refreshPanel() {
    const list = document.getElementById("coffre-list");
    list.innerHTML = "";

    if (player.inventory.length === 0) {
        list.textContent = "Votre coffre est vide.";
        return;
    }

    player.inventory.forEach(item => {

        const row = document.createElement("div");
        row.style.padding = "6px 0";
        row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        row.style.fontFamily = "'Cinzel', serif";
        row.style.color = "#e2d3b5";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";

        const name = item.name || item.id;
        const qty = item.quantity != null ? `x${item.quantity}` : "(unique)";

        const label = document.createElement("span");
        label.textContent = `${name} ${qty}`;
        row.appendChild(label);

        // Tooltip propre
        row.onmouseenter = () => {
            row.title = buildTooltip(item);
        };

        // Bouton supprimer
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.padding = "2px 6px";
        deleteBtn.style.fontSize = "12px";
        deleteBtn.style.background = "#922";
        deleteBtn.style.color = "white";
        deleteBtn.style.border = "1px solid #400";
        deleteBtn.style.cursor = "pointer";

        deleteBtn.onclick = () => {
            removeFromInventory(item.id, item.quantity ?? 1);
            refreshPanel();
        };

        row.appendChild(deleteBtn);
        list.appendChild(row);
    });
}

/* ============================================================
   OUVERTURE / FERMETURE
============================================================ */

export function openCoffrePanel() {
    if (!panel) createPanel();
    refreshPanel();
    overlay.style.display = "flex";
}

export function closeCoffrePanel() {
    if (overlay) overlay.style.display = "none";
}
