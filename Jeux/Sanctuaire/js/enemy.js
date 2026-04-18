// enemy.js
import { dist2 } from "./utils.js";
import { spawnXP } from "./xp.js";

export const enemies = [];

// -------------------------------
// SPAWN DES ENNEMIS
// -------------------------------
export function spawnEnemy() {
    const type = ["zombie", "runner", "tank"][Math.floor(Math.random() * 3)];

    // Spawn sur les bords de l'écran
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * window.innerWidth;  y = -50; }
    if (side === 1) { x = window.innerWidth + 50;              y = Math.random() * window.innerHeight; }
    if (side === 2) { x = Math.random() * window.innerWidth;  y = window.innerHeight + 50; }
    if (side === 3) { x = -50;                                  y = Math.random() * window.innerHeight; }

    let enemy = {
        type,
        x, y,
        size: 25,
        speed: 1,
        hp: 20,
        maxHp: 20,

        // --- DÉFENSE ---
        armor: 0,
        resistance: 0,
        dodgeChance: 0,
        parryChance: 0,
        parryReduction: 0.7,
        blockChance: 0,
        blockValue: 0,
        shieldPhysical: 0,
        shieldMagic: 0,

        // --- ATTAQUE ---
        damage: 5,
        damageType: "physical",
    };

    // -------------------------------
    // TYPES D'ENNEMIS
    // -------------------------------
    if (type === "zombie") {
        enemy.hp = 20; enemy.maxHp = 20;
        enemy.speed = 1.0;
        enemy.size = 25;
        enemy.damage = 5;
    }
    if (type === "runner") {
        enemy.hp = 15; enemy.maxHp = 15;
        enemy.speed = 2.2;
        enemy.size = 20;
        enemy.damage = 4;
        enemy.dodgeChance = 0.10;
    }
    if (type === "tank") {
        enemy.hp = 50; enemy.maxHp = 50;
        enemy.speed = 0.7;
        enemy.size = 35;
        enemy.damage = 8;
        enemy.armor = 3;
        enemy.resistance = 0.10;
        enemy.shieldPhysical = 10;
    }

    enemies.push(enemy);
} // ✅ accolade fermante de spawnEnemy

// -------------------------------
// UPDATE DES ENNEMIS
// -------------------------------
export function updateEnemies(player) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];

        // Déplacement vers le joueur
        let dx = player.x - e.x;
        let dy = player.y - e.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
            dx /= d;
            dy /= d;
        }
        e.x += dx * e.speed;
        e.y += dy * e.speed;

        // ✅ Mort de l'ennemi → spawn XP
        if (e.hp <= 0) {
            spawnXP(e.x, e.y);
            enemies.splice(i, 1);
        }
    }
} // ✅ accolade fermante de updateEnemies

// -------------------------------
// DESSIN DES ENNEMIS
// -------------------------------
export function drawEnemies(ctx) {
    for (let e of enemies) {
        if (e.type === "zombie") ctx.fillStyle = "#ff4444";
        if (e.type === "runner") ctx.fillStyle = "#ff8800";
        if (e.type === "tank")   ctx.fillStyle = "#aa0000";
        ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
    }
} // ✅ accolade fermante de drawEnemies
