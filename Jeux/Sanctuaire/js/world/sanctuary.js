// Jeux/Sanctuaire/js/world/sanctuary.js
// ROLE : Gestion complète du Sanctuaire (UI, interactions, pylône, panels, lancement de run)
// EXPORTS : initSanctuary()
// DEPENDANCES : ../core/main.js (goToMenu), ../core/gameLoop.js (startRun)
// SCREEN : data-screen="sanctuary"
// NOTES : initSanctuary() doit être appelée par le screen manager quand l’écran Sanctuaire est affiché

// ================================
// IMPORTS (FIX COUPLAGE GLOBAL)
// ================================
import { goToMenu } from "../core/main.js";
import { startRun } from "../core/gameLoop.js";

// ================================
// DEBUG LOAD
// ================================
console.log("🔥 sanctuary.js LOADED");

// ================================
// CONSTANTES
// ================================
const PANEL_TITLES = {
    coffre: "Coffre du Sanctuaire",
    forge: "Forge Sacrée",
    marchand: "Marchand des Ombres",
    grimoire: "Grimoire Ancien"
};

const STONES = [
    {
        name: "Pierre de Fureur",
        affixes: [
            { text: "+15% dégâts ennemis", type: "malus" }
        ]
    },
    {
        name: "Pierre du Néant Instable",
        affixes: [
            { text: "+20% or trouvé", type: "bonus" },
            { text: "+12% vitesse d’attaque ennemie", type: "malus" },
            { text: "+8% XP gagnée", type: "bonus" },
            { text: "+25% dégâts de poison ennemis", type: "malus" },
            { text: "+10% chances de loot rare", type: "bonus" },
            { text: "-5% résistance du joueur", type: "malus" },
            { text: "+18% dégâts de feu ennemis", type: "malus" },
            { text: "+6% vitesse de déplacement", type: "bonus" },
            { text: "-10% régénération de vie", type: "malus" }
        ]
    }
];

// ================================
// STATE
// ================================
let countdownInterval = null;
let choicesLocked = false;
let selectedStone = null;

// ================================
// HELPERS SAFE DOM
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

function setPointer(el, value) {
    if (el) el.style.pointerEvents = value;
}

function setDisabled(el, value) {
    if (el) el.disabled = value;
}

// ================================
// INIT SANCTUARY (REMPLACE DOMContentLoaded)
// ================================
export function initSanctuary() {
    console.log("🔥 initSanctuary EXECUTED");

    // BACK MENU
    $("sanctuary-back-btn")?.addEventListener("click", () => {
        goToMenu();
    });

    // PYLONE OPEN
    $("zone-pylone")?.addEventListener("click", () => {
        $("pylone-overlay")?.classList.remove("hidden");
    });

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
        if (!item || !levelLabel) return;

        levelLabel.textContent = item.textContent.trim();
        updateRecap();
        menu.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
        if (!dropdown?.contains(e.target)) {
            menu?.classList.remove("open");
        }
    });

    // AFFIX
    $("affixSlot")?.addEventListener("click", () => {
        if (choicesLocked) return;
        selectedStone = selectedStone === STONES[0] ? STONES[1] : STONES[0];
        updateAffixDisplay();
    });

    // ZONES
    document.querySelectorAll("[data-zone]").forEach(zone => {
        zone.addEventListener("click", () => {
            const key = zone.dataset.zone;
            openSanctuaryPanel(key);
        });
    });

    $("sanctuary-panel-close")?.addEventListener("click", () => {
        $("sanctuary-panel-overlay")?.classList.add("hidden");
    });

    $("pylone-launch")?.addEventListener("click", startLaunchCountdown);

    // SCALE INIT
    scaleSanctuary();
}

// ================================
// PANELS
// ================================
function openSanctuaryPanel(zone) {
    setText("sanctuary-panel-title", PANEL_TITLES[zone] || zone);
    $("sanctuary-panel-overlay")?.classList.remove("hidden");
}

