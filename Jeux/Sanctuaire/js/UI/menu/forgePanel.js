/*
   ROUTE : js/UI/menu/forgePanel.js
   RÔLE :
     - Panel UI complet de la Forge :
         • Onglet FABRICATION (recettes → pièces)
         • Onglet ASSEMBLAGE (pièces → équipement final)
     - Gère :
         • Sélecteur d’items
         • Slots d’assemblage (armes + armures)
         • Affichage d’icônes
         • Consommation des pièces
         • Stats preview
*/

import { ForgeRecipes } from "../../systems/forge/forgeRecipes.js";
import { canCraft, craftItem } from "../../systems/forge/forgeSystem.js";
import { getInventory, consumeItemInstance, addToInventory, removeFromInventory } from "../../systems/inventorySystem.js";
import { openConfirmPopup } from "./confirmPopup.js";

import { assembleWeaponSimple } from "../../systems/item/assembleWeaponSimple.js";
import { assembleArmorSimple } from "../../systems/item/assembleArmorSimple.js";
import { autoEquipIfPossible } from "./pylonePanel.js";

let overlay = null;
let panel = null;

let craftSection = null;
let assembleSection = null;

let weaponSlots = [];
let armorSlots = [];

/* ======================================================
   FORMATAGE DES STATS / AFFIXES
====================================================== */
function formatStat(key, value) {
    return `${key} : ${value}`;
}

function formatAffix(key, value) {
    return `${key} : ${value}`;
}

/* ======================================================
   TYPES DE SLOTS
====================================================== */
const WEAPON_SLOT_TYPES = ["string", "frame", "blade"];
const ARMOR_SLOT_TYPES = ["helmet", "chest", "gloves", "boots", "pants", "shoulders"];

/* ======================================================
   UTILITAIRE : affichage d’un slot (icône ou texte)
====================================================== */
function updateSlotVisual(slot, item) {
    slot.innerHTML = "";

    if (!item) return;

    if (item.icon) {
        const img = document.createElement("img");
        img.src = item.icon;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        slot.appendChild(img);
    } else {
        slot.textContent = item.name || item.id;
    }
}

/* ======================================================
   CRÉATION DU PANEL
====================================================== */
function createPanel() {

    overlay = document.createElement("div");
    overlay.id = "forge-overlay";
    overlay.classList.add("overlay");
    overlay.style.zIndex = "9000";

    panel = document.createElement("div");
    panel.id = "forge-panel";
    panel.classList.add("modal");
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";

    const title = document.createElement("h2");
    title.textContent = "Forge Sacrée";
    title.style.textAlign = "center";
    panel.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Fermer";
    closeBtn.classList.add("btn");
    closeBtn.style.marginBottom = "10px";
    closeBtn.onclick = closeForgePanel;
    panel.appendChild(closeBtn);

    const tabs = document.createElement("div");
    tabs.style.display = "flex";
    tabs.style.gap = "10px";
    tabs.style.marginBottom = "15px";

    const tabCraft = document.createElement("button");
    tabCraft.textContent = "Fabrication";
    tabCraft.classList.add("btn");
    tabCraft.onclick = () => switchTab("craft");

    const tabAssemble = document.createElement("button");
    tabAssemble.textContent = "Assemblage";
    tabAssemble.classList.add("btn");
    tabAssemble.onclick = () => switchTab("assemble");

    tabs.appendChild(tabCraft);
    tabs.appendChild(tabAssemble);
    panel.appendChild(tabs);

    craftSection = document.createElement("div");
    assembleSection = document.createElement("div");
    assembleSection.style.display = "none";

    panel.appendChild(craftSection);
    panel.appendChild(assembleSection);

    const list = document.createElement("div");
    list.id = "forge-list";
    craftSection.appendChild(list);

    createAssemblyUI();

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
}

