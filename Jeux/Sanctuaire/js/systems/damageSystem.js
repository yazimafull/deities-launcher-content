/*
   ROUTE : Jeux/Sanctuaire/js/systems/damageSystem.js

   RÔLE :
     Système central de gestion des dégâts :
       - computeOffense : construit les dégâts (flat + multipliers + crit + élémentaire)
       - computeDefense : applique résistances / réductions
       - damageEnemy / damagePlayer : application des dégâts
       - DOT : gestion des dégâts sur la durée
       - BIOME : dégâts pulsés
       - Damage Numbers : affichage
*/

import { camera } from "./cameraSystem.js";
import { onPlayerDeath } from "../systems/deathSystem.js";

export let dmgNumbers = [];

/* ============================================================================
   DAMAGE NUMBERS
============================================================================ */
export function updateDamageNumbers(dt) {

    for (let i = dmgNumbers.length - 1; i >= 0; i--) {

        const n = dmgNumbers[i];

        n.y -= dt * 0.05;
        n.alpha -= dt * 0.0008;

        if (n.alpha <= 0) {
            dmgNumbers.splice(i, 1);
        }
    }
}

export function drawDamageNumbers(ctx) {

    for (let n of dmgNumbers) {

        ctx.save();
        ctx.globalAlpha = n.alpha;
        ctx.textAlign = "center";

        // Taille critique (inchangée)
        ctx.font = n.isCrit ? "bold 20px Cinzel" : "16px Cinzel";

        // Couleur selon élément
        let color = "#ffffff"; // physique
        switch (n.type) {
            case "fire":      color = "#ff6633"; break;
            case "lightning": color = "#ffff55"; break;
            case "ice":       color = "#66ccff"; break;
            case "shadow":    color = "#cc66ff"; break;
            case "poison":    color = "#66ff66"; break;
        }

        const sx = n.x - camera.x;
        const sy = n.y - camera.y;

        // Dégâts subis par le joueur → contour rouge vif + couleur élémentaire
        if (n.isPlayer) {
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 3;
            ctx.strokeText(n.value, sx, sy);
            ctx.fillStyle = color;
        } else {
            ctx.fillStyle = color;
        }

        ctx.fillText(n.value, sx, sy);

        ctx.restore();
    }
}

export function spawnDamageNumber(
    x,
    y,
    value,
    isCrit = false,
    isPlayer = false,
    type = "physical"
) {
    dmgNumbers.push({
        x,
        y,
        value: typeof value === "number" ? value.toFixed(1) : value,
        isCrit,
        isPlayer,
        type,
        alpha: 1
    });
}

/* ============================================================================
   DOT SYSTEM
============================================================================ */
export function updateDots(dt, entity) {

    if (!entity?.dots) return;

    for (let i = entity.dots.length - 1; i >= 0; i--) {

        const dot = entity.dots[i];

        dot.timer += dt;
        dot.remaining -= dt;

        if (dot.timer >= 1000) {
            dot.timer = 0;

            if (entity.isMob) {
                damageEnemy(entity, { value: dot.amount, type: dot.type });
            } else {
                damagePlayer(entity, { value: dot.amount, type: dot.type });
            }
        }

        if (dot.remaining <= 0) {
            entity.dots.splice(i, 1);
        }
    }
}

export function applyDot(entity, dotConfig) {

    if (!entity.dots) entity.dots = [];

    entity.dots.push({
        type: dotConfig.type,
        amount: dotConfig.amount,
        remaining: dotConfig.duration * 1000,
        timer: 0
    });
}

/* ============================================================================
   OFFENSIVE DAMAGE BUILDER
============================================================================ */
export function computeOffense(source, skill = {}) {
    const s = source.stats ?? source;   // sécurité
    const type = skill.element ?? source.activeElement ?? source.element ?? "physical";

    // 1. Base universelle
    const base = s.damage ?? 0;

    // 2. Bonus élémentaire (physicalDamage, fireDamage, etc.)
    const elementBonus = s[`${type}Damage`] ?? 0;

    // 3. Coefficient du skill
    let dmg = (base + elementBonus) * (skill.coefficient ?? 1);

    // 4. Multiplicateurs élémentaires
    const elemMult = s[`${type}DamageMultiplier`] ?? 0;
    dmg *= (1 + elemMult);

    // 5. Multiplicateur global
    dmg *= (1 + (s.damageMultiplier ?? 0));

    // 6. Critique
    const critChance = s.critChance ?? 0;
    const critMult = (s.critMultiplier ?? 1.5) * (1 + (s.critMultiplierMultiplier ?? 0));

    const isCrit = Math.random() < critChance;
    if (isCrit) dmg *= critMult;

    return {
        value: dmg,
        isCrit,
        type
    };
}


/* ============================================================================
   DEFENSIVE DAMAGE REDUCTION
============================================================================ */
export function computeDefense(target, dmgPacket) {
    const s = target.stats;
    const type = dmgPacket.type ?? "physical";

    // Résistance élémentaire
    let res = s[`${type}Resistance`] ?? 0;

    // Clamp entre -90% et +100%
    res = Math.max(-0.9, Math.min(1.0, res));

    return dmgPacket.value * (1 - res);
}


