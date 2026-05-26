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
            <p>Status: ${upload.status}</p>
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
