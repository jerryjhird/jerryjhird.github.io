(function() {
    const toggleBtn = document.getElementById("settings-toggle");
    const panel = document.getElementById("settings-panel");
    const checkbox = document.getElementById("settings-syntaxhighlighting");

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener("click", () => {
        panel.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
        if (!document.getElementById("settings-wrapper").contains(e.target)) {
            panel.classList.remove("open");
        }
    });

    if (checkbox) {
        checkbox.checked = localStorage.getItem("mdtml.experimental.SyntaxHighlighting") === "true";

        checkbox.addEventListener("change", () => {
            localStorage.setItem("mdtml.experimental.SyntaxHighlighting", checkbox.checked);
            location.reload();
        });
    }
})();