/* ============================================================================
   DAMAGE TO ENEMY
============================================================================ */
export function damageEnemy(mob, dmgPacket) {

    if (!mob || mob.dead) return;

    const finalDamage = computeDefense(mob, dmgPacket);

    mob.hp = Math.max(0, mob.hp - finalDamage);

    if (mob.isBoss) {
        mob.lastHitTime = performance.now();
    }

    if (mob.state === "idle") mob.state = "chase";

    spawnDamageNumber(
        mob.x,
        mob.y,
        finalDamage,
        dmgPacket.isCrit,
        false,
        dmgPacket.type
    );

    if (dmgPacket.dot) {
        applyDot(mob, dmgPacket.dot);
    }

    if (mob.hp <= 0 && mob.isBoss) {
        mob.dead = true;
        window.dispatchEvent(new CustomEvent("boss:dead"));
    }
}

/* ============================================================================
   DAMAGE TO PLAYER — VERSION PROPRE
============================================================================ */
export function damagePlayer(player, dmgPacket) {

    if (!player) return;

    const weaponProfile = player.weapon?.defenseProfile ?? {
        canDodge: true,
        canParry: false,
        canBlock: false,
        dodgePenalty: 0
    };


    /* -----------------------------------------
       DODGE
    ----------------------------------------- */
    if (weaponProfile.canDodge) {

        const dodgeChance =
            (player.stats?.dodgeChance ?? 0) +
            (weaponProfile.dodgePenalty ?? 0);

        if (Math.random() < dodgeChance / 100) {
            spawnDamageNumber(player.x, player.y, "DODGE", false, true);
            return;
        }
    }

    /* -----------------------------------------
       PARRY
    ----------------------------------------- */
    if (weaponProfile.canParry) {

        const parryChance = player.stats?.parryChance ?? 0;

        if (Math.random() < parryChance / 100) {

            const parryPower = player.stats?.parryPower ?? 0;
            const reduced = dmgPacket.value * (parryPower / 100);

            spawnDamageNumber(player.x, player.y, "PARRY", false, true);

            dmgPacket = { ...dmgPacket, value: dmgPacket.value - reduced };
        }
    }

    /* -----------------------------------------
       BLOCK
    ----------------------------------------- */
    if (weaponProfile.canBlock) {

        const blockChance = player.stats?.blockChance ?? 0;

        if (Math.random() < blockChance / 100) {

            const blockPower = player.stats?.blockPower ?? 0;
            const reduced = dmgPacket.value * (blockPower / 100);

            spawnDamageNumber(player.x, player.y, "BLOCK", false, true);

            dmgPacket = { ...dmgPacket, value: dmgPacket.value - reduced };
        }
    }

    /* -----------------------------------------
       SHIELD + HP DAMAGE (avec shieldEfficiency)
    ----------------------------------------- */

    let absorbed = 0;
    let damage = computeDefense(player, dmgPacket);

    // Le biome ignore le shield
    const canUseShield = dmgPacket.type !== "biome";

    if (player.shield > 0 && canUseShield) {

        absorbed = Math.min(player.shield, damage);

        // Nom de la stat : shieldEfficiencyFire, shieldEfficiencyPhysical, etc.
        const key = `shieldEfficiency${capitalize(dmgPacket.type)}`;
        

        // fallback propre si la stat n'existe pas
        let eff = player.stats[key];
        if (eff === undefined) eff = 0;

        // Le shield consomme moins selon l’efficacité
        const shieldCost = absorbed * (1 - eff);

        player.shield -= shieldCost;
        damage -= absorbed;
    }

    const totalDamage = absorbed + damage;

    /* -----------------------------------------
       DAMAGE NUMBERS
    ----------------------------------------- */
    if (totalDamage > 0) {
        spawnDamageNumber(
            player.x,
            player.y,
            totalDamage,
            dmgPacket.isCrit,
            true,
            dmgPacket.type
        );
    }

    /* -----------------------------------------
       APPLY DAMAGE TO HP
    ----------------------------------------- */
    if (damage > 0) {

        player.hp = Math.max(0, player.hp - damage);

        if (player.hp <= 0) {
            onPlayerDeath();
            return;
        }
    }

    /* -----------------------------------------
       APPLY DOT
    ----------------------------------------- */
    if (dmgPacket.dot) {
        applyDot(player, dmgPacket.dot);
    }
}

/* Utilitaire */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/* ============================================================================
   BIOME DAMAGE
============================================================================ */
let biomeTickTimer = 0;

export function applyBiomeDamage(dt, difficulty, player) {

    const dmgPerSecond = Math.max(0, difficulty - 1);
    if (dmgPerSecond <= 0) return;

    biomeTickTimer += dt;

    if (biomeTickTimer >= 1000) {

        biomeTickTimer = 0;

        const res = player.stats?.biomeResistance ?? 0;
        const finalDmg = dmgPerSecond * Math.max(0, 1 - res / 100);

        damagePlayer(player, {
            value: finalDmg,
            type: "biome",
            isCrit: false
        });
    }
}
