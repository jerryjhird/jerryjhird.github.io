# **24th February 2026 UTC**
---
# Building the website
⠀
coming into this i despied javascript and i still do because well there is a runtime BUT i think its an okay fit for web development i actually had fun writing it which is more than i can say for other languages (python, c++, rust)

⠀
## Modular and reusable code across multiple html files
---

When making reusable code you dont want to copy paste the same HTML and scripts everywhere instead i opted for **loader functions**:

- **`loadJS(src)`**
- **`loadCSS(src)`**
- **`loadComponent(htmlSrc, jsSrc, containerId)`**
⠀
loadJS and loadCSS have been in this codebase for a while and there purpose is to allow me to load css and js depending on runtime variables for example this was used in the theme loader so if you have the url parameter `?theme=Christmas` it would check an object for the theme "Christmas" and load the corresponding javascript and css files

⠀
as for loadComponent its fairly new at the time im writing this and is used for loading html and js pairs into a page, specifically used for loading the settings button in the bottom right corner of your screen

⠀
if you entered an incorrect theme name if would default to Default, and themes change depending on the month, so in febuary it would be Valentines in october it would be Halloween and etc but if the month dosent have a specific thene it would again default to Default
⠀

```js
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
```
