const BASE_URL = "https://codex-backend1.onrender.com";

// Require admin before loading page
requireAdmin().then(loadApplications);

// Fetch all developer applications
async function loadApplications() {
    const container = document.getElementById("applications-container");
    container.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch(`${BASE_URL}/api/admin/dev-applications`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });

        const data = await res.json();

        if (!data.applications || data.applications.length === 0) {
            container.innerHTML = "<p>No pending applications.</p>";
            return;
        }

        container.innerHTML = "";

        data.applications.forEach(app => {
            const card = document.createElement("div");
            card.className = "admin-card";

            card.innerHTML = `
                <h3>${app.company}</h3>
                <p><strong>Email:</strong> ${app.email}</p>
                <p><strong>Website:</strong> ${app.website || "N/A"}</p>
                <p><strong>Description:</strong> ${app.description || "No description"}</p>
                <p><strong>Status:</strong> ${app.status}</p>

                <div class="admin-actions">
                    <button class="approve-btn" data-email="${app.email}">Approve</button>
                    <button class="reject-btn" data-email="${app.email}">Reject</button>
                </div>
            `;

            container.appendChild(card);
        });

        attachActionHandlers();

    } catch (err) {
        console.error("Error loading applications:", err);
        container.innerHTML = "<p>Error loading applications.</p>";
    }
}

// Attach approve/reject button handlers
function attachActionHandlers() {
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", () => handleApprove(btn.dataset.email));
    });

    document.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", () => handleReject(btn.dataset.email));
    });
}

// Approve developer
async function handleApprove(email) {
    if (!confirm(`Approve developer: ${email}?`)) return;

    try {
        const res = await fetch(`${BASE_URL}/api/admin/dev-approve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.success) {
            alert("Developer approved!");
            loadApplications();
        } else {
            alert(data.message || "Approval failed.");
        }

    } catch (err) {
        console.error("Approve error:", err);
        alert("Error approving developer.");
    }
}

// Reject developer
async function handleReject(email) {
    if (!confirm(`Reject developer: ${email}?`)) return;

    try {
        const res = await fetch(`${BASE_URL}/api/admin/dev-reject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.success) {
            alert("Developer rejected.");
            loadApplications();
        } else {
            alert(data.message || "Rejection failed.");
        }

    } catch (err) {
        console.error("Reject error:", err);
        alert("Error rejecting developer.");
    }
}
