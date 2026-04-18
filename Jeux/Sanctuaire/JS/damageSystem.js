// damageSystem.js

export function applyDamage(attacker, target, amount, type = "physical") {
    let dmg = amount;
    let isCrit = false;

    // 1) ESQUIVE (capacité du défenseur)
    if (Math.random() < (target.dodgeChance || 0)) {
        return { dmgTaken: 0, reason: "dodge" };
    }

    // 2) PARADE (capacité du défenseur)
    if (Math.random() < (target.parryChance || 0)) {
        dmg *= (1 - (target.parryReduction || 0));
        return { dmgTaken: dmg, reason: "parry" };
    }

    // 3) BLOCAGE (capacité du défenseur)
    if (Math.random() < (target.blockChance || 0)) {
        dmg -= (target.blockValue || 0);
        if (dmg < 0) dmg = 0;
        return { dmgTaken: dmg, reason: "block" };
    }

    // 4) CRITIQUE (capacité de l'attaquant)
    if (attacker && attacker.critChance && Math.random() < attacker.critChance) {
        isCrit = true;
        dmg *= (attacker.critMultiplier || 2);
    }

    // 5) BOUCLIER PHYSIQUE / MAGIQUE (du défenseur)
    if (type === "physical" && (target.shieldPhysical || 0) > 0) {
        let absorbed = Math.min(dmg, target.shieldPhysical);
        target.shieldPhysical -= absorbed;
        dmg -= absorbed;
        if (dmg <= 0) return { dmgTaken: absorbed, reason: "shieldPhysical" };
    }

    if (type === "magic" && (target.shieldMagic || 0) > 0) {
        let absorbed = Math.min(dmg, target.shieldMagic);
        target.shieldMagic -= absorbed;
        dmg -= absorbed;
        if (dmg <= 0) return { dmgTaken: absorbed, reason: "shieldMagic" };
    }

    // 6) ARMURE (réduction fixe du défenseur)
    if (type === "physical") {
        dmg -= (target.armor || 0);
        if (dmg < 0) dmg = 0;
    }

    // 7) RÉSISTANCE (réduction % du défenseur)
    dmg *= (1 - (target.resistance || 0));
    if (dmg < 0) dmg = 0;

    // 8) APPLICATION DES DÉGÂTS
    target.hp -= dmg;
    if (target.hp < 0) target.hp = 0;

    if (isCrit) {
        return { dmgTaken: dmg, reason: "crit" };
    }

    return { dmgTaken: dmg, reason: "hp" };
}