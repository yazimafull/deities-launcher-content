// ROUTE : js/UI/menu/pylonePanel.js
// ============================================================================
// RÔLE : Gère entièrement le Pylône : sélection biome/niveau, équipement,
//        pierre d’affixe, récapitulatif, verrouillage et lancement de run.
// ============================================================================

import { startRunManager } from "../../core/runManager.js";
import { getInventory } from "../../systems/inventorySystem.js";
import { player } from "../../systems/player/player.js";
import { updatePlayerStats } from "../../systems/player/player.js";
import { applyPlayerRuntimeStats } from "../../systems/player/playerRuntimeSystem.js";
import { basePlayer } from "../../data/playerBase.js";

// ================================
// STATE
// ================================
let countdownInterval = null;
let choicesLocked = false;

let loadout = {
    weapon: null,
    armor: null,
    stone: null
};

// ================================
// HELPERS
// ================================
const $ = (id) => document.getElementById(id);

function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function setHTML(id, value) {
    const el = $(id);
    if (el) el.innerHTML = value;
}

function setDisabled(el, value) {
    if (el) el.disabled = value;
}

// ================================
// VALIDATION LANCEMENT RUN
// ================================
function updateLaunchButtonState() {
    const biome = document.querySelector(".biome-btn.active");
    const level = $("levelLabel")?.textContent?.trim();

    const hasWeapon = loadout.weapon !== null;
    const hasArmor = loadout.armor !== null;

    const canLaunch = biome && level && level !== "Aucun" && hasWeapon && hasArmor;

    setDisabled($("pylone-launch"), !canLaunch);
}

// ================================
// OUVERTURE PANEL (RESET + UI)
// ================================
export function openPylonePanel() {

    resetPyloneTimer();

    // ============================
    // RESET ÉQUIPEMENT RUNTIME
    // ============================
    player.equipment.weapon = null;
    player.equipment.armor = null;
    player.equipment.trinkets = [];

    player.stats = structuredClone(basePlayer.stats);
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;

    // Reset du loadout interne du pylône
    loadout.weapon = null;
    loadout.armor = null;
    loadout.stone = null;

    // HP / Shield corrects
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;

    // ============================
    // AFFICHAGE PANEL + UI
    // ============================
    $("pylone-overlay")?.classList.remove("hidden");

    refreshEquipmentSlots();
    refreshAffixSlot();
    updateRecap();
    updateLaunchButtonState();
}

// ================================
// INIT PANEL
// ================================
export function initPylonePanel() {
    console.log("[PYLONE] initPylonePanel appelé");

    // CANCEL
    $("pylone-cancel")?.addEventListener("click", () => {
        if (countdownInterval) {
            clearLaunchTimer();
            return;
        }
        $("pylone-overlay")?.classList.add("hidden");
    });

    // BIOMES
    document.querySelectorAll(".biome-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (choicesLocked) return;
            document.querySelectorAll(".biome-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateRecap();
            updateLaunchButtonState();
        });
    });

    // DROPDOWN
    const dropdown = $("levelDropdown");
    const menu = $("levelMenu");
    const levelLabel = $("levelLabel");

    dropdown?.querySelector(".dropdown-toggle")?.addEventListener("click", () => {
        if (choicesLocked) return;
        menu?.classList.toggle("open");
    });

    menu?.addEventListener("click", (e) => {
        if (choicesLocked) return;

        const item = e.target.closest(".dropdown-item");
        if (!item) return;

        levelLabel.textContent = item.textContent.trim();
        updateRecap();
        updateLaunchButtonState();
        menu.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
        if (!dropdown?.contains(e.target)) {
            menu?.classList.remove("open");
        }
    });

    // SLOT PIERRE
    $("affixSlot")?.addEventListener("click", () => openItemSelector("stone"));

    // ÉQUIPEMENT
    $("weaponSlot")?.addEventListener("click", () => openItemSelector("weapon"));
    $("armorSlot")?.addEventListener("click", () => openItemSelector("armor"));

    // LAUNCH
    $("pylone-launch")?.addEventListener("click", startLaunchCountdown);
}

// ================================
// AUTO-EQUIPEMENT APRÈS CRAFT
// ================================
export function autoEquipIfPossible() {
    const inv = getInventory();

    if (!loadout.weapon) {
        const w = inv.find(i => i.slot === "weapon");
        if (w) loadout.weapon = w;
    }

    if (!loadout.armor) {
        const a = inv.find(i => i.slot === "armor");
        if (a) loadout.armor = a;
    }

    refreshEquipmentSlots();
    updateRecap();
    updateLaunchButtonState();
}

