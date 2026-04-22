import { Bestiary } from "../data/bestiary.js";
import { createEnemy } from "./enemyFactory.js";

export function generateBiomeMobs(biomeId, level, affixes = []) {
    const result = [];

    for (let [type, data] of Object.entries(Bestiary)) {

        // Filtre biome
        if (!data.biomes.includes(biomeId)) continue;

        // Filtre niveau
        if (level < data.minLevel || level > data.maxLevel) continue;

        // Génération selon weight
        for (let i = 0; i < data.weight; i++) {

            // On crée le mob SANS position
            const mob = createEnemy(
                type,          // type du mob
                biomeId,       // biome
                level,         // difficulté / niveau
                0, 0,          // position (sera définie dans le biome)
                data           // bestiaryData → élite, points, stats, entourage
            );

            if (mob) {
                mob.affixes = affixes; // si tu veux appliquer des affixes plus tard
                result.push(mob);
            }
        }
    }

    return result;
}
