// =======================================
//  CODE‑X DEVELOPER APPLICATION PAGE
// =======================================

const BASE_URL = "https://codex-backend1.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {

    // Make sure user is logged in before anything else
    const user = await requireAuth();
    if (!user) return;

    // Get the form
    const form = document.getElementById("devApplyForm");
    if (!form) {
        console.error("Developer application form not found.");
        return;
    }

    // Handle submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const payload = {
            company: formData.get("company"),
            website: formData.get("website"),
            description: formData.get("description")
        };

        // Basic validation
        if (!payload.company || payload.company.trim() === "") {
            alert("Company name is required.");
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

            alert("Application submitted successfully!");
            form.reset();

        } catch (err) {
            console.error("Error submitting application:", err);
            alert("Something went wrong.");
        }
    });
});
