/*
   ROUTE : Jeux/Sanctuaire/js/systems/biomeSpawner.js
   RÔLE :
     Génération procédurale des mobs d’un biome selon Bestiary, niveau et paramètres du biome.
     Produit un ensemble cohérent : élites dynamiques + entourage + mobs normaux.
*/

import { Bestiary } from "../data/bestiary.js";
import { createEnemy } from "./enemy/enemyFactory.js";

/**
 * generateBiomeMobs(biomeId, level, biomeData, affixes = [])
 * biomeData = { objectiveMax, eliteMin, eliteMax }
 */
export function generateBiomeMobs(biomeId, level, biomeData, affixes = []) {

    const { objectiveMax, eliteMin, eliteMax } = biomeData;

    // ============================================================================
    // 1. Construction du pool de mobs valides pour ce biome
    // ============================================================================
    const pool = [];

    for (const [type, data] of Object.entries(Bestiary)) {

        if (type === "boss") continue;
        if (!data.biomes.includes(biomeId)) continue;

        const minLvl = data.levelRange?.min ?? 1;
        const maxLvl = data.levelRange?.max ?? 99;
        if (level < minLvl || level > maxLvl) continue;

        const weight = data.weight ?? 1;
        for (let i = 0; i < weight; i++) {
            pool.push({ type, data });
        }
    }

    if (pool.length === 0) return [];

    const result = [];
    let totalPoints = 0;

    // ============================================================================
    // 2. Génération des élites dynamiques
    // ============================================================================
    const eliteCount = Math.floor(
        eliteMin + Math.random() * (eliteMax - eliteMin + 1)
    );

    for (let i = 0; i < eliteCount; i++) {

        const entry = pool[Math.floor(Math.random() * pool.length)];

        // Création de l'élite
        const elite = createEnemy(
            entry.type,
            biomeId,
            level,
            0, 0,
            entry.data,
            { elite: true }
        );

        if (!elite) continue;

        // Points d’objectif élite
        const basePoints = entry.data.rewards?.objectivePoints ?? 1;
        elite.objectivePoints = basePoints * 3;

        result.push(elite);
        totalPoints += elite.objectivePoints;

        // ============================================================================
        // 2B. ENTOURAGE MÉLANGÉ (3 mobs aléatoires du biome)
        // ============================================================================
        const entourageCount = 3;

        for (let j = 0; j < entourageCount; j++) {

            // Choisir un type aléatoire dans le pool du biome
            const rand = pool[Math.floor(Math.random() * pool.length)];

            // Positionner autour de l'élite
            const angle = Math.random() * Math.PI * 2;
            const dist = elite.visualSize * 1.8;

            const ex = elite.x + Math.cos(angle) * dist;
            const ey = elite.y + Math.sin(angle) * dist;

            const mob = createEnemy(
                rand.type,
                biomeId,
                level,
                ex, ey,
                rand.data,
                {}
            );

            if (!mob) continue;

            mob.objectivePoints = rand.data.rewards?.objectivePoints ?? 1;

            result.push(mob);
            totalPoints += mob.objectivePoints;
        }
    }

    // ============================================================================
    // 3. Génération des mobs normaux jusqu’à objectiveMax
    // ============================================================================

    // 🔥 Multiplicateur de densité (temporaire ou futur affixe)
    const densityMultiplier = 1.5; // +50% de mobs

    while (totalPoints < objectiveMax * densityMultiplier) {

        const entry = pool[Math.floor(Math.random() * pool.length)];

        const mob = createEnemy(
            entry.type,
            biomeId,
            level,
            0, 0,
            entry.data,
            {}
        );

        if (!mob) continue;

        if (affixes.length > 0 && entry.data.affixesAllowed === true) {
            mob.affixes = [...affixes];
        }

        mob.objectivePoints = entry.data.rewards?.objectivePoints ?? 1;

        result.push(mob);
        totalPoints += mob.objectivePoints;
    }


    return result;
}
