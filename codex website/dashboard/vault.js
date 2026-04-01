console.log("vault.js loaded");

// Optional: clean URL if it has ?company=...
if (window.location.search) {
    history.replaceState({}, document.title, "/dashboard/vault.html");
}

document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireAuth();
    if (!user) return;

    const form = document.getElementById("vaultForm");
    if (!form) {
        console.error("Developer app error: form not found");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("SUBMIT FIRED");

        const formData = new FormData(form);
        const payload = {
            company: formData.get("company"),
            website: formData.get("website"),
            description: formData.get("description")
        };

        if (!payload.company.trim() || !payload.description.trim()) {
            alert("Company and description are required.");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/dev/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Application failed.");
                return;
            }

            alert("Application submitted successfully! We'll email you when it's reviewed.");
            form.reset();
        } catch (err) {
            console.error("Error submitting application:", err);
            alert("Something went wrong.");
        }
    });
});
