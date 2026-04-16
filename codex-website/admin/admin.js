document.addEventListener("DOMContentLoaded", () => {

    const BASE_URL = "https://codex-backend1.onrender.com";

    // TOKEN HELPERS
    function getToken() {
        return localStorage.getItem("codex_token");
    }

    function logout() {
        localStorage.removeItem("codex_token");
        window.location.href = "../login.html";
    }

    // FIX LOGOUT + HOME
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;

    const homeLink = document.getElementById("home-link");
    if (homeLink) homeLink.onclick = () => window.location.href = "/index.html";

    // AUTH CHECK
    async function loadAdmin() {
        const token = getToken();
        if (!token) return logout();

        const res = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return logout();

        const user = await res.json();

        if (user.role !== "admin") return logout();

        loadUploads();
    }

    // SIDEBAR NAVIGATION
    document.querySelectorAll(".sidebar a[data-section]").forEach(a => {
        a.addEventListener("click", () => {
            document.querySelectorAll(".sidebar a").forEach(x => x.classList.remove("active"));
            a.classList.add("active");

            const sectionId = "section-" + a.dataset.section;
            document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
            document.getElementById(sectionId).classList.add("active");

            if (a.dataset.section === "uploads") loadUploads();
            if (a.dataset.section === "store") loadStoreGames();
        });
    });

    // LOAD DEVELOPER UPLOADS
    async function loadUploads() {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/api/admin/uploads`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const uploads = data.uploads || [];

        const container = document.getElementById("uploads-container");

        if (uploads.length === 0) {
            container.innerHTML = "<p>No uploads yet.</p>";
            return;
        }

        let html = `
            <table>
                <tr>
                    <th>Game ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Developer</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
        `;

        for (const u of uploads) {
            html += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.name}</td>
                    <td>$${(u.price / 100).toFixed(2)}</td>
                    <td>${u.developer_email}</td>
                    <td>${u.status}</td>
                    <td>
                        ${u.status === "pending" ? `
                            <button class="btn-approve" onclick="approve('${u.id}')">Approve</button>
                            <button class="btn-reject" onclick="rejectUpload('${u.id}')">Reject</button>
                        ` : ""}
                    </td>
                </tr>
            `;
        }

        html += "</table>";
        container.innerHTML = html;
    }

    // APPROVE / REJECT
    async function approve(id) {
        const token = getToken();

        await fetch(`${BASE_URL}/api/admin/approve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ upload_id: id })
        });

        loadUploads();
    }

    async function rejectUpload(id) {
        const token = getToken();

        await fetch(`${BASE_URL}/api/admin/reject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ upload_id: id })
        });

        loadUploads();
    }

    // STORE MANAGEMENT
    async function loadStoreGames() {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/api/admin/store/games`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        const games = data.games || [];

        const container = document.getElementById("store-games-container");
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
                <input value="${game.name}" id="title-${game.folder}">

                <label>Price (USD)</label>
                <input value="${game.price}" id="price-${game.folder}" type="number">

                <label>Description</label>
                <textarea id="desc-${game.folder}">${game.description || ""}</textarea>

                <button onclick="saveGame('${game.folder}')">Save Changes</button>
                <button onclick="toggleFeature('${game.folder}')">
                    ${game.featured ? "Unfeature" : "Feature"}
                </button>
                <button class="danger" onclick="toggleHide('${game.folder}')">
                    ${game.hidden ? "Unhide" : "Hide"}
                </button>
            `;

            container.appendChild(card);
        });
    }

    async function saveGame(folder) {
        const token = getToken();

        const body = {
            name: document.getElementById(`title-${folder}`).value,
            price: document.getElementById(`price-${folder}`).value,
            description: document.getElementById(`desc-${folder}`).value
        };

        await fetch(`${BASE_URL}/api/admin/store/update/${folder}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        alert("Game updated!");
        loadStoreGames();
    }

    async function toggleFeature(folder) {
        const token = getToken();

        await fetch(`${BASE_URL}/api/admin/store/feature/${folder}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        loadStoreGames();
    }

    async function toggleHide(folder) {
        const token = getToken();

        await fetch(`${BASE_URL}/api/admin/store/hide/${folder}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        loadStoreGames();
    }

    // INIT
    loadAdmin();

});
