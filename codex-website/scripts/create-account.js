document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createAccountForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // FIXED: username → gamertag
        const email = form.email.value.trim();
        const gamertag = form.gamertag.value.trim();
        const password = form.password.value.trim();

        if (!email || !gamertag || !password) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/auth/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, gamertag, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Account creation failed.");
                return;
            }

            alert("Account created! Please log in.");
            window.location.href = "/login.html";

        } catch (err) {
            console.error("Register error:", err);
            alert("Something went wrong.");
        }
    });
});
