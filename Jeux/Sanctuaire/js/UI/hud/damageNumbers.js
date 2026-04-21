// damageNumbers.js

const damageNumbers = [];

function spawnDamageNumber(x, y, value, reason) {
    let text = "";
    let color = "#ffffff";
    let size = 20;
    let lifetime = 800;
    let rotation = (Math.random() * 0.4) - 0.2;
    let vy = -0.4 - Math.random() * 0.3;

    switch (reason) {
        case "crit":
            text = "CRIT " + Math.floor(value);
            color = "#ffdd33";
            size = 40;
            lifetime = 1000;
            rotation = (Math.random() * 0.8) - 0.4;
            vy = -1.0;
            break;

        case "dodge":
            text = "Esquive";
            color = "#00eaff";
            size = 26;
            break;

        case "parry":
            text = "Parade";
            color = "#ffe066";
            size = 26;
            break;

        case "block":
            text = "Blocage";
            color = "#b0b0b0";
            size = 24;
            break;

        case "shieldPhysical":
            text = "-" + value;
            color = "#4da6ff";
            size = 22;
            break;

        case "shieldMagic":
            text = "-" + value;
            color = "#c266ff";
            size = 22;
            break;

        case "hp":
        default:
            text = "-" + Math.floor(value);
            color = "#ff4444";
            size = 24;
            break;
    }

    damageNumbers.push({
        x,
        y,
        text,
        color,
        size,
        alpha: 1,
        lifetime,
        rotation,
        vy,
        createdAt: performance.now(),
        shake: reason === "crit" ? 4 : 0
    });
}

function updateDamageNumbers() {
    const now = performance.now();

    for (let dn of damageNumbers) {
        let age = now - dn.createdAt;
        let t = age / dn.lifetime;

        dn.y += dn.vy;

        if (dn.shake > 0) {
            dn.x += (Math.random() - 0.5) * dn.shake;
        }

        dn.alpha = 1 - t;

        if (t < 0.2) {
            dn.size *= 1.03;
        }
    }

    for (let i = damageNumbers.length - 1; i >= 0; i--) {
        if (damageNumbers[i].alpha <= 0) {
            damageNumbers.splice(i, 1);
        }
    }
}

function drawDamageNumbers(ctx) {
    ctx.save();

    for (let dn of damageNumbers) {
        ctx.globalAlpha = dn.alpha;
        ctx.fillStyle = dn.color;
        ctx.font = `${dn.size}px Arial`;
        ctx.textAlign = "center";

        ctx.save();
        ctx.translate(dn.x, dn.y);
        ctx.rotate(dn.rotation);
        ctx.fillText(dn.text, 0, 0);
        ctx.restore();
    }

    ctx.restore();
}
