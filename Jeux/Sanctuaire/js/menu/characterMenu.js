export function initCharacterMenu() {

    const createBtn = document.getElementById("create-character-btn");
    const playBtn = document.getElementById("play-character-btn");
    const nameInput = document.getElementById("character-name-input");
    const listContainer = document.getElementById("character-list");

    let selectedCharacter = null;
    let characters = [];

    function refreshList() {
        listContainer.innerHTML = "";
        characters.forEach((c) => {
            const div = document.createElement("div");
            div.className = "character-entry";
            div.textContent = c.name;

            div.addEventListener("click", () => {
                selectedCharacter = c;
                document.querySelectorAll(".character-entry")
                    .forEach(e => e.classList.remove("selected"));
                div.classList.add("selected");
            });

            listContainer.appendChild(div);
        });
    }

    createBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (!name) return;

        const newChar = { name };
        characters.push(newChar);
        refreshList();
        nameInput.value = "";
    });

    playBtn.addEventListener("click", () => {
        if (!selectedCharacter) return;

        const event = new CustomEvent("startGameWithCharacter", {
            detail: selectedCharacter
        });

        document.dispatchEvent(event);
    });

    refreshList();
}

window.addEventListener("DOMContentLoaded", initCharacterMenu);