// ================================
// RECAP
// ================================
function updateRecap() {
    const biome = document.querySelector(".biome-btn.active")?.textContent?.trim() || "Aucun";
    const level = $("levelLabel")?.textContent?.trim() || "Aucun";

    setText("recapBiome", `Biome : ${biome}`);
    setText("recapLevel", `Niveau : ${level.replace("Niveau ", "")}`);
}

// ================================
// AFFIX DISPLAY
// ================================
function updateAffixDisplay() {

    const slot = $("affixSlot");
    if (!slot) return;

    if (selectedStone) {
        slot.classList.add("has-affix");
        slot.textContent = "🜄";

        setText("affixSummary", selectedStone.name);
        setText("recapAffix", `Affixe : ${selectedStone.name}`);

        setHTML(
            "recapAffixList",
            selectedStone.affixes
                .map(a => `<div class="${a.type}">• ${a.text}</div>`)
                .join("")
        );

    } else {
        slot.classList.remove("has-affix");
        slot.innerHTML = "CLIQUE<br>POUR CHOISIR";

        setText("affixSummary", "Aucune pierre sélectionnée.");
        setText("recapAffix", "Affixe : Aucun");
        setHTML("recapAffixList", "");
    }
}

// ================================
// LOCK / UNLOCK
// ================================
function lockChoices() {
    choicesLocked = true;

    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "none");

    setPointer($("levelDropdown"), "none");
    setPointer($("affixSlot"), "none");
    setDisabled($("pylone-launch"), true);
}

function unlockChoices() {
    choicesLocked = false;

    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "auto");

    setPointer($("levelDropdown"), "auto");
    setPointer($("affixSlot"), "auto");
    setDisabled($("pylone-launch"), false);
}

// ================================
// COUNTDOWN
// ================================
function startLaunchCountdown() {

    const countdown = $("pylone-countdown");
    const btn = $("pylone-launch");

    if (!countdown || !btn) return;

    let seconds = 5;

    countdown.classList.remove("hidden");
    btn.disabled = true;

    lockChoices();

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

// ================================
// CANCEL
// ================================
function clearLaunchTimer() {

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    $("pylone-countdown")?.classList.add("hidden");

    setDisabled($("pylone-launch"), false);

    unlockChoices();
}

// ================================
// LAUNCH RUN
// ================================
function launchRun() {

    const biome = document.querySelector(".biome-btn.active")?.textContent?.trim() || "Forêt Mourante";
    const levelText = $("levelLabel")?.textContent || "";
    const difficulte = levelText.replace("Niveau ", "") || "I";
    const affixName = selectedStone?.name || null;

    const activeCharacter = sessionStorage.getItem("activeCharacter");

    const config = {
        character: activeCharacter ? JSON.parse(activeCharacter) : null,
        biome,
        difficulte,
        affix: affixName
    };

    $("pylone-overlay")?.classList.add("hidden");

    document.querySelector('[data-screen="sanctuary"]')?.classList.add("hidden");

    startRun(config);
}

// ================================
// SCALE
// ================================
function scaleSanctuary() {

    const wrapper = $("sanctuary-wrapper");
    if (!wrapper) return;

    const baseW = 1920;
    const baseH = 1080;

    const scale = Math.min(
        window.innerWidth / baseW,
        window.innerHeight / baseH
    );

    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.left = `${(window.innerWidth - baseW * scale) / 2}px`;
    wrapper.style.top = `${(window.innerHeight - baseH * scale) / 2}px`;
}

window.addEventListener("resize", scaleSanctuary);
window.addEventListener("load", scaleSanctuary);

// ================================
// DEBUG
// ================================
document.addEventListener("keydown", (e) => {
    if (e.key === "g") {
        document.body.classList.toggle("sanctuary-show-grid");
    }

    if (e.key === "d") {
        document.body.classList.toggle("sanctuary-debug-zones");
    }
});
