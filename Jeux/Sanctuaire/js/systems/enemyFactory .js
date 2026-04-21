// enemyFactory.js

const LOCAL_PATH = "./data/mobs/";
const GITHUB_PATH = "https://yazimafull.github.io/deities-launcher-content/data/mobs/";

export async function loadMobBlueprint(name) {
    try {
        const local = await fetch(LOCAL_PATH + name + ".json");
        if (local.ok) return await local.json();
    } catch {}

    try {
        const remote = await fetch(GITHUB_PATH + name + ".json");
        if (remote.ok) return await remote.json();
    } catch {}

    console.error("Mob blueprint introuvable :", name);
    return null;
}

export async function createMob(name, x, y) {
    const blueprint = await loadMobBlueprint(name);
    if (!blueprint) return null;

    return {
        name: blueprint.name,
        rarity: blueprint.rarity,
        biomes: blueprint.biomes,
        levels: blueprint.levels,

        x, y,
        hp: blueprint.stats.hp,
        maxHp: blueprint.stats.hp,
        damage: blueprint.stats.baseDamage,
        speed: blueprint.stats.speed,
        size: blueprint.stats.size,

        resistances: blueprint.defenses.resistances || {},
        armor: blueprint.defenses.armor || 0,
        critChance: blueprint.defenses.critChance || 0,

        abilities: blueprint.abilities || [],
        dots: [],

        dead: false
    };
}
