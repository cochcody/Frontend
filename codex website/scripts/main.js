// ===============================
//  CODE-X FRONTEND AUTH + API
// ===============================

const BASE_URL = "https://codex-backend1.onrender.com";

// -------------------------------
// TOKEN HELPERS
// -------------------------------
function setToken(token) {
    localStorage.setItem("codex_token", token);
}

function getToken() {
    return localStorage.getItem("codex_token");
}

function clearToken() {
    localStorage.removeItem("codex_token");
}

// -------------------------------
// GET CURRENT USER
// -------------------------------
async function getCurrentUser() {
    const token = getToken();
    if (!token) return null;

    try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}

// -------------------------------
// ROLE-AWARE HOME BUTTON
// -------------------------------
async function setupHomeLink() {
    const home = document.getElementById("home-link");
    if (!home) return;

    home.addEventListener("click", async (e) => {
        e.preventDefault();

        const user = await getCurrentUser();

        if (!user) {
            window.location.href = "/index.html";
            return;
        }

        if (user.role === "admin") {
            window.location.href = "/admin/index.html";
        } else if (user.role === "developer") {
            window.location.href = "/dashboard/index.html";
        } else {
            window.location.href = "/index.html";
        }
    });
}

setupHomeLink();

// -------------------------------
// REQUIRE AUTH HELPERS
// -------------------------------
async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) window.location.href = "/login.html";
    return user;
}

async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") window.location.href = "/login.html";
    return user;
}

async function requireDeveloper() {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") window.location.href = "/login.html";
    return user;
}

// -------------------------------
// UPLOAD GAME METADATA
// -------------------------------
async function handleUpload(e) {
    e.preventDefault();
    const form = e.target;
    const token = getToken();

    const formData = new FormData(form);

    try {
        const res = await fetch(`${BASE_URL}/api/dev/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            alert(data.message || "Upload failed.");
            return;
        }

        alert("Game submitted for approval!");
        form.reset();

    } catch (err) {
        console.error("Upload error:", err);
        alert("Something went wrong.");
    }
}

console.log("Code‑X frontend loaded.");
