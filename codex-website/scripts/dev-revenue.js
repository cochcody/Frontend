const BASE_URL = "https://codex-backend1.onrender.com";

function getToken() {
    return localStorage.getItem("codex_token");
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    const tbody = document.querySelector("#payoutTable tbody");
    const summary = document.getElementById("payoutSummary");

    if (!token) {
        tbody.innerHTML = `<tr><td colspan="6">Please sign in as a developer.</td></tr>`;
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/dev/payouts`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="6">${data.message || "Could not load payouts."}</td></tr>`;
            return;
        }

        const payouts = data.payouts || [];
        if (!payouts.length) {
            tbody.innerHTML = `<tr><td colspan="6">No payouts recorded yet.</td></tr>`;
            return;
        }

        let totalDevCents = 0;

        payouts.forEach(p => {
            totalDevCents += p.developer_amount_cents || 0;
            const tr = document.createElement("tr");
            const dt = new Date((p.timestamp || 0) * 1000);

            tr.innerHTML = `
                <td>${p.game_id || ""}</td>
                <td>${p.buyer_email || ""}</td>
                <td>$${((p.amount_total_cents || 0) / 100).toFixed(2)}</td>
                <td>$${((p.platform_fee_cents || 0) / 100).toFixed(2)}</td>
                <td>$${((p.developer_amount_cents || 0) / 100).toFixed(2)}</td>
                <td>${dt.toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });

        summary.textContent = `Total developer earnings: $${(totalDevCents / 100).toFixed(2)}`;
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="6">Error loading payouts.</td></tr>`;
    }
});
