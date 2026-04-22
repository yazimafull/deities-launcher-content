// sanctuary.js — VERSION OPTIMISÉE ET PRÊTE À L'EMPLOI

// ================================
// CONSTANTES
// ================================
const PANEL_TITLES = {
    coffre:   "Coffre du Sanctuaire",
    forge:    "Forge Sacrée",
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
// INITIALISATION
// ================================
document.addEventListener("DOMContentLoaded", () => {
    // RETOUR AU MENU
    const backBtn = document.getElementById("sanctuary-back-btn");
    backBtn?.addEventListener("click", () => {
        if (window.goToMenu) window.goToMenu();
    });

    // OUVERTURE PYLÔNE
    const pyloneZone = document.getElementById("zone-pylone");
    pyloneZone?.addEventListener("click", () => {
        document.getElementById("pylone-overlay")?.classList.remove("hidden");
    });

    // ANNULER
    const pyloneCancel = document.getElementById("pylone-cancel");
    pyloneCancel?.addEventListener("click", () => {
        if (countdownInterval) {
            clearLaunchTimer();
            return;
        }
        document.getElementById("pylone-overlay")?.classList.add("hidden");
    });

    // ---------------------------------------------------
    // BIOME
    // ---------------------------------------------------
    document.querySelectorAll(".biome-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (choicesLocked) return;
            document.querySelectorAll(".biome-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateRecap();
        });
    });

    // ---------------------------------------------------
    // DROPDOWN NIVEAU
    // ---------------------------------------------------
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
        if (!item) return;

        levelLabel.textContent = item.textContent.trim();
        updateRecap();
        menu.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
        if (!dropdown?.contains(e.target)) menu?.classList.remove("open");
    });

    // ---------------------------------------------------
    // AFFIXE
    // ---------------------------------------------------
    const affixSlot = document.getElementById("affixSlot");
    const affixSummary = document.getElementById("affixSummary");
    const recapAffix = document.getElementById("recapAffix");
    const recapAffixList = document.getElementById("recapAffixList");

    affixSlot?.addEventListener("click", () => {
        if (choicesLocked) return;
        selectedStone = selectedStone === STONES[0] ? STONES[1] : STONES[0];
        updateAffixDisplay();
    });

    // ---------------------------------------------------
    // ZONES "À VENIR"
    // ---------------------------------------------------
    const zoneHandlers = {
        "zone-coffre": () => openSanctuaryPanel("coffre"),
        "zone-forge": () => openSanctuaryPanel("forge"),
        "zone-marchand": () => openSanctuaryPanel("marchand"),
        "zone-grimoire": () => openSanctuaryPanel("grimoire")
    };

    Object.entries(zoneHandlers).forEach(([zoneId, handler]) => {
        document.getElementById(zoneId)?.addEventListener("click", handler);
    });

    document.getElementById("sanctuary-panel-close")?.addEventListener("click", () => {
        document.getElementById("sanctuary-panel-overlay")?.classList.add("hidden");
    });

    // ---------------------------------------------------
    // LANCER LA RUN
    // ---------------------------------------------------
    document.getElementById("pylone-launch")?.addEventListener("click", () => {
        startLaunchCountdown();
    });
});

// ================================
// FONCTIONS UTILITAIRES
// ================================
function openSanctuaryPanel(zone) {
    const title = document.getElementById("sanctuary-panel-title");
    if (title) title.textContent = PANEL_TITLES[zone] || zone;
    document.getElementById("sanctuary-panel-overlay")?.classList.remove("hidden");
}

function updateRecap() {
    const biome = document.querySelector(".biome-btn.active")?.textContent.trim() || "Aucun";
    const level = document.getElementById("levelLabel")?.textContent.trim() || "Aucun";

    document.getElementById("recapBiome")?.textContent = "Biome : " + biome;
    document.getElementById("recapLevel")?.textContent = "Niveau : " + level.replace("Niveau ", "");
}

function updateAffixDisplay() {
    const affixSlot = document.getElementById("affixSlot");
    const affixSummary = document.getElementById("affixSummary");
    const recapAffix = document.getElementById("recapAffix");
    const recapAffixList = document.getElementById("recapAffixList");

    if (!affixSlot || !affixSummary || !recapAffix || !recapAffixList) return;

    if (selectedStone) {
        affixSlot.classList.add("has-affix");
        affixSlot.textContent = "🜄";
        affixSummary.textContent = selectedStone.name;
        recapAffix.textContent = "Affixe : " + selectedStone.name;

        recapAffixList.innerHTML = selectedStone.affixes
            .map(a => `<div class="${a.type}">• ${a.text}</div>`)
            .join("");
    } else {
        affixSlot.classList.remove("has-affix");
        affixSlot.innerHTML = "CLIQUE<br>POUR CHOISIR";
        affixSummary.textContent = "Aucune pierre sélectionnée.";
        recapAffix.textContent = "Affixe : Aucun";
        recapAffixList.innerHTML = "";
    }
}

function lockChoices() {
    choicesLocked = true;
    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "none");
    document.getElementById("levelDropdown")?.style.pointerEvents = "none";
    document.getElementById("affixSlot")?.style.pointerEvents = "none";
    document.getElementById("pylone-launch")?.disabled = true;
}

function unlockChoices() {
    choicesLocked = false;
    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "auto");
    document.getElementById("levelDropdown")?.style.pointerEvents = "auto";
    document.getElementById("affixSlot")?.style.pointerEvents = "auto";
    document.getElementById("pylone-launch")?.disabled = false;
}

function startLaunchCountdown() {
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn = document.getElementById("pylone-launch");

    if (!countdownEl || !launchBtn) return;

    let seconds = 5;
    countdownEl.classList.remove("hidden");
    launchBtn.disabled = true;
    countdownEl.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;

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

    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn = document.getElementById("pylone-launch");

    countdownEl?.classList.add("hidden");
    if (launchBtn) launchBtn.disabled = false;

    unlockChoices();
}

function launchRun() {
    const biome = document.querySelector(".biome-btn.active")?.textContent.trim() || "Forêt Mourante";
    const levelText = document.getElementById("levelLabel")?.textContent;
    const difficulte = levelText ? levelText.replace("Niveau ", "") : "I";
    const affixName = selectedStone ? selectedStone.name : null;

    const config = { biome, difficulte, affix: affixName };

    document.getElementById("pylone-overlay")?.classList.add("hidden");
    document.getElementById("sanctuary-screen")?.classList.add("hidden");

    if (window.startRun) {
        window.startRun(config);
    } else {
        console.error("La fonction startRun n'est pas définie");
    }
}

// =====================================================
// 🔥 EXPOSITION GLOBALE
// =====================================================
window.clearLaunchTimer = clearLaunchTimer;
window.unlockPyloneChoices = unlockChoices;