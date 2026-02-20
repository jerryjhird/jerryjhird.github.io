document.addEventListener("DOMContentLoaded", () => {
    const head = document.head;

    function loadCSS(href) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        head.appendChild(link);
        console.log("[stylesheet] dynamically loaded:", href);
    }

    function loadJS(src) {
        const script = document.createElement("script");
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
        console.log("[script] dynamically loaded:", src);
    }

    const THEMES = {
        Default: {
            css: "styles/theme-Default.css",
            js: ""
        },
        Valentines: {
            css: "styles/theme-Valentines.css",
            js: "scripts/theme-Valentines.js"
        },
        Christmas: {
            css: "styles/theme-Christmas.css",
            js: "scripts/theme-Christmas.js"
        }
    };

    function updateThemeLabel(name) {
        const themeNameEl = document.getElementById("theme-name");
        if (themeNameEl) themeNameEl.textContent = name;
    }

    window.LoadTheme = function(name, options = {}) {
        const { noJS = false } = options;

        const theme = THEMES[name];
        if (!theme) {
            console.warn("Invalid theme:", name);
            return false;
        }

        loadCSS(theme.css);

        if (!noJS && theme.js) {
            loadJS("scripts/shared-code.js");
            loadJS(theme.js);
        }

        window.currentTheme = name;
        updateThemeLabel(name);
        return true;
    };

    function switchTheme(name) {
        const url = new URL(window.location.href);
        url.searchParams.set("theme", name);
        window.location.href = url.toString();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const rawThemeParam = urlParams.get("theme")?.trim(); // remove whitespace
    const noJS = urlParams.has("nojs");

    if (rawThemeParam) { // normalize first char uppercase rest lowercase
        const normalized = rawThemeParam.charAt(0).toUpperCase() + rawThemeParam.slice(1).toLowerCase();
        const success = LoadTheme(normalized, { noJS });

        if (!success) { // fallback to Default
            LoadTheme("Default", { noJS });
        }
    } else { // seasonal fallback
        const month = new Date().getMonth() + 1;

        if (month === 2) {
            LoadTheme("Valentines", { noJS });
        } else if (month === 12) {
            LoadTheme("Christmas", { noJS });
        } else {
            LoadTheme("Default", { noJS });
        }
    }

    const themeNameEl = document.getElementById("theme-name");
    const themeDropdown = document.getElementById("theme-dropdown");

    Object.keys(THEMES).forEach(theme => {
        const li = document.createElement("li");
        li.textContent = theme;
        li.addEventListener("click", () => {
            switchTheme(theme);
        });
        themeDropdown.appendChild(li);
    });

    themeNameEl.addEventListener("click", (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle("hidden");

        if (!themeDropdown.classList.contains("hidden")) {
            themeDropdown.style.position = "fixed";
            themeDropdown.style.top = `${e.clientY}px`;
            themeDropdown.style.left = `${e.clientX}px`;
            themeDropdown.style.zIndex = 1000;
        }
    });
    document.addEventListener("click", () => {
        themeDropdown.classList.add("hidden");
    });

});