// ===============================
//  CODE-X FRONTEND AUTH + API
// ===============================
const BASE_URL = "https://codex-backend1.onrender.com";

// TOKEN HELPERS
function setToken(token) {
    localStorage.setItem("codex_token", token);
}
function getToken() {
    return localStorage.getItem("codex_token");
}
function clearToken() {
    localStorage.removeItem("codex_token");
}

// CURRENT USER
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

// REQUIRE AUTH
async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = "/login.html";
        return null;
    }
    return user;
}

// ROLE-BASED HOME / POST-LOGIN REDIRECT
async function redirectAfterLogin() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    if (user.role === "admin") {
        window.location.href = "/admin/index.html";
    } else if (user.role === "developer") {
        window.location.href = "/dashboard/developer.html";
    } else {
        window.location.href = "/dashboard/user.html";
    }
}

console.log("Code‑X frontend loaded.");

        