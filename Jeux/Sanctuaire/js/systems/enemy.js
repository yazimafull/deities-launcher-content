// enemy.js
// IA complète des ennemis — idle / chase / leash / dead

// ================================
// UPDATE DE TOUS LES ENNEMIS
// ================================
export function updateEnemies(mobs, player, onMobDied) {
    const now = performance.now();

    for (let i = mobs.length - 1; i >= 0; i--) {
        const m = mobs[i];
        if (m.dead) continue;

        updateEnemyIA(m, player, now);

        // Mort détectée → callback
        if (m.hp <= 0 && !m.dead) {
            m.dead  = true;
            m.state = "dead";
            if (onMobDied) onMobDied(m);
        }
    }
}

// ================================
// IA D'UN ENNEMI
// ================================
function updateEnemyIA(m, player, now) {
    const dx           = player.x - m.x;
    const dy           = player.y - m.y;
    const distToPlayer = Math.hypot(dx, dy);

    const sdx         = m.spawnX - m.x;
    const sdy         = m.spawnY - m.y;
    const distToSpawn = Math.hypot(sdx, sdy);

    switch (m.state) {

        case "idle":
            if (distToPlayer < m.aggroRange) {
                m.state = "chase";
            }
            break;

        case "chase":
            // Trop loin du spawn → leash
            if (distToSpawn > m.leashRange) {
                m.state = "leash";
                break;
            }

            // Avancer vers le joueur
            if (distToPlayer > 0) {
                m.x += (dx / distToPlayer) * m.speed;
                m.y += (dy / distToPlayer) * m.speed;
            }

            // Contact joueur → dégâts
            if (distToPlayer < (player.size / 2 + m.size / 2)) {
                if (now - m.lastDmgTime > m.damageCd) {
                    player.hp       = Math.max(0, player.hp - m.damage);
                    m.lastDmgTime   = now;
                }
            }
            break;

        case "leash":
            // Retour au spawn
            if (distToSpawn > 4) {
                m.x  += (sdx / distToSpawn) * m.speed * 1.5;
                m.y  += (sdy / distToSpawn) * m.speed * 1.5;
                m.hp  = Math.min(m.maxHp, m.hp + 0.5); // regen pendant retour
            } else {
                m.hp    = m.maxHp;
                m.state = "idle";
            }

            // Joueur revient en range → rechase
            if (distToPlayer < m.aggroRange) {
                m.state = "chase";
            }
            break;
    }
}

// ================================
// INFLIGER DES DÉGÂTS À UN ENNEMI
// ================================
export function damageEnemy(mob, amount) {
    if (mob.dead) return;
    mob.hp -= amount;
    if (mob.hp <= 0) mob.hp = 0;
}

// ================================
// DESSIN DE TOUS LES ENNEMIS
// ================================
export function drawEnemies(ctx, mobs, camera, canvas) {
    for (let m of mobs) {
        if (m.dead) continue;

        // Culling
        if (m.x < camera.x - 100 || m.x > camera.x + canvas.width  + 100) continue;
        if (m.y < camera.y - 100 || m.y > camera.y + canvas.height + 100) continue;

        drawEnemy(ctx, m);
    }
}

function drawEnemy(ctx, m) {
    ctx.globalAlpha = m.alpha ?? 1.0;

    // Ombre
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(m.x, m.y + m.size/2 - 2, m.size/2, 5, 0, 0, Math.PI*2);
    ctx.fill();

    // Corps — plus clair en chase
    ctx.fillStyle = m.state === "chase" ? brighten(m.color) : m.color;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.size/2, 0, Math.PI*2);
    ctx.fill();

    // Contour élite
    if (m.isElite) {
        ctx.strokeStyle = "#ffcc00";
        ctx.lineWidth   = 2.5;
        ctx.stroke();
    }

    // Contour boss
    if (m.isBoss) {
        ctx.strokeStyle = "#dd00ff";
        ctx.lineWidth   = 3.5;
        ctx.stroke();
    }

    // Barre de vie
    const barW = m.size * 1.4;
    drawHealthBar(
        ctx,
        m.x - barW/2,
        m.y - m.size/2 - 10,
        barW, 5,
        m.hp / m.maxHp,
        m.isElite ? "#ffcc00" : "#ff4444"
    );

    ctx.globalAlpha = 1.0;
}

function drawHealthBar(ctx, x, y, w, h, pct, color) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * Math.max(0, pct), h);
}

function brighten(hex) {
    try {
        const r  = parseInt(hex.slice(1,3), 16);
        const g  = parseInt(hex.slice(3,5), 16);
        const b  = parseInt(hex.slice(5,7), 16);
        const br = v => Math.min(255, v+40).toString(16).padStart(2,"0");
        return `#${br(r)}${br(g)}${br(b)}`;
    } catch { return hex; }
}