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

    // LOGOUT BUTTON
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.onclick = logout;

    // AUTH CHECK + PAGE DETECTION
    async function loadAdmin() {
        const token = getToken();
        if (!token) return logout();

        const res = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return logout();

        const user = await res.json();
        if (user.role !== "admin") return logout();

        // Detect page
        if (document.getElementById("uploads-container")) return loadUploads();
        if (document.getElementById("store-games-container")) return loadStoreGames();
        if (document.getElementById("stat-users")) return loadAnalytics();
        if (document.getElementById("userList")) return loadUsers();
    }


    document.addEventListener("DOMContentLoaded", loadUploads);

    // Load pending uploads
    async function loadUploads() {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/api/admin/uploads`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const container = document.getElementById("uploads-container");
        container.innerHTML = "";

        if (!data.uploads || data.uploads.length === 0) {
            container.innerHTML = "<p>No pending uploads.</p>";
            return;
        }

        data.uploads.forEach(upload => {
            const div = document.createElement("div");
            div.className = "upload-card";

            div.innerHTML = `
            <h3>${upload.name}</h3>
            <p>ID: ${upload.id}</p>
            <p>Price: ${upload.price}</p>
            <button class="approve-btn" data-id="${upload.id}">Approve</button>
            <button class="reject-btn" data-id="${upload.id}">Reject</button>
        `;

            container.appendChild(div);
        });

        attachHandlers();
    }

    // Attach button handlers
    function attachHandlers() {
        document.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", () => approve(btn.dataset.id));
        });

        document.querySelectorAll(".reject-btn").forEach(btn => {
            btn.addEventListener("click", () => rejectUpload(btn.dataset.id));
        });
    }

    // Approve upload
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

    // Reject upload
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

    // ANALYTICS
    async function loadAnalytics() {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        setText("stat-users", data.total_users);
        setText("stat-devs", data.total_developers);
        setText("stat-games", data.total_games);
        setText("stat-approved", data.total_sales);
        setText("stat-pending", 0);
        setText("stat-featured", 0);
        setText("stat-hidden", 0);
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // USER MANAGEMENT
    async function loadUsers() {
        const token = getToken();
        if (!token) return;

        const userList = document.getElementById("userList");
        userList.innerHTML = "<p>Loading users...</p>";

        try {
            const res = await fetch(`${BASE_URL}/api/admin/users`, {
                headers: { Authorization: "Bearer " + token }
            });

            const data = await res.json();
            userList.innerHTML = "";

            if (!data.users || data.users.length === 0) {
                userList.innerHTML = "<p>No users found.</p>";
                return;
            }

            data.users.forEach(user => {
                const card = document.createElement("div");
                card.className = "user-card";

                card.innerHTML = `
                    <h3>${user.gamertag}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><strong>Status:</strong> ${user.status}</p>

                    <a href="admin-user.html?email=${user.email}" class="view-btn">View</a>

                    <div class="user-actions">
                        <button onclick="promoteUser('${user.email}')">Promote</button>
                        <button onclick="demoteUser('${user.email}')">Demote</button>
                        <button onclick="suspendUser('${user.email}')">Suspend</button>
                        <button onclick="unsuspendUser('${user.email}')">Unsuspend</button>
                        <button onclick="banUser('${user.email}')">Ban</button>
                        <button onclick="unbanUser('${user.email}')">Unban</button>
                    </div>
                `;

                userList.appendChild(card);
            });

        } catch (err) {
            console.error("Error loading users:", err);
            userList.innerHTML = "<p>Error loading users.</p>";
        }
    }

    async function adminAction(endpoint, email) {
        const token = getToken();

        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.success) {
                loadUsers();
            } else {
                alert(data.message || "Action failed");
            }

        } catch (err) {
            console.error("Admin action error:", err);
        }
    }

    window.promoteUser = email => adminAction("/api/admin/user/promote", email);
    window.demoteUser = email => adminAction("/api/admin/user/demote", email);
    window.suspendUser = email => adminAction("/api/admin/user/suspend", email);
    window.unsuspendUser = email => adminAction("/api/admin/user/unsuspend", email);
    window.banUser = email => adminAction("/api/admin/user/ban", email);
    window.unbanUser = email => adminAction("/api/admin/user/unban", email);

    // RUN ADMIN LOADER
    loadAdmin();
});
