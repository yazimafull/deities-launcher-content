/*
   ROUTE : Jeux/Sanctuaire/js/core/engine.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → core → engine.js

   RÔLE :
     Boucle centrale du jeu (UPDATE + RENDER), responsable de l’ordre d’exécution
     et de la cohérence frame-by-frame. Ne contient aucune logique gameplay :
     délègue tout aux systèmes spécialisés (player, ennemis, projectiles, boss, XP).
     Gère le mouvement, la caméra, les collisions, le combat, l’XP, le boss et le HUD.

   PRINCIPES :
     - Orchestration stricte : input → mouvement → caméra → systèmes → HUD.
     - Le moteur ne modifie jamais les stats : il consomme playerRuntime + statsSystem.
     - Aucune logique métier : chaque fonctionnalité est déléguée à son système dédié.
     - Le moteur lit les flags du debugSystem (ranges, testWeapon, HUD edit…) mais
       n’active rien lui-même : il applique uniquement les effets visuels ou runtime.

   DÉPENDANCES :
     - core : state (PLAYING), cameraSystem, movementSystem
     - systems : enemySystem, projectileSystem, combatSystem, damageSystem, deathSystem
     - XP : runXP (gain, seuils, orbes)
     - boss : bossSystem (spawn, update, render)
     - player : player.js (runtime), playerStatsSystem (HP/shield), playerRuntimeSystem
     - UI : HUD (update + draw)
     - world : biome_foret (update + draw)
     - debug : debugSystem.js (flags centralisés pour ranges, arme test, HUD edit…)

   NOTES :
     - L’ordre updatePlayerDirection → moveEntity → updateCamera est essentiel pour
       éviter le lag visuel et garantir un mouvement fluide.
     - Le moteur applique l’arme de test via debugFlags.testWeapon, sans logique interne.
     - Le debug visuel (ranges) est entièrement piloté par debugSystem.js.
     - Le moteur est strictement déterministe : aucune action n’est déclenchée ici,
       il ne fait qu’orchestrer et dessiner.
*/


import { GameState, getState } from "./state.js";

import { updateBiomeForet, drawBiomeForet } from "../world/biome_foret.js";
import { camera, updateCamera } from "../systems/cameraSystem.js";

import { enemies, updateEnemies, drawEnemies } from "../systems/enemy/enemySystem.js";
import { player } from "../systems/player/player.js";
import { updateHP, updateShield } from "../systems/player/playerStatsSystem.js";

import {
    updateProjectiles,
    drawProjectiles,
    handleProjectileCollisions
} from "../systems/projectileSystem.js";

import {
    damageEnemy,
    updateDamageNumbers,
    drawDamageNumbers
} from "../systems/damageSystem.js";

import { updateRunXP, runXP, spawnXP } from "../systems/xp/runXP.js";

import {
    updateBoss,
    drawBoss,
    drawBossIndicator,
    boss,
    spawnBoss
} from "../systems/enemy/bossSystem.js";

import { onPlayerDeath } from "../systems/deathSystem.js";

import { HUD } from "../UI/hud/hudSystem.js";

import { moveEntity, updatePlayerDirection } from "../systems/movementSystem.js";

import {
    updatePlayerCombat,
    updateMobCombat
} from "../systems/combatSystem.js";

import { debugFlags } from "../systems/debugSystem.js";

// ================================
// UPDATE LOOP
// ================================
export function updateEngine(dt, context) {

    if (getState() !== GameState.PLAYING) return;
    if (!player) return;

    // 1) INPUT → direction
    updatePlayerDirection(player);

    // 2) Déplacement
    moveEntity(player, player.dx || 0, player.dy || 0, dt);

    // 3) Caméra après mouvement
    updateCamera(player, context.canvas);

    // 4) Arme de test via debugSystem
    if (player.debugLockWeapon) {
    player.weapon = player.testWeapon;
    }


    // 5) Stats
    updateHP(player, dt);
    updateShield(player, dt);

    if (player.hp <= 0) {
        onPlayerDeath();
        return;
    }

    // 6) Monde
    updateBiomeForet(dt, player, enemies);

    // 7) Ennemis
    updateEnemies(dt, player, context);

    // 8) Combat
    updatePlayerCombat(player, enemies, context.cursor, dt);

    for (const mob of enemies) {
        if (!mob.dead) updateMobCombat(mob, player, dt);
    }

    // 9) Projectiles
    updateProjectiles(dt, player, enemies);

    handleProjectileCollisions(
        (p, m) => {
            const isCrit = Math.random() < (player.critChance || 0);

            damageEnemy(m, {
                base: p.damage,
                type: p.element,
                isCrit
            });

            if (m.hp <= 0 && !m.dead) {
                m.dead = true;
                context.addObjective(m.progressValue || m.objectivePoints || 1);
                spawnXP(m.x, m.y);
            }
        },
        player,
        enemies
    );

    // 10) Boss
    if (!context.bossSpawned && context.objective >= context.objectiveMax) {
        spawnBoss(player, context.difficulty || 1, context.biomeId || "foret");
        context.bossSpawned = true;
    }

    if (context.bossSpawned && boss) {
        updateBoss(player, dt);
    }

    // 11) XP + Damage numbers
    updateRunXP(player);
    updateDamageNumbers(dt);

    // 12) HUD
    HUD.update({
        hp: player.hp,
        maxHp: player.maxHp,
        shield: player.shield ?? 0,
        maxShield: player.maxShield ?? 0,
        xp: runXP.xp,
        xpMax: runXP.xpToNext,
        objective: context.objective,
        objectiveMax: context.objectiveMax,
        bossSpawned: context.bossSpawned
    });
}

// ================================
// RENDER LOOP
// ================================
export function renderEngine(ctx, canvas, context) {

    if (!player) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBiomeForet(ctx, canvas, player);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawEnemies(ctx);
    drawProjectiles(ctx);

    if (context.bossSpawned && boss) {
        drawBoss(ctx, camera, canvas);
        drawBossIndicator(ctx, camera, canvas);
    }

    ctx.restore();

    // Player
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );

    ctx.restore();

    // ================================
    // DEBUG RANGES (R)
    // ================================
    if (debugFlags.ranges) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // Attack range
        ctx.strokeStyle = "rgba(255,0,0,0.5)";
        ctx.beginPath();
        ctx.arc(
            player.x,
            player.y,
            player.runtime?.attackRange ?? 0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        // Aggro mobs
        ctx.strokeStyle = "rgba(255,80,80,0.35)";
        for (const e of enemies) {
            if (e.dead) continue;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.aggroRange ?? 280, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawDamageNumbers(ctx);
    HUD.draw(ctx, canvas);
}
