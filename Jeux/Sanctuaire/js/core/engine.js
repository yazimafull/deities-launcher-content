﻿// core/engine.js

import { GameState, getState } from "./state.js";

import { updateBiomeForet, drawBiomeForet, camera } from "../world/biome_foret.js";

import { enemies, updateEnemies, drawEnemies } from "../systems/enemySystem.js";

import {
    projectiles,
    updateProjectiles,
    drawProjectiles,
    handleProjectileCollisions
} from "../systems/projectile.js";

import {
    damageEnemy,
    updateDamageNumbers,
    drawDamageNumbers
} from "../systems/damageSystem.js";

import { tryShoot, updateShield } from "../systems/player.js";

import { updateXP, drawXP } from "../systems/xp.js";

import {
    updateBoss,
    drawBoss,
    drawBossIndicator,
    boss
} from "../systems/boss.js";

import { HUD } from "../ui/hud/hudSystem.js";

let player = null;

export function setPlayer(p) {
    player = p;
}

export function getPlayer() {
    return player;
}

// ================================
// UPDATE ENGINE (PURE GAME LOGIC)
// ================================
export function updateEngine(dt, context) {

    if (getState() !== GameState.PLAYING) return;
    if (!player) return;

    updateShield(player, dt);

    updateBiomeForet(dt, player);
    updateEnemies(dt, player);

    tryShoot(player, enemies, context.spawnProjectile);

    updateProjectiles(projectiles);

    handleProjectileCollisions(projectiles, enemies, (p, m) => {

        const isCrit = Math.random() < (player.critChance || 0);

        damageEnemy(m, {
            base: p.damage,
            type: p.element,
            isCrit
        });

        if (m.hp <= 0 && !m.dead) {
            m.dead = true;
            context.addObjective?.(m.progressValue || 1);
        }
    });

    if (context.bossSpawned && boss) {
        updateBoss(player);
    }

    updateXP(player);
    updateDamageNumbers(dt);

    HUD.update({
        hp: player.hp,
        maxHp: player.maxHp,
        shield: player.shield ?? 0,
        maxShield: player.maxShield ?? 0,
        xp: player.xp ?? 0,
        xpMax: player.xpMax ?? 1,
        objective: context.objective,
        objectiveMax: context.objectiveMax,
        bossSpawned: context.bossSpawned
    });
}

// ================================
// RENDER ENGINE (PURE RENDER)
// ================================
export function renderEngine(ctx, canvas, context) {

    if (!player) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBiomeForet(ctx, canvas, player);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawEnemies(ctx);
    drawProjectiles(ctx, projectiles);
    drawXP(ctx);

    if (context.bossSpawned && boss) {
        drawBoss(ctx, camera, canvas);
        drawBossIndicator(ctx, camera, canvas);
    }

    ctx.restore();

    drawDamageNumbers(ctx);

    HUD.draw(ctx, canvas);
}