/* ======================================================
   UI ASSEMBLAGE
====================================================== */
function createAssemblyUI() {

    /* ============================
       CONTENEUR GLOBAL (2 colonnes)
    ============================ */
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "20px";

    /* ============================
       COLONNE GAUCHE : SLOTS
    ============================ */
    const leftCol = document.createElement("div");
    leftCol.style.display = "flex";
    leftCol.style.flexDirection = "column";
    leftCol.style.alignItems = "center";
    leftCol.style.gap = "20px";

    /* ------------------ ARMES ------------------ */
    const weaponTitle = document.createElement("h3");
    weaponTitle.textContent = "Assemblage Arme";
    weaponTitle.style.textAlign = "center";
    leftCol.appendChild(weaponTitle);

    const weaponGrid = document.createElement("div");
    weaponGrid.style.display = "grid";
    weaponGrid.style.gridTemplateColumns = "repeat(3, 64px)";
    weaponGrid.style.gap = "10px";
    weaponGrid.style.justifyContent = "center";

    WEAPON_SLOT_TYPES.forEach(type => {
        const slot = createSlot(type);
        weaponSlots.
        
        
        (slot);
        weaponGrid.appendChild(slot);
    });

    leftCol.appendChild(weaponGrid);

    /* ------------------ ARMURES ------------------ */
    const armorTitle = document.createElement("h3");
    armorTitle.textContent = "Assemblage Armure";
    armorTitle.style.textAlign = "center";
    leftCol.appendChild(armorTitle);

    const armorGrid = document.createElement("div");
    armorGrid.style.display = "grid";
    armorGrid.style.gridTemplateColumns = "repeat(3, 64px)";
    armorGrid.style.gap = "10px";
    armorGrid.style.justifyContent = "center";

    ARMOR_SLOT_TYPES.forEach(type => {
        const slot = createSlot(type);
        armorSlots.
        
        
        (slot);
        armorGrid.appendChild(slot);
    });

    leftCol.appendChild(armorGrid);

    /* ------------------ BOUTON ASSEMBLER ------------------ */
    const assembleBtn = document.createElement("button");
    assembleBtn.textContent = "Assembler";
    assembleBtn.classList.add("btn");
    assembleBtn.style.marginTop = "10px";
    assembleBtn.onclick = assembleItems;

    leftCol.appendChild(assembleBtn);

    /* ============================
       COLONNE DROITE : RÉCAP
    ============================ */
    const rightCol = document.createElement("div");
    rightCol.style.width = "220px";
    rightCol.style.background = "rgba(0,0,0,0.4)";
    rightCol.style.border = "1px solid rgba(255,255,255,0.1)";
    rightCol.style.padding = "12px";
    rightCol.style.fontFamily = "'Cinzel', serif";
    rightCol.style.color = "#e2d3b5";

    const recapTitle = document.createElement("h3");
    recapTitle.textContent = "Assemblage final";
    rightCol.appendChild(recapTitle);

    const recapStats = document.createElement("div");
    recapStats.id = "assembly-summary";
    recapStats.innerHTML = "<i>Aucune statistique</i>";
    rightCol.appendChild(recapStats);

    /* ============================
       ASSEMBLAGE FINAL
    ============================ */
    container.appendChild(leftCol);
    container.appendChild(rightCol);
    assembleSection.appendChild(container);
}





/* ======================================================
   SLOT
====================================================== */
function createSlot(slotType) {
    const slot = document.createElement("div");
    slot.dataset.slotType = slotType;
    slot.item = null;

    slot.style.width = "64px";
    slot.style.height = "64px";
    slot.style.border = "2px solid rgba(255,255,255,0.2)";
    slot.style.background = "rgba(0,0,0,0.3)";
    slot.style.borderRadius = "4px";
    slot.style.display = "flex";
    slot.style.alignItems = "center";
    slot.style.justifyContent = "center";
    slot.style.cursor = "pointer";
    slot.style.overflow = "hidden";

    slot.onclick = () => {
        openForgeItemSelector(slot);
    };

    return slot;
}


