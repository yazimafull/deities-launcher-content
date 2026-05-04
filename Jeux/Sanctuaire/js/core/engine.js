/*
   ROUTE : Jeux/Sanctuaire/js/core/engine.js

   RÔLE :
     Boucle centrale du jeu. Ordonne l’exécution de tous les systèmes frame-by-frame.
     Ne contient AUCUNE logique gameplay : délègue tout aux systèmes spécialisés.

   RESPONSABILITÉS :
     - Input → mouvement → caméra
     - Mise à jour du monde (biome)
     - Mise à jour ennemis + boss
     - Combat joueur / mobs
     - Projectiles + collisions
     - Régénération HP / Shield
     - XP de la run
     - Damage numbers
     - HUD
     - Debug

   PRINCIPES :
     - Le moteur consomme player.stats (déjà calculées)
     - HP/Shield = runtime → régénération uniquement ici
     - Aucune stat recalculée dans engine
     - Ordre strict : input → mouvement → caméra → systèmes → HUD
*/

import { GameState, getState } from "./state.js";
import { DebugStats, drawDebugStats } from "../systems/debug/debugStats.js";

import { updateBiomeForet, drawBiomeForet } from "../world/biome_foret.js";
import { camera, updateCamera } from "../systems/cameraSystem.js";

import { enemies, updateEnemies, drawEnemies } from "../systems/enemy/enemySystem.js";
import { player } from "../systems/player/player.js";

import { updateHP, updateShield } from "../systems/player/playerRuntimeSystem.js";

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

import { updateRunXP, runXP, spawnXP, computeXP } from "../systems/xp/runXP.js";

import {
    updateBoss,
    drawBoss,
    drawBossIndicator,
    drawBossAggroCircle,
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


// ============================================================================
// UPDATE LOOP
// ============================================================================
export function updateEngine(dt, context) {

    if (getState() !== GameState.PLAYING) return;
    if (!player) return;

    // 1) INPUT → direction
    updatePlayerDirection(player);

    // 2) Déplacement
    moveEntity(player, player.dx || 0, player.dy || 0, dt);

    // 3) Caméra après mouvement
    updateCamera(player, context.canvas);

    // 4) Arme de test via debug
    if (player.debugLockWeapon) {
        player.weapon = player.testWeapon;
    }

    // 5) Régénération HP / Shield (runtime pur)
    updateHP(player, dt);
    updateShield(player, dt);

    DebugStats.stats = player.stats;

    if (player.hp <= 0) {
        onPlayerDeath();
        return;
    }

    // 6) Monde (biome)
    updateBiomeForet(dt, player, enemies);

    // 7) Ennemis
    updateEnemies(dt, player, context);
   

    // 8) Combat joueur / mobs
    updatePlayerCombat(player, enemies, context.cursor, dt);

    for (const mob of enemies) {
        if (!mob.dead) updateMobCombat(mob, player, dt);
    }

    // 9) Projectiles + collisions
    updateProjectiles(dt, player, enemies);

    handleProjectileCollisions(
        player,
        enemies,
        (proj, mob) => {

            // 1. Dégâts
            damageEnemy(mob, proj.damagePacket);

            // 2. Mort custom + XP + objectifs
            if (mob.hp <= 0 && !mob.dead) {
                mob.dead = true;

                context.objective += mob.objectivePoints ?? 1;

                const xpValue = computeXP(mob, context, player.stats);
                spawnXP(mob.x, mob.y, xpValue);
            }
        }
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

    // 12) HUD (lit les stats finales)
    HUD.update({
        hp: player.hp,
        maxHp: player.stats?.maxHp ?? 0,

        shield: player.shield ?? 0,
        maxShield: player.stats?.maxShield ?? 0,

        xp: runXP.xp,
        xpMax: runXP.xpToNext,

        objective: context.objective,
        objectiveMax: context.objectiveMax,
        bossSpawned: context.bossSpawned
    });
}


// ============================================================================
// RENDER LOOP
// ============================================================================
export function renderEngine(ctx, canvas, context) {

    if (!player) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Monde (background)
    drawBiomeForet(ctx, canvas, player);

    // ============================
    // ZONE MONDE (avec caméra)
    // ============================
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawEnemies(ctx);
    drawProjectiles(ctx);

    if (context.bossSpawned && boss) {
        drawBoss(ctx, camera, canvas);
        drawBossAggroCircle(ctx, camera);
    }

    ctx.restore();

    // ============================
    // Player (monde)
    // ============================
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

    // ============================
    // DEBUG RANGES (monde)
    // ============================
    if (debugFlags.ranges) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

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

        ctx.strokeStyle = "rgba(255,80,80,0.35)";
        for (const e of enemies) {
            if (e.dead) continue;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.aggroRange ?? 280, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    // ============================
    // HUD + Damage numbers (écran)
    // ============================
    drawDamageNumbers(ctx);
    HUD.draw(ctx, canvas);

    // ============================
    // Indicateur du boss (écran)
    // ============================
    if (context.bossSpawned && boss) {
        drawBossIndicator(ctx, camera, canvas);
    }

    // ============================
    // Debug Stats (écran)
    // ============================
    drawDebugStats(ctx, canvas, player);
}
