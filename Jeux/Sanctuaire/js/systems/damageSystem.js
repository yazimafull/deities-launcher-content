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

   NORMALISATION :
     ✔ Tous les ennemis utilisent le même pipeline défensif que le joueur
     ✔ Toutes les stats défensives viennent de mob.stats (optionnelles = 0)
     ✔ boss = mob avec isBoss = true
     ✔ Aucune stat défensive sur mob directement
     ✔ Aucune duplication hp/stats.hp/runtime.hp
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

        ctx.font = n.isCrit ? "bold 20px Cinzel" : "16px Cinzel";

        let color = "#ffffff";
        switch (n.type) {
            case "fire":      color = "#ff6633"; break;
            case "lightning": color = "#ffff55"; break;
            case "ice":       color = "#66ccff"; break;
            case "shadow":    color = "#cc66ff"; break;
            case "poison":    color = "#66ff66"; break;
        }

        const sx = n.x - camera.x;
        const sy = n.y - camera.y;

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
    const s = source.stats ?? source;
    const type = skill.element ?? source.activeElement ?? source.element ?? "physical";

    const base = s.damage ?? 0;
    const elementBonus = s[`${type}Damage`] ?? 0;

    let dmg = (base + elementBonus) * (skill.coefficient ?? 1);

    const elemMult = s[`${type}DamageMultiplier`] ?? 0;
    dmg *= (1 + elemMult);

    dmg *= (1 + (s.damageMultiplier ?? 0));

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

    let res = s[`${type}Resistance`] ?? 0;

    res = Math.max(-0.9, Math.min(1.0, res));

    return dmgPacket.value * (1 - res);
}

/* ============================================================================
   DAMAGE TO ENEMY — PIPELINE COMPLET
============================================================================ */
export function damageEnemy(mob, dmgPacket) {

    if (!mob || mob.dead) return;

    const s = mob.stats ?? {};

    /* -----------------------------------------
       DODGE
    ----------------------------------------- */
    const dodgeChance = s.dodgeChance ?? 0;
    if (Math.random() < dodgeChance) {
        spawnDamageNumber(mob.x, mob.y, "DODGE", false, false);
        return;
    }

    /* -----------------------------------------
       PARRY
    ----------------------------------------- */
    const parryChance = s.parryChance ?? 0;
    if (Math.random() < parryChance) {
        spawnDamageNumber(mob.x, mob.y, "PARRY", false, false);
        return;
    }

    /* -----------------------------------------
       BLOCK
    ----------------------------------------- */
    const blockChance = s.blockChance ?? 0;
    if (Math.random() < blockChance) {

        const blockPower = s.blockPower ?? 0;
        const reduced = dmgPacket.value * blockPower;

        dmgPacket = { ...dmgPacket, value: dmgPacket.value - reduced };

        spawnDamageNumber(mob.x, mob.y, "BLOCK", false, false);
    }

    /* -----------------------------------------
       SHIELD
    ----------------------------------------- */
    let damage = computeDefense(mob, dmgPacket);

    const maxShield = s.maxShield ?? 0;
    if (maxShield > 0) {

        if (mob.shield === undefined) mob.shield = s.maxShield ?? 0;

        const absorbed = Math.min(mob.shield, damage);
        mob.shield -= absorbed;
        damage -= absorbed;

        if (absorbed > 0) {
            spawnDamageNumber(mob.x, mob.y, absorbed, false, false, dmgPacket.type);
        }
    }

    /* -----------------------------------------
       APPLY DAMAGE TO HP
    ----------------------------------------- */
    mob.hp = Math.max(0, mob.hp - damage);

    spawnDamageNumber(
        mob.x,
        mob.y,
        damage,
        dmgPacket.isCrit,
        false,
        dmgPacket.type
    );

    if (dmgPacket.dot) {
        applyDot(mob, dmgPacket.dot);
    }

    if (mob.hp <= 0) {
        mob.dead = true;

        if (mob.isBoss) {
            window.dispatchEvent(new CustomEvent("boss:dead"));
        } else {
            window.dispatchEvent(new CustomEvent("mob:dead"));
        }
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
       SHIELD + HP DAMAGE
    ----------------------------------------- */

    let absorbed = 0;
    let damage = computeDefense(player, dmgPacket);

    const canUseShield = dmgPacket.type !== "biome";

    if (player.shield > 0 && canUseShield) {

        absorbed = Math.min(player.shield, damage);

        const key = `shieldEfficiency${capitalize(dmgPacket.type)}`;

        let eff = player.stats[key];
        if (eff === undefined) eff = 0;

        const shieldCost = absorbed * (1 - eff);

        player.shield -= shieldCost;
        damage -= absorbed;
    }

    const totalDamage = absorbed + damage;

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

    if (damage > 0) {

        player.hp = Math.max(0, player.hp - damage);

        if (player.hp <= 0) {
            onPlayerDeath();
            return;
        }
    }

    if (dmgPacket.dot) {
        applyDot(player, dmgPacket.dot);
    }
}

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
