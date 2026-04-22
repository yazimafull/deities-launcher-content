// sanctuary.js — VERSION STABLE ET CORRIGÉE

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
// VARIABLES GLOBALES
// ================================
let countdownInterval = null;
let choicesLocked = false;
let selectedStone = null;

// ================================
// HELPERS (évite les bugs)
// ================================
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

function setPointer(id, value) {
    const el = document.getElementById(id);
    if (el) el.style.pointerEvents = value;
}

function setDisabled(id, value) {
    const el = document.getElementById(id);
    if (el) el.disabled = value;
}

// ================================
// INITIALISATION
// ================================
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("sanctuary-back-btn")?.addEventListener("click", () => {
        if (window.goToMenu) window.goToMenu();
    });

    document.getElementById("zone-pylone")?.addEventListener("click", () => {
        document.getElementById("pylone-overlay")?.classList.remove("hidden");
    });

    document.getElementById("pylone-cancel")?.addEventListener("click", () => {
        if (countdownInterval) {
            clearLaunchTimer();
            return;
        }
        document.getElementById("pylone-overlay")?.classList.add("hidden");
    });

    // BIOME
    document.querySelectorAll(".biome-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (choicesLocked) return;
            document.querySelectorAll(".biome-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateRecap();
        });
    });

    // DROPDOWN
    const dropdown = document.getElementById("levelDropdown");
    const toggle = dropdown?.querySelector(".dropdown-toggle");
    const menu = document.getElementById("levelMenu");
    const levelLabel = document.getElementById("levelLabel");

    toggle?.addEventListener("click", () => {
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

    // AFFIXE
    document.getElementById("affixSlot")?.addEventListener("click", () => {
        if (choicesLocked) return;
        selectedStone = selectedStone === STONES[0] ? STONES[1] : STONES[0];
        updateAffixDisplay();
    });

    // PANELS
    const zones = {
        "zone-coffre": "coffre",
        "zone-forge": "forge",
        "zone-marchand": "marchand",
        "zone-grimoire": "grimoire"
    };

    Object.entries(zones).forEach(([id, key]) => {
        document.getElementById(id)?.addEventListener("click", () => openSanctuaryPanel(key));
    });

    document.getElementById("sanctuary-panel-close")?.addEventListener("click", () => {
        document.getElementById("sanctuary-panel-overlay")?.classList.add("hidden");
    });

    document.getElementById("pylone-launch")?.addEventListener("click", startLaunchCountdown);
});

// ================================
// FONCTIONS
// ================================
function openSanctuaryPanel(zone) {
    setText("sanctuary-panel-title", PANEL_TITLES[zone] || zone);
    document.getElementById("sanctuary-panel-overlay")?.classList.remove("hidden");
}

function updateRecap() {
    const biome = document.querySelector(".biome-btn.active")?.textContent?.trim() || "Aucun";
    const level = document.getElementById("levelLabel")?.textContent?.trim() || "Aucun";

    setText("recapBiome", "Biome : " + biome);
    setText("recapLevel", "Niveau : " + level.replace("Niveau ", ""));
}

function updateAffixDisplay() {
    const affixSlot = document.getElementById("affixSlot");

    if (!affixSlot) return;

    if (selectedStone) {
        affixSlot.classList.add("has-affix");
        affixSlot.textContent = "🜄";

        setText("affixSummary", selectedStone.name);
        setText("recapAffix", "Affixe : " + selectedStone.name);

        setHTML(
            "recapAffixList",
            selectedStone.affixes
                .map(a => `<div class="${a.type}">• ${a.text}</div>`)
                .join("")
        );
    } else {
        affixSlot.classList.remove("has-affix");
        affixSlot.innerHTML = "CLIQUE<br>POUR CHOISIR";

        setText("affixSummary", "Aucune pierre sélectionnée.");
        setText("recapAffix", "Affixe : Aucun");
        setHTML("recapAffixList", "");
    }
}

function lockChoices() {
    choicesLocked = true;
    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "none");
    setPointer("levelDropdown", "none");
    setPointer("affixSlot", "none");
    setDisabled("pylone-launch", true);
}

function unlockChoices() {
    choicesLocked = false;
    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "auto");
    setPointer("levelDropdown", "auto");
    setPointer("affixSlot", "auto");
    setDisabled("pylone-launch", false);
}

function startLaunchCountdown() {
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn = document.getElementById("pylone-launch");

    if (!countdownEl || !launchBtn) return;

    let seconds = 5;
    countdownEl.classList.remove("hidden");
    launchBtn.disabled = true;

    lockChoices();

    countdownInterval = setInterval(() => {
        seconds--;

        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            launchRun();
        } else {
            countdownEl.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;
        }
    }, 1000);
}

function clearLaunchTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    document.getElementById("pylone-countdown")?.classList.add("hidden");
    setDisabled("pylone-launch", false);

    unlockChoices();
}

function launchRun() {
    const biome = document.querySelector(".biome-btn.active")?.textContent?.trim() || "Forêt Mourante";
    const levelText = document.getElementById("levelLabel")?.textContent;
    const difficulte = levelText ? levelText.replace("Niveau ", "") : "I";
    const affixName = selectedStone ? selectedStone.name : null;

    const config = { biome, difficulte, affix: affixName };

    document.getElementById("pylone-overlay")?.classList.add("hidden");
    document.getElementById("sanctuary-screen")?.classList.add("hidden");

    if (window.startRun) {
        window.startRun(config);
    } else {
        console.error("startRun non définie");
    }
}

// ================================
// GLOBAL
// ================================
window.clearLaunchTimer = clearLaunchTimer;
window.unlockPyloneChoices = unlockChoices;