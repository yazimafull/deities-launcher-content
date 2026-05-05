/*
   ROUTE : systems/effects/ice.js
   RÔLE : Effet élémentaire Glace (ralentissement + couleur projectile)
   EXPORTS : applyIceEffect()
   DÉPENDANCES : aucune
   NOTES :
     - Slow scalable via stats.iceSlowPower et stats.iceSlowDuration
*/

export function applyIceEffect(source, dmgPacket) {

    const s = source.stats ?? source;

    const slowPower = s.iceSlowPower ?? 0.25;     // 25% par défaut
    const slowDuration = 2 + (s.iceSlowDuration ?? 0);

    dmgPacket.slow = {
        amount: slowPower,
        duration: slowDuration
    };

    dmgPacket.projectileColor = "#66ccff";

    return dmgPacket;
}
