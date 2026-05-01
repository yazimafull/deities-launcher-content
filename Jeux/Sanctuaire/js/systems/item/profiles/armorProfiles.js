// === ROUTE : /systems/item/profiles/armorProfiles.js
// === RÔLE : Définit les profils d’armure + leurs règles défensives.
// === EXPORTS : ArmorProfiles
// === NOTES :
// - Les armures ne se combinent pas.
// - Le profil est choisi à la forge (heavy / light / enchanted).
// - La qualité est indépendante du profil.
// - Les valeurs ici sont les bonus/malus globaux appliqués au joueur.

export const ArmorProfiles = {

    // Profil d’une armure seule
    single(item) {
        return item.profile || "lightArmor";
    },

    // Les armures ne se combinent pas
    combined(itemA, itemB) {
        console.warn("Les armures ne peuvent pas être combinées :", itemA.id, itemB.id);
        return null;
    },

    // === PROFILS D’ARMURE AVEC RÈGLES ===

    heavyArmor: {
        id: "heavyArmor",
        role: "tank",
        dodgePenalty: 20,          // -20% dodge
        moveSpeedPenalty: 10,      // -10% vitesse
        physicalReduction: 20,     // +20% réduction physique
        magicReduction: 5,         // +5% réduction magique
    },

    lightArmor: {
        id: "lightArmor",
        role: "balanced",
        dodgePenalty: 0,
        moveSpeedPenalty: 0,
        physicalReduction: 10,     // +10% physique
        magicReduction: 10,        // +10% magique
    },

    enchantedArmor: {
        id: "enchantedArmor",
        role: "magic",
        dodgePenalty: 0,
        moveSpeedBonus: 5,         // +5% vitesse
        physicalReduction: 5,      // +5% physique
        magicReduction: 20,        // +20% magique
        shieldBonus: 15,           // +15% shield capacity / regen
    },
};
