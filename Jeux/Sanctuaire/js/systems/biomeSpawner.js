﻿// systems/biomeMobGenerator.js

import { Bestiary } from "../data/bestiary.js";
import { createEnemy } from "./enemyFactory.js";

/**
 * Génère tous les mobs possibles d’un biome selon :
 * - biomeId
 * - level
 * - affixes globaux éventuels
 */
export function generateBiomeMobs(biomeId, level, affixes = []) {
    const result = [];

    for (const [type, data] of Object.entries(Bestiary)) {

        // ================================
        // 1. FILTRE BIOME
        // ================================
        if (!data.biomes.includes(biomeId)) continue;

        // ================================
        // 2. FILTRE LEVEL
        // ================================
        const minLvl = data.levelRange?.min ?? data.minLevel ?? 1;
        const maxLvl = data.levelRange?.max ?? data.maxLevel ?? 99;
        if (level < minLvl || level > maxLvl) continue;

        // ================================
        // 3. WEIGHT (densité spawn)
        // ================================
        const count = data.weight ?? 1;

        for (let i = 0; i < count; i++) {

            // ================================
            // 4. CRÉATION DU MOB
            // ================================
            const mob = createEnemy(
                type,
                biomeId,
                level,
                0,   // x sera assigné dans le biome
                0,   // y sera assigné dans le biome
                data // bestiaryData (élite, points, entourage...)
            );

            if (!mob) continue;

            // ================================
            // 5. AFFIXES (optionnel)
            // ================================
            if (affixes.length > 0) {
                mob.affixes = [...affixes];
            }

            // ================================
            // 6. PUSH RESULTAT
            // ================================
            result.push(mob);
        }
    }

    return result;
}
