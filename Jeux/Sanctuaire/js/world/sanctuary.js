// sanctuary.js — VERSION FINALE FUSIONNÉE
// Tout global, compatible avec ton projet actuel

document.addEventListener("DOMContentLoaded", () => {

    // RETOUR AU MENU
    document.getElementById("sanctuary-back-btn")?.addEventListener("click", () => {
        if (window.goToMenu) window.goToMenu();
    });

    // OUVERTURE PYLÔNE
    document.getElementById("zone-pylone")?.addEventListener("click", () => {
        document.getElementById("pylone-overlay")?.classList.remove("hidden");
    });

    // ANNULER
    document.getElementById("pylone-cancel")?.addEventListener("click", () => {

        // Si un timer est actif → on l'annule
        if (countdownInterval) {
            clearLaunchTimer();
            return;
        }

        // Sinon → fermer la popup
        document.getElementById("pylone-overlay")?.classList.add("hidden");
    });

    // ---------------------------------------------------
    // BIOME (nouveau système .biome-btn)
    // ---------------------------------------------------
    document.querySelectorAll(".biome-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (choicesLocked) return;

            document.querySelectorAll(".biome-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            // MAJ récap
            document.getElementById("recapBiome").textContent =
                "Biome : " + btn.textContent.trim();
        });
    });

    // ---------------------------------------------------
    // DROPDOWN NIVEAU (nouveau système)
    // ---------------------------------------------------
    const dropdown = document.getElementById("levelDropdown");
    const toggle = dropdown?.querySelector(".dropdown-toggle");
    const menu = document.getElementById("levelMenu");
    const levelLabel = document.getElementById("levelLabel");

    toggle?.addEventListener("click", () => {
        if (choicesLocked) return;
        menu.classList.toggle("open");
    });

    menu?.addEventListener("click", (e) => {
        if (choicesLocked) return;

        const item = e.target.closest(".dropdown-item");
        if (!item) return;

        const text = item.textContent.trim();
        levelLabel.textContent = text;

        // MAJ récap
        document.getElementById("recapLevel").textContent =
            "Niveau : " + text.replace("Niveau ", "");

        menu.classList.remove("open");
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) menu.classList.remove("open");
    });

    // ---------------------------------------------------
    // AFFIXE (nouveau système)
    // ---------------------------------------------------
    const affixSlot = document.getElementById("affixSlot");
    const affixSummary = document.getElementById("affixSummary");
    const recapAffix = document.getElementById("recapAffix");
    const recapAffixList = document.getElementById("recapAffixList");

    const stones = [
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

    let selectedStone = null;

    affixSlot?.addEventListener("click", () => {
        if (choicesLocked) return;

        // Toggle entre les deux pierres (placeholder)
        selectedStone = selectedStone === stones[0] ? stones[1] : stones[0];

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
    });

    // ---------------------------------------------------
    // LANCER LA RUN
    // ---------------------------------------------------
    document.getElementById("pylone-launch")?.addEventListener("click", () => {
        startLaunchCountdown();
    });
});

// ================================
// PANELS "À VENIR"
// ================================
const panelTitles = {
    coffre:   "Coffre du Sanctuaire",
    forge:    "Forge Sacrée",
    marchand: "Marchand des Ombres",
    grimoire: "Grimoire Ancien"
};

function openSanctuaryPanel(zone) {
    const title = document.getElementById("sanctuary-panel-title");
    if (title) title.textContent = panelTitles[zone] || zone;
    document.getElementById("sanctuary-panel-overlay")?.classList.remove("hidden");
}

// ================================
// COUNTDOWN LANCEMENT RUN
// ================================
let countdownInterval = null;
let choicesLocked = false;

function lockChoices() {
    choicesLocked = true;

    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "none");
    document.getElementById("levelDropdown").style.pointerEvents = "none";
    document.getElementById("affixSlot").style.pointerEvents = "none";

    document.getElementById("pylone-launch").disabled = true;
}

function unlockChoices() {
    choicesLocked = false;

    document.querySelectorAll(".biome-btn").forEach(b => b.style.pointerEvents = "auto");
    document.getElementById("levelDropdown").style.pointerEvents = "auto";
    document.getElementById("affixSlot").style.pointerEvents = "auto";

    document.getElementById("pylone-launch").disabled = false;
}

function startLaunchCountdown() {
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn   = document.getElementById("pylone-launch");

    let seconds = 5;

    countdownEl.classList.remove("hidden");
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
    countdownEl.classList.add("hidden");

    unlockChoices();
}

// ================================
// LANCEMENT DE LA RUN
// ================================
function launchRun() {

    const biome = document.querySelector(".biome-btn.active")?.textContent.trim() || "Forêt Mourante";

    const levelText = document.getElementById("levelLabel").textContent;
    const difficulte = levelText.replace("Niveau ", "") || "I";

    const affixName = selectedStone ? selectedStone.name : null;

    const config = { biome, difficulte, affix: affixName };

    document.getElementById("pylone-overlay")?.classList.add("hidden");
    document.getElementById("sanctuary-screen")?.classList.add("hidden");

    if (window.startRun) window.startRun(config);
}

// =====================================================
// 🔥 Exposé global
// =====================================================
window.clearLaunchTimer = clearLaunchTimer;
window.unlockPyloneChoices = unlockChoices;
