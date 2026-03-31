const BASE_URL = "https://codex-backend1.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireAuth(); // <-- THIS WAS MISSING
    if (!user) return;

    const form = document.getElementById("devApplyForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const payload = {
            company: formData.get("company"),
            website: formData.get("website"),
            description: formData.get("description")
        };

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

            alert("Application submitted successfully!");
            form.reset();

        } catch (err) {
            console.error("Error submitting application:", err);
            alert("Something went wrong.");
        }
    });
});
