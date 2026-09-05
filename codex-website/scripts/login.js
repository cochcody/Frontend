document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    // If the form doesn't exist, stop immediately
    if (!form) {
        console.error("loginForm not found on this page.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Safely read fields
        const emailField = form.querySelector("[name='email']");
        const gamertagField = form.querySelector("[name='gamertag']");
        const passwordField = form.querySelector("[name='password']");

        if (!emailField || !gamertagField || !passwordField) {
            alert("Login form is missing required fields.");
            console.error("Missing fields:", { emailField, gamertagField, passwordField });
            return;
        }

        const email = emailField.value.trim();
        const gamertag = gamertagField.value.trim();
        const password = passwordField.value.trim();

        if (!email || !gamertag || !password) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, gamertag, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Login failed.");
                return;
            }

            // Save token
            setToken(data.token);

            // Fetch user info
            const user = await getCurrentUser();
            if (!user) {
                alert("Could not load user info.");
                return;
            }

            // Save user + gamertag
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("gamertag", user.gamertag);

            // Redirect based on role
            if (user.role === "admin") {
                window.location.href = "/admin/index.html";
            } else if (user.role === "developer") {
                window.location.href = "/dashboard/index.html";
            } else {
                window.location.href = "/dashboard/user.html";
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    });
});
