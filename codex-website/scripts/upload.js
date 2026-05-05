// ===============================
//  DEVELOPER ACCESS CHECK
// ===============================
async function requireDeveloper() {
    const user = JSON.parse(localStorage.getItem("user"));

    // No user stored at all
    if (!user) {
        alert("You must be logged in.");
        window.location.href = "/dashboard/index.html";
        return;
    }

    // No role or wrong role
    if (!user.role || user.role !== "developer") {
        alert("Developer access required.");
        window.location.href = "/dashboard/index.html";
        return;
    }

    // All good
    return true;
}



// ===============================
//  DEVELOPER UPLOAD HANDLER
// ===============================
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

        let data;
        try {
            data = await res.json();
        } catch (jsonErr) {
            console.error("JSON parse error:", jsonErr);
            alert("Server returned invalid response.");
            return;
        }

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



// ===============================
//  ATTACH LISTENERS
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    await requireDeveloper();  // now this function exists

    const form = document.getElementById("uploadForm");
    if (form) {
        form.addEventListener("submit", handleUpload);
    }
});

