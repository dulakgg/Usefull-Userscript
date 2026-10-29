// ==UserScript==
// @name         Better Librus
// @namespace    Violentmonkey Scripts
// @icon         https://portal.librus.pl/images/icon.png
// @version      1.1.0
// @match        https://librus.pl/*
// @match        https://*.librus.pl/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

let hideAdsEnabled = GM_getValue("hideAdsEnabled", true);
let redirectToLogin = GM_getValue("redirectToLogin", true);
let darkMode = GM_getValue("darkMode", true);

const loginUrl = "https://portal.librus.pl/rodzina/synergia/loguj";

GM_registerMenuCommand("Toggle login redirect", () => {
    redirectToLogin = !redirectToLogin;
    GM_setValue("redirectToLogin", redirectToLogin); // Save state
    console.log("Login redirect:", redirectToLogin ? "ON" : "OFF");
});

if (redirectToLogin && window.location.pathname === "/rodzina") {
    window.location.replace(loginUrl);
}

const originalVisibility = new WeakMap();

const hideAds = () => {
    document.querySelectorAll([
        ".synergia__advertisment--top-container",
        ".synergia__advertisment--side-container-left",
        ".synergia__advertisment--side-container-right",
        ".article-list",
        ".widget-container",
        "picture",
        '[style*="height: 10px"][style*="position: relative"]',
        ".skin-addon-footer"
    ].join(", ")).forEach(element => {
        if (!originalVisibility.has(element)) {
            originalVisibility.set(element, element.style.visibility);
        }

        element.style.visibility = hideAdsEnabled
            ? "hidden"
            : originalVisibility.get(element);
    });
};

GM_registerMenuCommand("Toggle ad hiding", () => {
    hideAdsEnabled = !hideAdsEnabled;
    GM_setValue("hideAdsEnabled", hideAdsEnabled); // Save state
    hideAds();
});

hideAds();

const observer = new MutationObserver(hideAds);

observer.observe(document.body, {
    childList: true,
    subtree: true
});

(function() {
    'use strict';

    let themeStyle = null;

    const discordThemeCSS = `
        :root {
            --discord-bg-primary: #313338;
            --discord-bg-secondary: #2b2d31;
            --discord-bg-tertiary: #1e1f22;
            --discord-bg-floating: #232428;
            --discord-text-normal: #dbdee1;
            --discord-text-muted: #949ba4;
            --discord-text-link: #00a8fc;
            --discord-blurple: #5865f2;
            --discord-blurple-hover: #4752c4;
            --discord-border: #3f4147;
            --discord-table-header: #111214;
            --discord-table-row-alt: #2e3035;
            --discord-table-row-hover: #35373c;
        }

        /* Main Body & Backgrounds */
        body, #page, .container-background, #body, #viewTitle, .title, .footer {
            background-color: var(--discord-bg-primary) !important;
            color: var(--discord-text-normal) !important;
        }

        .synergia__advertisment--content-wrapper {
            items-align: center !important;
            justify-content: center !important;
        }
        .luckyNumber {
            color: black;
        }

        .container-background {
            border: 1px solid var(--discord-border) !important;
            box-shadow: none !important;
            background-color: var(--discord-bg-secondary) !important;
        }

        /* Headers, Navigation, and Banners */
        #header, #main-navigation-container, #top-banner-container, #user-section {
            background-color: var(--discord-bg-tertiary) !important;
            color: var(--discord-text-normal) !important;
            border-color: var(--discord-border) !important;
            background-image: none !important;
        }
        
        #page #header #top-banner-container, 
        #page.systema #header #top-banner-container, 
        #top-banner {
            background-image: none !important;
            margin: 15px auto !important;
        }
        
        #main-menu ul li a, #graphic-menu ul li a {
            color: var(--discord-text-normal) !important;
        }

        #page #header #top-banner-container #graphic-menu ul li a .circle {
            background-color: var(--discord-bg-secondary) !important;
            border: 1px solid var(--discord-border) !important;
        }

        /* Links */
        a {
            color: var(--discord-text-link) !important;
        }

        /* Message & Data Table Links */
        table.decorated td a, table.decorated th a,
        .message-folders a, .message-labels a, td.message-folders, .message-labels b {
            color: var(--discord-text-normal) !important;
        }

        /* Tables & Filters */
        table.decorated td, table.decorated th, table.filters td, table.filters th {
            background-color: var(--discord-bg-secondary) !important;
            color: var(--discord-text-normal) !important;
            border: 1px solid var(--discord-border) !important;
        }

        table.decorated thead th {
            background-color: var(--discord-table-header) !important;
            color: var(--discord-text-muted) !important;
            text-transform: uppercase !important;
            font-size: 0.75rem !important;
            letter-spacing: 0.02em !important;
        }
        
        /* Alternating row colors */
        table.decorated tr:nth-child(even) td {
            background-color: var(--discord-table-row-alt) !important;
        }

        table.decorated tr:hover td {
            background-color: var(--discord-table-row-hover) !important;
        }

        /* Lesson Boxes (Attendance) */
        .box {
            background-color: var(--discord-bg-tertiary) !important;
            color: var(--discord-text-normal) !important;
            border: 1px solid var(--discord-border) !important;
        }

        /* Forms, Inputs, and Selects */
        select, input[type="text"], input[type="password"], textarea {
            background-color: var(--discord-bg-tertiary) !important;
            color: var(--discord-text-normal) !important;
            border: 1px solid var(--discord-border) !important;
            border-radius: 4px !important;
            padding: 6px 8px !important;
        }

        select:focus, input[type="text"]:focus, input[type="password"]:focus, textarea:focus {
            border-color: var(--discord-blurple) !important;
            outline: none !important;
        }

        /* Buttons & Fold Controls (Discord Blurple) */
        .button, .fold-start, .fold-end, input[type="submit"], input[type="button"], a.button {
            color: #ffffff !important;
            border: none !important;
            border-radius: 4px !important;
            font-weight: 500 !important;
            transition: background-color 0.17s ease !important;
        }

        .button:hover, .fold-start:hover, .fold-end:hover, input[type="submit"]:hover, input[type="button"]:hover, a.button:hover {
            background-color: var(--discord-blurple-hover) !important;
        }

        a.button.blue, a.button.blue span {
            color: #ffffff !important;
        }

        /* Popups, Cards & Tooltips */
        .yellowCard, .titleYellowCard, .cardBody, .yellowCard .content {
            background-color: var(--discord-bg-secondary) !important;
            color: var(--discord-text-normal) !important;
            border: 1px solid var(--discord-border) !important;
        }
        
        /* Headings & Containers */
        h1, h2, h3, h4, h5, .inside {
            color: #ffffff !important;
        }

        .container h2.inside {
            background-color: var(--discord-bg-secondary) !important;
            border-bottom: 1px solid var(--discord-border) !important;
        }

        .ListaWyboru, #language, #tydzien {
            height: 32px !important;
        }

        .btn-navbar, .app-download__btn, .dropdown-item--synergia {
            color: #fff !important;
        }
    `;

    const toggleTheme = () => {
        if (darkMode) {
            if (!themeStyle) {
                themeStyle = GM_addStyle(discordThemeCSS);
            }
        } else if (themeStyle) {
            themeStyle.remove();
            themeStyle = null;
        }
    };

    GM_registerMenuCommand("Toggle dark mode", () => {
        darkMode = !darkMode;
        GM_setValue("darkMode", darkMode);
        toggleTheme();
    });

    toggleTheme();
})();