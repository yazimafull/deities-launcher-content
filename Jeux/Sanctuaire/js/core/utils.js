// utils.js

// ================================
// RANDOM
// ================================
export function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function randChoice(array) {
    return array[(Math.random() * array.length) | 0];
}

// ================================
// MATH / DISTANCE
// ================================
export function dist2(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}

// ================================
// COLLISION
// ================================
export function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {

    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return (dx * dx + dy * dy) <= r * r;
}