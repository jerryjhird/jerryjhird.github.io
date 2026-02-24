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
    document.head.appendChild(script);
    console.log("[script] dynamically loaded:", src);
}

function loadHTML(src, id) {
    const element = document.getElementById(id);
    if (!element) return;

    fetch(src)
        .then(res => res.text())
        .then(html => {
            element.innerHTML = html;

            element.querySelectorAll("script").forEach(oldScript => {
                const script = document.createElement("script");
                script.textContent = oldScript.textContent;
                document.body.appendChild(script);
                oldScript.remove();
            });

            console.log("[html] dynamically loaded:", src);
        })
        .catch(err => console.error(err));
}

function loadComponent(htmlSrc, jsSrc, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(htmlSrc)
        .then(res => {
            if (!res.ok) throw new Error("failed to load HTML");
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;
            console.log(`[component] HTML loaded: ${htmlSrc}`);

            if (jsSrc) {
                const script = document.createElement("script");
                script.src = jsSrc;
                script.defer = true;
                script.onload = () => console.log(`[component] JS loaded: ${jsSrc}`);
                script.onerror = () => console.error(`[component] failed to load JS: ${jsSrc}`);
                document.body.appendChild(script);
            }
        })
        .catch(err => console.error(`[component] error loading HTML: ${err}`));
}

window.loadCSS = loadCSS;
window.loadJS = loadJS;
window.loadHTML = loadHTML;
window.loadComponent = loadComponent;

document.addEventListener("DOMContentLoaded", () => {
    const link = document.getElementById("dynlink");
    if (link) { // dynlink stuff
        const currentParams = new URLSearchParams(window.location.search);
        const url = new URL(link.href, window.location.origin);
        const hrefParams = new URLSearchParams(url.search);

        for (const [key, value] of currentParams.entries()) {
            if (!hrefParams.has(key)) {
                hrefParams.set(key, value);
            }
        }

        url.search = hrefParams.toString();
        link.href = url.toString();
    }

    // load settings
    const settingsContainer = document.getElementById("settings-c");
    if (settingsContainer) {
        loadComponent(
            "components/settings.html",
            "components/settings.js",
            "settings-c"
        );
    }

    // theme loading
    const THEMES = {
        Default: {
            css: "styles/theme-Default.css",
            js: ""
        },
        Valentines: {
            css: "styles/theme-Valentines.css",
            js: "scripts/theme-Valentines.js"
        },
        Halloween: {
            css: "styles/theme-Halloween.css",
            js: "scripts/theme-Halloween.js"
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

    if (rawThemeParam) { // normalize first char uppercase, rest lowercase
        const normalized = rawThemeParam.charAt(0).toUpperCase() + rawThemeParam.slice(1).toLowerCase();
        const success = LoadTheme(normalized, { noJS });

        if (!success) { // fallback to Default
            LoadTheme("Default", { noJS });
        }
    } else { // seasonal fallback
        const month = new Date().getMonth() + 1;

        if (month === 2) {
            LoadTheme("Valentines", { noJS });
        } else if (month === 10) {
            LoadTheme("Halloween", { noJS});
        } else if (month === 12) {
            LoadTheme("Christmas", { noJS });
        } else {
            LoadTheme("Default", { noJS });
        }
    }

    const themeNameEl = document.getElementById("theme-name");
    const themeDropdown = document.getElementById("theme-dropdown");

    if (themeNameEl && themeDropdown) {
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
    }
});