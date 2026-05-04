/*
   ROUTE : Jeux/Sanctuaire/js/systems/debug/debugStats.js
   RÔLE :
     Affiche toutes les statistiques finales du joueur (player.stats + runtime)
     pour vérifier les resets, les multiplicateurs, les valeurs anormales.
     Lecture seule : ne modifie jamais le gameplay.

   EXPORTS :
     - DebugStats (objet runtime)
     - drawDebugStats(ctx, canvas, player)

   DÉPENDANCES :
     - player.stats (source unique des stats finales)
     - engine.js (appel du rendu debug)

   NOTES :
     - Affichage fixe en haut-gauche pour lisibilité.
     - Toutes les valeurs sont arrondies à 2 décimales.
     - Catégories : offense / defense / utility / meta.
*/

export const DebugStats = {
    enabled: true,
    stats: {}
};

export function drawDebugStats(ctx, canvas, player) {

    if (!DebugStats.enabled) return;

    const s = DebugStats.stats;
    const x = 20;
    const y = 20;

    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(x, y, 300, canvas.height - 40);

    ctx.fillStyle = "white";
    ctx.font = "13px monospace";

    let line = 0;
    const write = (label, value) => {
        ctx.fillText(
            `${label}: ${Number(value).toFixed(2)}`,
            x + 10,
            y + 20 + line * 18
        );
        line++;
    };

    // ============================
    // OFFENSE
    // ============================
    ctx.fillText("=== OFFENSE ===", x + 10, y + 20 + line * 18); line++;

    write("Attack Damage", s.attackDamage);
    write("Attack Speed", s.attackSpeed);
    write("Attack Range", s.attackRange);

    write("Projectile Speed", s.projectileSpeed);
    write("Projectile Range", s.projectileRange);
    write("Projectile Count", s.projectileCount);

    write("Crit Chance", s.critChance);
    write("Crit Multiplier", s.critMultiplier);

    write("DOT Damage", s.dotDamage);
    write("DOT Duration", s.dotDuration);

    write("Elemental Damage", s.elementalDamage);

    // ============================
    // DEFENSE
    // ============================
    ctx.fillText("=== DEFENSE ===", x + 10, y + 20 + line * 18); line++;

    write("Max HP", s.maxHp);
    write("Max Shield", s.maxShield);
    write("Regen HP", s.regenHp);
    write("Regen Shield", s.regenShield);

    write("Block Chance", s.blockChance);
    write("Block Power", s.blockPower);

    write("Dodge Chance", s.dodgeChance);

    write("Physical Res", s.physicalResistance);
    write("Fire Res", s.fireResistance);
    write("Ice Res", s.iceResistance);
    write("Lightning Res", s.lightningResistance);
    write("Poison Res", s.poisonResistance);
    write("Shadow Res", s.shadowResistance);

    write("Biome Resistance", s.biomeResistance);

    // ============================
    // UTILITY
    // ============================
    ctx.fillText("=== UTILITY ===", x + 10, y + 20 + line * 18); line++;

    write("Move Speed", s.moveSpeed);
    write("Pickup Range", s.pickupRange);

    write("Cooldown Reduction", s.cooldownReduction);

    write("Projectile Speed", s.projectileSpeed);
    write("Projectile Range", s.projectileRange);

    write("Energy Max", s.energyMax);
    write("Energy Cost", s.energyCost);

    write("Spirit Cost", s.spiritCost);

    // ============================
    // META
    // ============================
    ctx.fillText("=== META ===", x + 10, y + 20 + line * 18); line++;

    write("XP Gain %", s.xpGain);
    write("Currency Gain %", s.currencyGain);

    write("Loot Quantity", s.lootQuantity);
    write("Loot Quality", s.lootQuality);

    ctx.restore();
}
