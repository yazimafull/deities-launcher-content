export function initSanctuary() {
    console.log("Sanctuaire chargé.");
}

export function updateSanctuary(dt) {
    // futur : PNJ, forge, pylône, interactions
}

export function renderSanctuary(ctx) {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Sanctuaire", 50, 50);
}
