/*
   ROUTE : Jeux/Sanctuaire/js/systems/biomeSpawner.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → biomeSpawner.js

   RÔLE :
     Génération procédurale des mobs d’un biome selon Bestiary, niveau et paramètres du biome.
     Produit un ensemble cohérent : élites dynamiques + mobs normaux jusqu’à objectiveMax.

   PRINCIPES :
     - Aucune logique de combat ici : uniquement de la génération.
     - Exclut toujours le boss du pool.
     - Utilise Bestiary comme source de vérité (biomes, levelRange, weight, rewards).
     - Les affixes globaux ne s’appliquent que si affixesAllowed === true.
     - Les mobs sont créés en (0,0) → position assignée ensuite par le biome.

   DÉPENDANCES :
     - data/bestiary.js
     - systems/enemy/enemyFactory.js
*/

import { Bestiary } from "../data/bestiary.js";
import { createEnemy } from "./enemy/enemyFactory.js";

/**
 * generateBiomeMobs(biomeId, level, biomeData, affixes = [])
 * biomeData = { objectiveMax, eliteMin, eliteMax }
 */
export function generateBiomeMobs(biomeId, level, biomeData, affixes = []) {

    const { objectiveMax, eliteMin, eliteMax } = biomeData;

    // ================================
    // 1. Construction du pool de mobs valides
    // ================================
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

    // ================================
    // 2. Génération des élites dynamiques
    // ================================
    const eliteCount = Math.floor(
        eliteMin + Math.random() * (eliteMax - eliteMin + 1)
    );

    for (let i = 0; i < eliteCount; i++) {

        const entry = pool[Math.floor(Math.random() * pool.length)];

        // enemyFactory doit recevoir le bestiaryData complet
        const mob = createEnemy(
            entry.type,
            biomeId,
            level,
            0, 0,
            entry.data,      // bestiaryData
            { elite: true }  // flags supplémentaires
        );

        if (!mob) continue;

        const basePoints = entry.data.rewards?.objectivePoints ?? 1;
        mob.objectivePoints = basePoints * 3;

        result.push(mob);
        totalPoints += mob.objectivePoints;
    }

    // ================================
    // 3. Génération des mobs normaux jusqu’à objectiveMax
    // ================================
    while (totalPoints < objectiveMax) {

        const entry = pool[Math.floor(Math.random() * pool.length)];

        const mob = createEnemy(
            entry.type,
            biomeId,
            level,
            0, 0,
            entry.data,   // bestiaryData
            {}            // flags
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
