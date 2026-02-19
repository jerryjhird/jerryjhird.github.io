document.addEventListener("DOMContentLoaded", () => {
    const head = document.head;

    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        head.appendChild(link);
        console.log("[stylesheet] dynamicly loaded:", href);
    }

    function loadJS(src) {
        const script = document.createElement("script");
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
        console.log("[script] dynamicly loaded:", src);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const forceStyle = urlParams.get('forcestyle');
    const forceJS = urlParams.get('forcejs');
    const noJS = urlParams.has('nojs');

    let themeName = '';
    let seasonalCSS = '';
    let seasonalJS = '';

    if (forceStyle) {
        loadCSS(forceStyle);
        if (forceJS) {
            loadJS('styles/shared-code.js');
            loadJS(forceJS)
        }
        themeName = forceStyle
            .split('/')
            .pop()
            .replace('.css', '')
            .replace(/^theme-/, ''); // remove "theme-" prefix
    } else {
        const month = new Date().getMonth() + 1;
        let seasonalCSS = '';

        switch(month) {
            case 2:
                seasonalCSS = 'styles/theme-Valentines.css';
                seasonalJS = 'styles/theme-Valentines.js';
                themeName = 'Valentines';
                break;

            // case 10: // halloween is planned

            case 12:
                seasonalCSS = 'styles/theme-Christmas.css';
                seasonalJS = '';
                themeName = 'Christmas';
                break;

            default:
                seasonalCSS = 'styles/theme-Default.css';
                seasonalJS = '';
                themeName = 'Default';
        }

        loadCSS(seasonalCSS);
        if (!noJS && seasonalJS) {
            loadJS('styles/shared-code.js');
            loadJS(seasonalJS);
        }
    }

    const header = document.querySelector("header");
    if (header) {
        const themeEl = document.createElement("p");
        themeEl.className = "text-gray-400 text-lg";
        themeEl.textContent = `theme: ${themeName}`;
        header.appendChild(themeEl);
    }

    window.currentTheme = themeName;
});
