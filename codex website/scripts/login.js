document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.email.value.trim();
        const password = form.password.value.trim();

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Login failed.");
                return;
            }

            // Save token
            setToken(data.token);

            // Fetch user info from backend
            const user = await getCurrentUser();
            if (!user) {
                alert("Could not load user info.");
                return;
            }

            // ⭐ CRITICAL FIX ⭐
            // Save user object so requireAdmin() works
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on role
            if (user.role === "admin") {
                window.location.href = "/admin/index.html";
            }
            else if (user.role === "developer") {
                window.location.href = "/dashboard/index.html";
            }
            else {
                window.location.href = "/dashboard/user.html";
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    });
});