// ================================
// SELECTEUR D’ITEM
// ================================
function openItemSelector(type) {

    const inventory = getInventory();
    const filtered = inventory.filter(item => item.slot === type);

    const grid = $("item-selector-grid");
    grid.innerHTML = "";

    filtered.forEach(item => {
        const slot = document.createElement("div");
        slot.className = "selector-slot";

        const img = document.createElement("img");
        img.src = item.icon;
        slot.appendChild(img);

        slot.addEventListener("click", () => {
            loadout[type] = item;
            closeItemSelector();
            refreshEquipmentSlots();
            updateRecap();
            updateLaunchButtonState();
        });

        slot.addEventListener("mousemove", (e) => showTooltip(item, e.clientX, e.clientY));
        slot.addEventListener("mouseleave", hideTooltip);

        grid.appendChild(slot);
    });

    $("item-selector-overlay").classList.remove("hidden");
}

function closeItemSelector() {
    $("item-selector-overlay").classList.add("hidden");
    hideTooltip();
}

$("item-selector-close")?.addEventListener("click", closeItemSelector);

// ================================
// TOOLTIP
// ================================
function showTooltip(item, x, y) {
    const box = $("tooltip");

    const statsHTML = item.stats
        ? Object.entries(item.stats)
            .map(([key, value]) => `<div class="stat">• ${key}: ${value}</div>`)
            .join("")
        : "";

    const affixesHTML = item.affixes
        ? Object.entries(item.affixes)
            .map(([key, value]) => `<div class="affix">• ${key} +${value}</div>`)
            .join("")
        : "";

    box.innerHTML = `
        <div style="color:#d4af37; margin-bottom:4px;">${item.name}</div>
        ${statsHTML}
        ${affixesHTML}
    `;

    box.style.left = x + 15 + "px";
    box.style.top = y + 15 + "px";
    box.classList.remove("hidden");
}

function hideTooltip() {
    $("tooltip").classList.add("hidden");
}
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;

// ================================
// REFRESH SLOTS
// ================================
function refreshEquipmentSlots() {
    $("weaponSlot").textContent = loadout.weapon ? loadout.weapon.name : "Arme";
    $("armorSlot").textContent = loadout.armor ? loadout.armor.name : "Armure";
}

function refreshAffixSlot() {
    const slot = $("affixSlot");

    if (!loadout.stone) {
        slot.textContent = "Aucune pierre";
        return;
    }

    slot.textContent = loadout.stone.name;
}

// ================================
// RECAP
// ================================
function updateRecap() {
    const biome = document.querySelector(".biome-btn.active")?.textContent?.trim() || "Aucun";
    const level = $("levelLabel")?.textContent?.trim() || "Aucun";

    setText("recapBiome", `Biome : ${biome}`);
    setText("recapLevel", `Niveau : ${level.replace("Niveau ", "")}`);

    if (loadout.stone) {
        setText("recapAffix", `Affixe : ${loadout.stone.name}`);

        setHTML(
            "recapModifiers",
            loadout.stone.affixes
                .map(a => `<div class="${a.type}">• ${a.text}</div>`)
                .join("")
        );
    } else {
        setText("recapAffix", "Affixe : Aucun");
        setHTML("recapModifiers", "");
    }
}

// ================================
// COUNTDOWN / CANCEL / LAUNCH
// ================================
function startLaunchCountdown() {
    const countdown = $("pylone-countdown");
    const btn = $("pylone-launch");

    let seconds = 5;

    countdown.classList.remove("hidden");
    countdown.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;
    btn.disabled = true;

    choicesLocked = true;

    countdownInterval = setInterval(() => {
        seconds--;

        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            launchRun();
        } else {
            countdown.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;
        }
    }, 1000);
}

function clearLaunchTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    $("pylone-countdown")?.classList.add("hidden");
    $("pylone-launch").disabled = false;

    choicesLocked = false;
}

function launchRun() {

    const biomeId = document.querySelector(".biome-btn.active")?.dataset.id || "foret";
    const levelText = $("levelLabel")?.textContent || "";
    const difficulte = levelText.replace("Niveau ", "") || "I";

    const activeCharacter = sessionStorage.getItem("activeCharacter");

    const config = {
        character: activeCharacter ? JSON.parse(activeCharacter) : null,
        biomeId,
        difficulte,
        affixes: loadout.stone ? [loadout.stone] : [],
        weapon: loadout.weapon,
        armor: loadout.armor,
        stone: loadout.stone
    };

    $("pylone-overlay")?.classList.add("hidden");
    document.querySelector('[data-screen="sanctuary"]')?.classList.add("hidden");

    player.weapon = loadout.weapon;
    player.armorItem = loadout.armor;

    startRunManager(config);
}

// ================================
// RESET TIMER
// ================================
export function resetPyloneTimer() {
    clearLaunchTimer();
}
