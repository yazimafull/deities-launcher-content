// ROUTE : Jeux/Sanctuaire/js/data/bossProfiles.js
// ============================================================================
// BESTIAIRE DE BOSS — profils complets pour générer différents boss
// ============================================================================

export const bossProfiles = {

    // =========================================================================
    // DÉMON — mêlée + projectiles de feu
    // =========================================================================
    demon: {
        name: "Démon",
        color: "#aa0000",

        stats: {
            maxHp: 2500,
            moveSpeed: 60,
            aggroRange: 650
        },

        melee: {
            enabled: true,
            damage: 30,
            range: 45,
            cooldown: 1200,
            element: "physical",
            coefficient: 1
        },

        ranged: {
            enabled: true,
            damage: 40,
            speed: 100,
            range: 700,
            cooldown: 4000,
            element: "fire",
            coefficient: 1
        }
    },

    // =========================================================================
    // GOLEM — pure mêlée, lent mais très puissant
    // =========================================================================
    golem: {
        name: "Golem",
        color: "#777777",

        stats: {
            maxHp: 4000,
            moveSpeed: 35,
            aggroRange: 550
        },

        melee: {
            enabled: true,
            damage: 60,
            range: 60,
            cooldown: 1500,
            element: "physical",
            coefficient: 1.2
        },

        ranged: {
            enabled: false
        }
    },

    // =========================================================================
    // LICH — pure distance, projectiles de glace
    // =========================================================================
    lich: {
        name: "Liche",
        color: "#00aaff",

        stats: {
            maxHp: 1800,
            moveSpeed: 55,
            aggroRange: 800
        },

        melee: {
            enabled: false
        },

        ranged: {
            enabled: true,
            damage: 50,
            speed: 650,
            range: 900,
            cooldown: 2500,
            element: "ice",
            coefficient: 1.3
        }
    },

    // =========================================================================
    // ARCHER SPECTRAL — distance rapide, spam de projectiles
    // =========================================================================
    spectral_archer: {
        name: "Archer Spectral",
        color: "#8844ff",

        stats: {
            maxHp: 1500,
            moveSpeed: 80,
            aggroRange: 900
        },

        melee: {
            enabled: false
        },

        ranged: {
            enabled: true,
            damage: 25,
            speed: 150,
            range: 1000,
            cooldown: 1200,
            element: "arcane",
            coefficient: 0.8
        }
    }
};
