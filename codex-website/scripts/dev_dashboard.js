document.getElementById("connectStripeBtn").addEventListener("click", async () => {
    const token = getToken();
    if (!token) {
        alert("You must be logged in.");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/dev/stripe/create-account-link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: "{}"
        });

        const data = await res.json();
        console.log("Stripe response:", data);

        if (data.success && data.url) {
            window.location.href = data.url;  // redirect to Stripe onboarding
        } else {
            alert("Stripe error: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        console.error(err);
        alert("Network error contacting Stripe.");
    }
});
