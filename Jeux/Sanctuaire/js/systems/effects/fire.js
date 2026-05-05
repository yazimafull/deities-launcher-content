/*
   ROUTE : systems/effects/fire.js
   RÔLE : Effet élémentaire Feu (DOT brûlure + couleur projectile)
   EXPORTS : applyFireEffect()
   DÉPENDANCES : aucune (utilise seulement source.stats et dmgPacket)
   NOTES :
     - DOT basé sur les dégâts du hit
     - Durée scalable via stats.dotDuration
     - Dégâts DOT scalables via stats.dotDamageMultiplier
*/

export function applyFireEffect(source, dmgPacket) {

    const s = source.stats ?? source;

    // DOT : 30% du hit par défaut
    const dotBase = dmgPacket.value * (s.fireDotRatio ?? 0.30);
    const dotDuration = 3 + (s.dotDuration ?? 0);
    const dotMult = 1 + (s.dotDamageMultiplier ?? 0);

    dmgPacket.dot = {
        type: "fire",
        amount: dotBase * dotMult,
        duration: dotDuration
    };

    // Couleur du projectile
    dmgPacket.projectileColor = "#ff6633";

    return dmgPacket;
}
