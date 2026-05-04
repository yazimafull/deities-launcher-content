/*
   ROUTE : js/UI/menu/marchandPanel.js
   RÔLE : Panel Marchand (achat d’objets simples pour tests)
   EXPORTS : openMarchandPanel, closeMarchandPanel
   DÉPENDANCES :
     - ../data/playerBase.js (player.inventory)
     - ../systems/inventorySystem.js (addToInventory)
     - ../systems/currencySystem.js (getCurrency, spendCurrency, addCurrency)
     - ./confirmPopup.js (popup de confirmation)
     - CSS : system.css (overlay + modal + btn)
   NOTES :
     - Tooltip natif affichant :
         • Prix
         • Quantité possédée dans le coffre
         • Stats / affixes si présents
*/

import { basePlayer as player } from "../../data/playerBase.js";
import { addToInventory } from "../../systems/inventorySystem.js";
import { openConfirmPopup } from "./confirmPopup.js";
import { getCurrency, spendCurrency, addCurrency } from "../../systems/currencySystem.js";

let overlay = null;
let panel = null;

// ===============================
// CRÉATION DU PANEL
// ===============================
function createPanel() {

    overlay = document.createElement("div");
    overlay.id = "marchand-overlay";
    overlay.classList.add("overlay");
    overlay.style.zIndex = "9000";

    panel = document.createElement("div");
    panel.id = "marchand-panel";
    panel.classList.add("modal");
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";

    const title = document.createElement("h2");
    title.textContent = "Marchand des Ombres";
    title.style.textAlign = "center";
    panel.appendChild(title);

    const goldLabel = document.createElement("div");
    goldLabel.id = "marchand-gold";
    goldLabel.style.textAlign = "center";
    goldLabel.style.marginBottom = "10px";
    goldLabel.style.color = "#d4af37";
    goldLabel.style.fontFamily = "'Cinzel', serif";
    panel.appendChild(goldLabel);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Fermer";
    closeBtn.classList.add("btn");
    closeBtn.style.marginBottom = "10px";
    closeBtn.onclick = closeMarchandPanel;
    panel.appendChild(closeBtn);

    const list = document.createElement("div");
    list.id = "marchand-list";
    panel.appendChild(list);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
}

// ===============================
// REMPLIR LE PANEL
// ===============================
function refreshPanel() {
    const list = document.getElementById("marchand-list");
    list.innerHTML = "";

    document.getElementById("marchand-gold").textContent =
        `Or disponible : ${getCurrency("gold")}`;

    const itemsForSale = [
        { id: "iron_fragment", name: "Fragment de fer", type: "material", quantity: 1, price: 0 },
        { id: "wood_piece", name: "Morceau de bois", type: "material", quantity: 1, price: 3 },
        { id: "mystic_shard", name: "Éclat mystique", type: "material", quantity: 1, price: 12 },
        { id: "gold_pouch_small", name: "Petit sac d'or", givesGold: 20, price: 0 }
    ];

    itemsForSale.forEach(item => {

        const row = document.createElement("div");
        row.style.padding = "10px 0";
        row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.fontFamily = "'Cinzel', serif";
        row.style.color = "#e2d3b5";

        const label = document.createElement("span");
        label.textContent = `${item.name} — ${item.price} or`;

        // 🔥 Quantité possédée dans le coffre
        const owned = player.inventory
            .filter(i => i.id === item.id)
            .reduce((sum, i) => sum + (i.quantity ?? 1), 0);

        // 🔥 Tooltip natif complet
        let tooltip = `${item.name}\nPrix : ${item.price} or\nPossédé : ${owned}`;

        // 🔥 Ajout stats si présentes
        if (item.stats) {
            tooltip += "\n\nStats :\n" +
                Object.entries(item.stats)
                    .map(([k, v]) => `• ${k} : ${v}`)
                    .join("\n");
        }

        // 🔥 Ajout affixes si présents
        if (item.affixes) {
            tooltip += "\n\nAffixes :\n" +
                Object.entries(item.affixes)
                    .map(([k, v]) => `• ${k} +${v}`)
                    .join("\n");
        }

        label.title = tooltip;

        // Bouton acheter
        const buyBtn = document.createElement("button");
        buyBtn.textContent = "Acheter";
        buyBtn.classList.add("btn");
        buyBtn.style.padding = "6px 12px";
        buyBtn.style.fontSize = "14px";

        buyBtn.onclick = () => {

            openConfirmPopup({
                title: "Confirmer l'achat",
                message: `Acheter ${item.name} pour ${item.price} or ?`,
                onConfirm: () => {

                    if (!spendCurrency("gold", item.price)) {
                        openConfirmPopup({
                            title: "Erreur",
                            message: "Vous n'avez pas assez d'or.",
                            onConfirm: null
                        });
                        return;
                    }

                    if (item.givesGold) {
                        addCurrency("gold", item.givesGold);
                    } else {
                        addToInventory({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            quantity: item.quantity
                        });
                    }

                    document.getElementById("marchand-gold").textContent =
                        `Or disponible : ${getCurrency("gold")}`;
                }
            });
        };

        row.appendChild(label);
        row.appendChild(buyBtn);
        list.appendChild(row);
    });
}

// ===============================
// OUVERTURE / FERMETURE
// ===============================
export function openMarchandPanel() {
    if (!panel) createPanel();
    refreshPanel();
    overlay.style.display = "flex";
}

export function closeMarchandPanel() {
    if (overlay) overlay.style.display = "none";
}
