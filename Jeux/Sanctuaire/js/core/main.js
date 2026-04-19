// main.js
// Gestion du menu principal (hors création de personnage)

document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play-btn");
    const optionsBtn = document.getElementById("options-btn");
    const quitBtn = document.getElementById("quit-btn");

    // Lancer la partie avec le personnage sélectionné
    playBtn.addEventListener("click", () => {
        if (playBtn.disabled) return;

        const selectedItem = document.querySelector(".character-item.selected");
        if (!selectedItem) {
            console.warn("Aucun personnage sélectionné.");
            return;
        }

        const characterName = selectedItem.dataset.name;
        console.log(`Lancement du jeu avec : ${characterName}`);

        // 👉 C’est ici que tu branches ton vrai lancement :
        // - changement de scène
        // - chargement du Sanctuaire
        // - appel à ton moteur / Electron / etc.
        // Exemple :
        // window.location.href = "sanctuaire.html";
    });

    // Ouvrir les options (panel à faire plus tard)
    optionsBtn.addEventListener("click", () => {
        console.log("Ouverture du panneau d’options (à implémenter).");
        // Tu pourras plus tard :
        // - afficher un panel d’options
        // - gérer le son, la résolution, etc.
    });

    // Quitter le jeu / fermer la fenêtre
    quitBtn.addEventListener("click", () => {
        console.log("Quitter le jeu (à brancher selon ton environnement).");
        // Si tu es dans Electron :
        // window.close();
        // Ou tu envoies un message à ton process principal.
    });
});
