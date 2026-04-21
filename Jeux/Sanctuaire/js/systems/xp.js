// xp.js

const xpOrbs = [];

const xpSystem = {
    xp: 0,
    xpToNext: 50,
    level: 1
};

function spawnXP(x, y) {
    xpOrbs.push({
        x,
        y,
        size: 8,
        value: randRange(4, 8)
    });
}

function updateXP(player) {
    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        let o = xpOrbs[i];

        let dx = player.x - o.x;
        let dy = player.y - o.y;
        let d = Math.sqrt(dx * dx + dy * dy);

        if (d > 0) {
            dx /= d;
            dy /= d;
            o.x += dx * 1.5;
            o.y += dy * 1.5;
        }

        if (d < 20) {
            xpSystem.xp += o.value;
            xpOrbs.splice(i, 1);

            if (xpSystem.xp >= xpSystem.xpToNext) {
                xpSystem.xp -= xpSystem.xpToNext;
                xpSystem.level++;
                xpSystem.xpToNext = Math.floor(xpSystem.xpToNext * 1.25);

                showLevelUpMenu();
            }
        }
    }
}

function drawXP(ctx) {
    ctx.fillStyle = "#4aa3ff";
    for (let o of xpOrbs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawXPBar() {
    const bar = document.getElementById("xpbar");
    if (!bar) return;
    const pct = xpSystem.xp / xpSystem.xpToNext;
    bar.style.width = (pct * 100) + "%";
}
