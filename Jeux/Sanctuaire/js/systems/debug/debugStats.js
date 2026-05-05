/*
   ROUTE : Jeux/Sanctuaire/js/systems/debug/debugStats.js
   RÔLE :
     Affiche toutes les statistiques finales du joueur (player.stats)
     pour vérifier les resets, les multiplicateurs, les valeurs anormales.
*/

export const DebugStats = {
    enabled: true,
    stats: {}
};

export function drawDebugStats(ctx, canvas, player) {

    if (!DebugStats.enabled) return;

    const s = DebugStats.stats;

    ctx.save();

    // Fond large pour 3 colonnes
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = "white";
    ctx.font = "13px monospace";

    // Colonnes
    const colX = [40, 260, 480];
    const colY = 40;
    const lineHeight = 18;

    let L1 = 0, L2 = 0, L3 = 0;

    const write = (col, line, label, value) => {
        ctx.fillText(
            `${label}: ${Number(value).toFixed(2)}`,
            colX[col],
            colY + line * lineHeight
        );
    };

    // ============================
    // OFFENSE (colonne 1)
    // ============================
    write(0, L1++, "=== OFFENSE ===", 0);
 
    write(0, L1++, "Damage", s.damage);
    write(0, L1++, "Damage Mult", s.damageMultiplier);

    write(0, L1++, "Physical Damage", s.physicalDamage);
    write(0, L1++, "Fire Damage", s.fireDamage);
    write(0, L1++, "Ice Damage", s.iceDamage);
    write(0, L1++, "Lightning Damage", s.lightningDamage);
    write(0, L1++, "Poison Damage", s.poisonDamage);
    write(0, L1++, "Shadow Damage", s.shadowDamage);

    write(0, L1++, "Physical Damage Mult", s.physicalDamageMultiplier);
    write(0, L1++, "Fire Damage Mult", s.fireDamageMultiplier);
    write(0, L1++, "Ice Damage Mult", s.iceDamageMultiplier);
    write(0, L1++, "Lightning Damage Mult", s.lightningDamageMultiplier);
    write(0, L1++, "Poison Damage Mult", s.poisonDamageMultiplier);
    write(0, L1++, "Shadow Damage Mult", s.shadowDamageMultiplier);

    write(0, L1++, "Crit Chance", s.critChance);
    write(0, L1++, "Crit Chance Mult", s.critChanceMultiplier);

    write(0, L1++, "Crit Multiplier", s.critMultiplier);
    write(0, L1++, "Crit Multiplier Mult", s.critMultiplierMultiplier);

    write(0, L1++, "Projectile Speed", s.projectileSpeed);
    write(0, L1++, "Projectile Speed Mult", s.projectileSpeedMultiplier);

    write(0, L1++, "Projectile Range", s.projectileRange);
    write(0, L1++, "Projectile Range Mult", s.projectileRangeMultiplier);

    write(0, L1++, "Projectile Count", s.projectileCount);
    write(0, L1++, "Projectile Count Mult", s.projectileCountMultiplier);

    write(0, L1++, "DOT Damage", s.dotDamage);
    write(0, L1++, "DOT Damage Mult", s.dotDamageMultiplier);

    write(0, L1++, "DOT Duration", s.dotDuration);
    write(0, L1++, "DOT Duration Mult", s.dotDurationMultiplier);

    write(0, L1++, "Attack Speed", s.attackSpeed);
    write(0, L1++, "Attack Speed Mult", s.attackSpeedMultiplier);

    write(0, L1++, "Attack Range", s.attackRange);
    write(0, L1++, "Attack Range Mult", s.attackRangeMultiplier);


    // ============================
    // DEFENSE (colonne 2)
    // ============================
    write(1, L2++, "=== DEFENSE ===", 0);

    write(1, L2++, "Max HP", s.maxHp);
    write(1, L2++, "Max HP Mult", s.maxHpMultiplier);

    write(1, L2++, "Regen HP", s.regenHp);
    write(1, L2++, "Regen HP Mult", s.regenHpMultiplier);

    write(1, L2++, "Max Shield", s.maxShield);
    write(1, L2++, "Max Shield Mult", s.maxShieldMultiplier);

    write(1, L2++, "Regen Shield", s.regenShield);
    write(1, L2++, "Regen Shield Mult", s.regenShieldMultiplier);

    write(1, L2++, "Dodge Chance", s.dodgeChance);
    write(1, L2++, "Parry Chance", s.parryChance);
    write(1, L2++, "Block Chance", s.blockChance);
    write(1, L2++, "Block Power", s.blockPower);

    write(1, L2++, "Physical Res", s.physicalResistance);
    write(1, L2++, "Fire Res", s.fireResistance);
    write(1, L2++, "Ice Res", s.iceResistance);
    write(1, L2++, "Lightning Res", s.lightningResistance);
    write(1, L2++, "Poison Res", s.poisonResistance);
    write(1, L2++, "Shadow Res", s.shadowResistance);

    write(1, L2++, "Shield Eff Physical", s.shieldEfficiencyPhysical);
    write(1, L2++, "Shield Eff Fire", s.shieldEfficiencyFire);
    write(1, L2++, "Shield Eff Ice", s.shieldEfficiencyIce);
    write(1, L2++, "Shield Eff Lightning", s.shieldEfficiencyLightning);
    write(1, L2++, "Shield Eff Poison", s.shieldEfficiencyPoison);
    write(1, L2++, "Shield Eff Shadow", s.shieldEfficiencyShadow);


    // ============================
    // UTILITY + META (colonne 3)
    // ============================
    write(2, L3++, "=== UTILITY ===", 0);

    write(2, L3++, "Move Speed", s.moveSpeed);
    write(2, L3++, "Move Speed Mult", s.moveSpeedMultiplier);

    write(2, L3++, "Pickup Range", s.pickupRange);

    write(2, L3++, "Loot Quantity", s.lootQuantity);
    write(2, L3++, "Loot Quality", s.lootQuality);

    write(2, L3++, "Currency Gain", s.currencyGain);
    write(2, L3++, "XP Gain", s.xpGain);

    write(2, L3++, "=== META ===", 0);

    write(2, L3++, "Spirit Max", s.spiritMax);
    write(2, L3++, "Spirit Regen", s.spiritRegen);
    write(2, L3++, "Spirit Cost Reduction", s.spiritCostReduction);

    write(2, L3++, "Energy Max", s.energyMax);
    write(2, L3++, "Energy Regen", s.energyRegen);

    write(2, L3++, "=== WEAPON Element ===", 0);
    // ⭐ AJOUT : afficher l’élément actuel de l’arme (runtime)
    write(2, L3++, "Element", player.runtime?.element ?? "physical");


    ctx.restore();
}
