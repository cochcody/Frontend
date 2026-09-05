document.addEventListener("DOMContentLoaded", () => {
    const stripeBtn = document.getElementById("connectStripeBtn");
    const stripeStatus = document.getElementById("stripeStatus");

    if (!stripeBtn) {
        console.error("Stripe Connect button not found.");
        return;
    }

    stripeBtn.addEventListener("click", async () => {
        stripeStatus.textContent = "Connecting to Stripe...";

        try {
            const res = await fetch("https://codex-backend1.onrender.com/api/dev/stripe/create-account-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await res.json();
            console.log("Stripe response:", data);

            if (data.success && data.url) {
                stripeStatus.textContent = "Redirecting to Stripe...";
                window.location.href = data.url;
            } else {
                stripeStatus.textContent = "Backend error: " + (data.message || "Unknown error");
                console.error("Stripe backend error:", data);
            }
        } catch (err) {
            console.error("Stripe error:", err);
            stripeStatus.textContent = "Error connecting to Stripe.";
        }
    });
});
