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
// TOOLTIP BUILDER
// ================================
function buildTooltip(item) {
    let html = `<div style="color:#d4af37; margin-bottom:4px;">${item.name}</div>`;

    if (item.stats) {
        for (const [k, v] of Object.entries(item.stats)) {
            html += `<div class="stat">• ${k}: ${v}</div>`;
        }
    }

    if (item.affixes) {
        for (const [k, v] of Object.entries(item.affixes)) {
            html += `<div class="affix">• ${k}: +${v}</div>`;
        }
    }

    return html;
}

function showTooltip(item, x, y) {
    const box = $("tooltip");
    box.innerHTML = buildTooltip(item);
    box.style.left = x + 15 + "px";
    box.style.top = y + 15 + "px";
    box.classList.remove("hidden");
}

function hideTooltip() {
    $("tooltip").classList.add("hidden");
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
// OUVERTURE PANEL
// ================================
export function openPylonePanel() {

    resetPyloneTimer();

    // Reset équipement runtime
    player.equipment.weapon = null;
    player.equipment.armor = null;
    player.equipment.trinkets = [];

    player.stats = structuredClone(basePlayer.stats);
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;

    // Reset loadout
    loadout.weapon = null;
    loadout.armor = null;
    loadout.stone = null;

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
// REFRESH SLOTS
// ================================
function refreshEquipmentSlots() {

    const w = loadout.weapon;
    const a = loadout.armor;

    const wSlot = $("weaponSlot");
    const aSlot = $("armorSlot");

    wSlot.textContent = w ? w.name : "Arme";
    aSlot.textContent = a ? a.name : "Armure";

    // Tooltip custom
    wSlot.onmouseenter = () => {
        if (w) {
            const rect = wSlot.getBoundingClientRect();
            showTooltip(w, rect.right, rect.top);
        }
    };
    wSlot.onmouseleave = hideTooltip;

    aSlot.onmouseenter = () => {
        if (a) {
            const rect = aSlot.getBoundingClientRect();
            showTooltip(a, rect.right, rect.top);
        }
    };
    aSlot.onmouseleave = hideTooltip;
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

    // Arme
    if (loadout.weapon) {
        setHTML("recapWeapon", `
            <div style="color:#d4af37">${loadout.weapon.name}</div>
            ${formatStats(loadout.weapon)}
        `);
    } else {
        setText("recapWeapon", "Aucune arme");
    }

    // Armure
    if (loadout.armor) {
        setHTML("recapArmor", `
            <div style="color:#d4af37">${loadout.armor.name}</div>
            ${formatStats(loadout.armor)}
        `);
    } else {
        setText("recapArmor", "Aucune armure");
    }

    // Pierre
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

function formatStats(item) {
    let html = "";

    if (item.stats) {
        for (const [k, v] of Object.entries(item.stats)) {
            html += `<div class="stat">• ${k}: ${v}</div>`;
        }
    }

    if (item.affixes) {
        for (const [k, v] of Object.entries(item.affixes)) {
            html += `<div class="affix">• ${k}: +${v}</div>`;
        }
    }

    return html;
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

    // ÉQUIPEMENT RUNTIME
    player.equipment.weapon = loadout.weapon;
    player.activeElement = loadout.weapon?.element ?? "physical";
    player.equipment.armor = loadout.armor;

    updatePlayerStats();
    applyPlayerRuntimeStats(player);

    startRunManager(config);
}

// ================================
// RESET TIMER
// ================================
export function resetPyloneTimer() {
    clearLaunchTimer();
}
