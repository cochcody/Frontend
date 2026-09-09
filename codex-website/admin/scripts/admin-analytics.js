const BASE_URL = "https://codex-backend1.onrender.com";

function getAdminToken() {
    return localStorage.getItem("codex_token");
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = getAdminToken();
    const tbody = document.querySelector("#analyticsTable tbody");

    if (!token) {
        tbody.innerHTML = `<tr><td colspan="5">Admin login required.</td></tr>`;
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${data.total_users || 0}</td>
            <td>${data.total_developers || 0}</td>
            <td>${data.total_games || 0}</td>
            <td>${data.total_sales || 0}</td>
            <td>$${((data.total_revenue_cents || 0) / 100).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="5">Error loading analytics.</td></tr>`;
    }
});
