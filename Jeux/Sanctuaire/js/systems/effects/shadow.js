/*
   ROUTE : systems/effects/shadow.js
   RÔLE : Effet élémentaire Ombre (vol de vie + couleur projectile)
   EXPORTS : applyShadowEffect()
   DÉPENDANCES : aucune
   NOTES :
     - Leech scalable via stats.shadowLeech
*/

export function applyShadowEffect(source, dmgPacket) {

    const s = source.stats ?? source;

    const leech = dmgPacket.value * (s.shadowLeech ?? 0.10);

    dmgPacket.leech = leech;

    dmgPacket.projectileColor = "#cc66ff";

    return dmgPacket;
}
