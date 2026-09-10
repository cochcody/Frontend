async function loadStoreGames() {
    const token = getToken();

    const res = await fetch(`${BASE_URL}/api/admin/store/games`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    const games = data.games || [];

    const container = document.getElementById("store-games-container");
    if (!container) return;

    container.innerHTML = "";

    if (games.length === 0) {
        container.innerHTML = "<p>No games in store.</p>";
        return;
    }

    games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("store-card");

        card.innerHTML = `
            <h3>${game.name}</h3>

            <label>Title</label>
            <input value="${game.name}" id="title-${game.id}">

            <label>Price (USD)</label>
            <input value="${game.price}" id="price-${game.id}" type="number">

            <label>Description</label>
            <textarea id="desc-${game.id}">${game.description || ""}</textarea>

            <button onclick="saveGame('${game.id}')">Save Changes</button>
            <button onclick="toggleFeature('${game.id}')">
                ${game.featured ? "Unfeature" : "Feature"}
            </button>
            <button class="danger" onclick="toggleHide('${game.id}')">
                ${game.hidden ? "Unhide" : "Hide"}
            </button>
        `;

        container.appendChild(card);
    });
}

async function saveGame(id) {
    const token = getToken();

    const body = {
        name: document.getElementById(`title-${id}`).value,
        price: document.getElementById(`price-${id}`).value,
        description: document.getElementById(`desc-${id}`).value
    };

    await fetch(`${BASE_URL}/api/admin/store/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    showSaved();
    loadStoreGames();
}

async function toggleFeature(id) {
    const token = getToken();

    await fetch(`${BASE_URL}/api/admin/store/feature/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadStoreGames();
}

async function toggleHide(id) {
    const token = getToken();

    await fetch(`${BASE_URL}/api/admin/store/hide/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadStoreGames();
}

function showSaved() {
    const box = document.getElementById("save-status");
    box.innerText = "Changes Saved!";
    box.style.opacity = 1;

    setTimeout(() => {
        box.style.opacity = 0;
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    loadStoreGames();
});
