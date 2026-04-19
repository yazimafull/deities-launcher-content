// utils.js

// Nombre aléatoire entre min et max
export function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Choisir un élément au hasard dans un tableau
export function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Distance au carré (évite les sqrt coûteux)
export function dist2(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return dx * dx + dy * dy;
}

// Collision cercle / rectangle (pour projectiles)
export function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
    let testX = cx;
    let testY = cy;

    if (cx < rx) testX = rx;
    else if (cx > rx + rw) testX = rx + rw;

    if (cy < ry) testY = ry;
    else if (cy > ry + rh) testY = ry + rh;

    let distX = cx - testX;
    let distY = cy - testY;
    let distance = distX * distX + distY * distY;

    return distance <= r * r;
}
