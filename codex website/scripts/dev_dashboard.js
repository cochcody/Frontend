document.addEventListener("DOMContentLoaded", async () => {
    const user = await requireDeveloper();
    if (!user) return;

    const form = document.getElementById("uploadForm");
    form.addEventListener("submit", handleUpload); // from main.js
});
