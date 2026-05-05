/*
   ROUTE : systems/effects/poison.js
   RÔLE : Effet élémentaire Poison (DOT cumulatif + couleur projectile)
   EXPORTS : applyPoisonEffect()
   DÉPENDANCES : aucune
   NOTES :
     - DOT stacking
     - Ratio scalable via stats.poisonDotRatio
*/

export function applyPoisonEffect(source, dmgPacket) {

    const s = source.stats ?? source;

    const dotBase = dmgPacket.value * (s.poisonDotRatio ?? 0.15);
    const dotDuration = 4 + (s.dotDuration ?? 0);

    dmgPacket.dot = {
        type: "poison",
        amount: dotBase,
        duration: dotDuration,
        stacking: true
    };

    dmgPacket.projectileColor = "#66ff66";

    return dmgPacket;
}
