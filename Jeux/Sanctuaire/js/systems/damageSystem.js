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

   PRINCIPES :
     - Toutes les valeurs offensives viennent de runtime
     - computeOffense accepte runtime OU entity
     - Aucun calcul de dégâts ailleurs dans le jeu
*/

import { camera } from "./cameraSystem.js";
import { onPlayerDeath } from "../systems/deathSystem.js";

export let dmgNumbers = [];

// ============================================================================
// DAMAGE NUMBERS
// ============================================================================
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
        ctx.font = n.isCrit ? "bold 20px Cinzel" : "16px Cinzel";
        ctx.textAlign = "center";

        ctx.fillStyle = n.isPlayer ? "#ff4444" : "#ffcc88";

        const screenX = n.x - camera.x;
        const screenY = n.y - camera.y;

        ctx.fillText(n.value, screenX, screenY);

        ctx.restore();
    }
}

export function spawnDamageNumber(x, y, value, isCrit = false, isPlayer = false) {

    dmgNumbers.push({
        x,
        y,
        value,
        isCrit,
        isPlayer,
        alpha: 1
    });
}

// ============================================================================
// DOT SYSTEM
// ============================================================================
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

// ============================================================================
// OFFENSIVE DAMAGE BUILDER
// ============================================================================
export function computeOffense(source) {

    const r = source.runtime ?? source;

    // 1. Base damage = arme + stats
    const base = (r.weaponDamage ?? 0) + (r.attackDamage ?? 0);

    // 2. Multiplicateurs
    let dmg = base * (1 + (r.attackDamageMultiplier ?? 0));

    // 3. Élémentaire
    dmg += (r.elementalDamage ?? 0) * (1 + (r.elementalDamageMultiplier ?? 0));

    // 4. Crit
    const critChance = r.critChance ?? 0;
    const critMult   = (r.critMultiplier ?? 1) * (1 + (r.critMultiplierMultiplier ?? 0));

    const isCrit = Math.random() < critChance;
    if (isCrit) dmg *= critMult;

    return {
        value: dmg,          // pas de floor ici
        isCrit,
        type: r.element ?? "physical"
    };
}



// ============================================================================
// DEFENSIVE DAMAGE REDUCTION
// ============================================================================
export function computeDefense(target, dmgPacket) {

    let dmg = dmgPacket.value;
    const type = dmgPacket.type ?? "physical";

    // 1. Résistance dynamique selon le type
    const resId = type + "Resistance"; // ex: "fireResistance"
    let res = target.stats?.[resId] ?? 0;

    // 2. Clamp (-90% à +100%)
    if (res < -0.9) res = -0.9;
    if (res > 1.0) res = 1.0;

    // 3. Application
    dmg *= (1 - res);

    return Math.floor(dmg);
}


// ============================================================================
// DAMAGE TO ENEMY
// ============================================================================
export function damageEnemy(mob, dmgPacket) {

    if (!mob || mob.dead) return;

    const finalDamage = computeDefense(mob, dmgPacket);

    mob.hp = Math.max(0, mob.hp - finalDamage);

    // === BOSS : reset anti-kite ===
    if (mob.isBoss) {
        mob.lastHitTime = performance.now();
    }

    // === Force aggro si touché en idle ===
    if (mob.state === "idle") mob.state = "chase";

    spawnDamageNumber(
        mob.x,
        mob.y,
        finalDamage,
        dmgPacket.isCrit,
        false
    );

    if (dmgPacket.dot) {
        applyDot(mob, dmgPacket.dot);
    }

    // === MORT DU BOSS UNIQUEMENT ===
    if (mob.hp <= 0 && mob.isBoss) {
        mob.dead = true;
        window.dispatchEvent(new CustomEvent("boss:dead"));
    }

    
}

// ============================================================================
// DAMAGE TO PLAYER
// ============================================================================
export function damagePlayer(player, dmgPacket) {

    if (!player) return;

    const weaponProfile = player.weapon?.defenseProfile ?? {
        canDodge: true,
        canParry: false,
        canBlock: false,
        dodgePenalty: 0
    };

    // === DODGE ===
    if (weaponProfile.canDodge) {

        const dodgeChance =
            (player.stats?.dodgeChance ?? 0) +
            (weaponProfile.dodgePenalty ?? 0);

        if (Math.random() < dodgeChance / 100) {
            spawnDamageNumber(player.x, player.y, "DODGE", false, true);
            return;
        }
    }

    // === PARRY ===
    if (weaponProfile.canParry) {

        const parryChance = player.stats?.parryChance ?? 0;

        if (Math.random() < parryChance / 100) {

            const parryPower = player.stats?.parryPower ?? 0;
            const reduced = dmgPacket.value * (parryPower / 100);

            spawnDamageNumber(player.x, player.y, "PARRY", false, true);

            dmgPacket = { ...dmgPacket, value: dmgPacket.value - reduced };
        }
    }

    // === BLOCK ===
    if (weaponProfile.canBlock) {

        const blockChance = player.stats?.blockChance ?? 0;

        if (Math.random() < blockChance / 100) {

            const blockPower = player.stats?.blockPower ?? 0;
            const reduced = dmgPacket.value * (blockPower / 100);

            spawnDamageNumber(player.x, player.y, "BLOCK", false, true);

            dmgPacket = { ...dmgPacket, value: dmgPacket.value - reduced };
        }
    }

    // === RESISTANCES ===
    let damage = computeDefense(player, dmgPacket);

    // === SHIELD ===
    if (player.shield > 0) {

        const absorbed = Math.min(player.shield, damage);

        player.shield -= absorbed;
        damage -= absorbed;

        if (absorbed > 0) {
            spawnDamageNumber(player.x, player.y, absorbed, false, true);
        }
    }

    // === HP DAMAGE ===
    if (damage > 0) {

        player.hp = Math.max(0, player.hp - damage);

        spawnDamageNumber(
            player.x,
            player.y,
            damage,
            dmgPacket.isCrit,
            true
        );

        // === MORT DU JOUEUR ===
        if (player.hp <= 0) {
            onPlayerDeath();
            return;
        }
    }

    if (dmgPacket.dot) {
        applyDot(player, dmgPacket.dot);
    }
}

// ============================================================================
// BIOME DAMAGE
// ============================================================================
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
