// js/core/uiScale.js
/*
   ROUTE : js/core/uiScale.js
   RÔLE : Scale global du #ui-root sur la base 1920x1080
   EXPORTS : initUIScale
   NOTES : À appeler une seule fois dans loader.js
*/

export function initUIScale() {
    const root = document.getElementById("ui-root");
    if (!root) return;

    function applyScale() {
        const scale = Math.min(
            window.innerWidth / 1920,
            window.innerHeight / 1080
        );

        const left = (window.innerWidth - 1920 * scale) / 2;
        const top = (window.innerHeight - 1080 * scale) / 2;

        root.style.transform = `scale(${scale})`;
        root.style.left = `${left}px`;
        root.style.top = `${top}px`;
    }

    applyScale();
    window.addEventListener("resize", applyScale);
}
