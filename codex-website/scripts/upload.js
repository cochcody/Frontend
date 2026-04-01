// ===============================
//  DEVELOPER UPLOAD HANDLER
// ===============================

// Make handleUpload GLOBAL
async function handleUpload(e) {
    e.preventDefault();

    const form = document.getElementById("uploadForm");
    const formData = new FormData(form);

    const token = getToken();
    if (!token) {
        alert("You are not logged in.");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/dev/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            alert(data.message || "Upload failed.");
            return;
        }

        alert("Build uploaded successfully!");
        form.reset();

    } catch (err) {
        console.error("Upload error:", err);
        alert("Something went wrong during upload.");
    }
}

// DOMContentLoaded only for attaching listeners
document.addEventListener("DOMContentLoaded", async () => {
    await requireDeveloper();

    const form = document.getElementById("uploadForm");
    if (form) {
        form.addEventListener("submit", handleUpload);
    }
});
