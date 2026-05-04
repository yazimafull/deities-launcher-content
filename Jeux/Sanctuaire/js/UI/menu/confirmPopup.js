/*
   ROUTE : js/UI/menu/confirmPopup.js
   RÔLE : Popup système de confirmation (Oui / Non)
   EXPORTS : openConfirmPopup
   NOTES :
     - Appel : openConfirmPopup({ title, message, onConfirm })
*/

let overlay = null;

export function openConfirmPopup({ title = "Confirmation", message = "", onConfirm }) {

    // Supprimer l’ancienne popup si elle existe
    if (overlay) overlay.remove();

    // === OVERLAY ===
    overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.dataset.overlay = "confirm";
    overlay.style.zIndex = "9500";

    // === MODAL ===
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // === TITRE ===
    const h = document.createElement("h1");
    h.textContent = title;
    modal.appendChild(h);

    // === MESSAGE MULTI-LIGNE ===
    const msg = document.createElement("p");
    msg.style.whiteSpace = "pre-line";   // ← permet les retours à la ligne
    msg.style.fontSize = "18px";
    msg.style.margin = "20px 0";
    msg.textContent = message;
    modal.appendChild(msg);

    // === FOOTER (ACTIONS) ===
    const actions = document.createElement("div");
    actions.classList.add("actions");

    const yesBtn = document.createElement("button");
    yesBtn.classList.add("btn");
    yesBtn.textContent = "Accepter";
    yesBtn.onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };

    const noBtn = document.createElement("button");
    noBtn.classList.add("btn");
    noBtn.textContent = "Annuler";
    noBtn.onclick = () => overlay.remove();

    actions.appendChild(yesBtn);
    actions.appendChild(noBtn);
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
