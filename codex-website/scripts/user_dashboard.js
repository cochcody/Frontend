document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireAuth();
    if (!user) return;

    // TODO: fetch user library from backend
    // const res = await fetch(`${BASE_URL}/api/user/library`, { headers: { Authorization: `Bearer ${getToken()}` }});
    // const data = await res.json();
    // render library here
});
