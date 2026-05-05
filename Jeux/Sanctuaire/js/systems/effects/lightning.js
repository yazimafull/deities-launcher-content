/*
   ROUTE : systems/effects/lightning.js
   RÔLE : Effet élémentaire Foudre (chain lightning + couleur projectile)
   EXPORTS : applyLightningEffect()
   DÉPENDANCES : aucune
   NOTES :
     - Surcharge : rebondit sur plusieurs ennemis
     - Jumps, range et damageMult scalables via stats
*/

export function applyLightningEffect(source, dmgPacket) {

    const s = source.stats ?? source;

    dmgPacket.chain = {
        jumps: s.lightningJumps ?? 2,
        range: s.lightningRange ?? 120,
        damageMult: 1 + (s.lightningDamageMultiplier ?? 0)
    };

    dmgPacket.projectileColor = "#ffff55";

    return dmgPacket;
}