/* ======================================================
   SÉLECTEUR D’ITEMS
====================================================== */
function openForgeItemSelector(targetSlot) {

    const inv = getInventory();
    const slotType = targetSlot.dataset.slotType;

    const selectorOverlay = document.createElement("div");
    selectorOverlay.classList.add("overlay");
    selectorOverlay.style.zIndex = "9500";

    const selector = document.createElement("div");
    selector.classList.add("modal");
    selector.style.maxHeight = "70vh";
    selector.style.overflowY = "auto";
    selector.style.padding = "10px";

    const title = document.createElement("h3");
    title.textContent = "Sélectionner une pièce";
    title.style.textAlign = "center";
    selector.appendChild(title);

    inv.forEach(item => {

        if (item.slot !== slotType) return;

        const row = document.createElement("div");
        row.style.padding = "6px 0";
        row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        row.style.cursor = "pointer";
        row.style.fontFamily = "'Cinzel', serif";
        row.style.color = "#e2d3b5";

        row.textContent = item.name || item.id;

        row.onclick = () => {

            consumeItemInstance(item);

            targetSlot.item = item;
            updateSlotVisual(targetSlot, item);

            document.body.removeChild(selectorOverlay);

            updateAssemblySummary(); // 🔥 mise à jour au bon endroit
        };

        selector.appendChild(row);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Annuler";
    cancelBtn.classList.add("btn");
    cancelBtn.style.marginTop = "10px";
    cancelBtn.onclick = () => {
        document.body.removeChild(selectorOverlay);
    };

    selector.appendChild(cancelBtn);

    selectorOverlay.appendChild(selector);
    document.body.appendChild(selectorOverlay);
}

/* ======================================================
   ASSEMBLAGE (consomme les pièces)
====================================================== */
function assembleItems() {

    const weaponPieces = weaponSlots.map(s => s.item).filter(Boolean);
    const armorPieces = armorSlots.map(s => s.item).filter(Boolean);

    // Assemblage arme
    if (weaponPieces.length >= 2) {
        const finalWeapon = assembleWeaponSimple(weaponPieces);
        addToInventory(finalWeapon);
        autoEquipIfPossible();
    }

    // Assemblage armure
    if (armorPieces.length >= 2) {
        const finalArmor = assembleArmorSimple(armorPieces);
        addToInventory(finalArmor);
        autoEquipIfPossible();
    }

    // Reset des slots
    weaponSlots.forEach(s => {
        s.item = null;
        updateSlotVisual(s, null);
    });

    armorSlots.forEach(s => {
        s.item = null;
        updateSlotVisual(s, null);
    });

    // Mise à jour du récap dynamique
    updateAssemblySummary();
}

/* ======================================================
   RÉCAP STATS (nouveau système)
====================================================== */
function updateAssemblySummary() {

    const summary = document.getElementById("assembly-summary");
    if (!summary) return;

    let totalStats = {};
    let totalAffixes = {};

    const allPieces = [...weaponSlots, ...armorSlots]
        .map(s => s.item)
        .filter(Boolean);

    allPieces.forEach(piece => {
        for (const [k, v] of Object.entries(piece.stats || {})) {
            totalStats[k] = (totalStats[k] || 0) + v;
        }
        for (const [k, v] of Object.entries(piece.affixes || {})) {
            totalAffixes[k] = (totalAffixes[k] || 0) + v;
        }
    });

    let html = "";

    for (const [k, v] of Object.entries(totalStats)) {
        html += `<div>${formatStat(k, v)}</div>`;
    }

    for (const [k, v] of Object.entries(totalAffixes)) {
        html += `<div>${formatAffix(k, v)}</div>`;
    }

    summary.innerHTML = html || "<i>Aucune statistique</i>";
}

/* ======================================================
   SWITCH ONGLET
====================================================== */
function switchTab(tab) {
    craftSection.style.display = tab === "craft" ? "block" : "none";
    assembleSection.style.display = tab === "assemble" ? "block" : "none";
}

/* ======================================================
   FABRICATION
====================================================== */
function refreshPanel() {

    const list = document.getElementById("forge-list");
    list.innerHTML = "";

    const inventory = getInventory();

    for (const id in ForgeRecipes) {

        const recipe = ForgeRecipes[id];

        const row = document.createElement("div");
        row.style.padding = "10px 0";
        row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        row.style.display = "flex";
        row.style.flexDirection = "column";

        // Tooltip propre
        row.onmouseenter = () => {
            const stats = Object.entries(recipe.result.stats)
                .map(([k, v]) => formatStat(k, v))
                .join("\n");

            row.title = stats || "Aucune statistique";
        };

        // Nom
        const label = document.createElement("div");
        label.textContent = recipe.name;
        label.style.fontSize = "18px";
        row.appendChild(label);

        // Coût
        const costDiv = document.createElement("div");
        costDiv.style.marginBottom = "8px";

        recipe.cost.forEach(req => {
            const have = inventory.find(i => i.id === req.id)?.quantity ?? 0;
            const line = document.createElement("div");
            line.textContent = `• ${req.id} : ${have}/${req.qty}`;
            line.style.color = have >= req.qty ? "#9be29b" : "#e29b9b";
            costDiv.appendChild(line);
        });

        row.appendChild(costDiv);

        // Bouton forger
        const craftBtn = document.createElement("button");
        craftBtn.textContent = "Forger";
        craftBtn.classList.add("btn");

        if (!canCraft(id)) craftBtn.disabled = true;

        craftBtn.onclick = () => {

            const statsPreview = Object.entries(recipe.result.stats)
                .map(([k, v]) => formatStat(k, v))
                .join("\n");

            openConfirmPopup({
                title: `Forger : ${recipe.name}`,
                message: `Voulez-vous vraiment forger cet objet ?\n\n${statsPreview}`,
                onConfirm: () => {
                    craftItem(id);
                    refreshPanel();
                }
            });
        };

        row.appendChild(craftBtn);
        list.appendChild(row);
    }
}

/* ======================================================
   OUVERTURE / FERMETURE
====================================================== */
export function openForgePanel() {
    if (!panel) createPanel();
    refreshPanel();
    overlay.style.display = "flex";
}

export function closeForgePanel() {
    if (overlay) overlay.style.display = "none";
}

