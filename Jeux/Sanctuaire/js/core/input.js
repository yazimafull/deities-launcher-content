// input.js

export const keys = {};

// Enregistre les touches enfoncées
window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

// Enregistre les touches relâchées
window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

// Fonction utilitaire pour vérifier si une touche est enfoncée
export function isDown(key) {
    return keys[key.toLowerCase()] === true;
}
