document.addEventListener("DOMContentLoaded", async () => {
    const storeList = document.getElementById("store-list");

    try {
        const response = await fetch("https://codex-backend1.onrender.com/api/store");
        const data = await response.json();

        storeList.innerHTML = "";

        // FIX: backend returns { games: [...] }
        data.games.forEach(game => {
            const div = document.createElement("div");
            div.classList.add("store-item");

            div.innerHTML = `
    <img src="https://codex-backend1.onrender.com${game.image}" class="store-cover">
    <h3>${game.name}</h3>
    <p>${game.description}</p>
    <p><strong>Price:</strong> $${game.price}</p>
    <button class="btn primary">View Game</button>
`;

            storeList.appendChild(div);
        });

    } catch (err) {
        storeList.innerHTML = "<p>Error loading store.</p>";
        console.error(err);
    }
});

