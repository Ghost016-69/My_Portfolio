/* ==========================================================================
   My Portfolio - main.js
   --------------------------------------------------------------------------
   One dependency-free file shared by every page. Each behaviour looks for its
   own hook element and quietly does nothing when that element is missing, so
   there is no need for per-page scripts.
   ========================================================================== */
(function () {
    "use strict";

    var doc = document;

    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    /* -- 1. Footer year --------------------------------------------------- */
    function stampYear() {
        var slots = doc.querySelectorAll("[data-year]");
        var year = String(new Date().getFullYear());
        Array.prototype.forEach.call(slots, function (slot) {
            slot.textContent = year;
        });
    }

    /* -- 2. Light / dark theme -------------------------------------------- */
    var THEME_KEY = "portfolio-theme";

    function readStoredTheme() {
        try {
            var stored = window.localStorage.getItem(THEME_KEY);
            return stored === "light" || stored === "dark" ? stored : null;
        } catch (error) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            window.localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            /* Private mode: the theme simply will not persist. */
        }
    }

    function currentTheme() {
        return doc.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light";
    }

    function applyTheme(theme) {
        var isDark = theme === "dark";
        doc.documentElement.setAttribute("data-theme", theme);
        Array.prototype.forEach.call(
            doc.querySelectorAll("[data-theme-toggle]"),
            function (button) {
                button.setAttribute("aria-pressed", String(isDark));
                button.setAttribute(
                    "aria-label",
                    isDark ? "Switch to light theme" : "Switch to dark theme"
                );
                var icon = button.querySelector("[data-theme-icon]");
                if (icon) {
                    icon.textContent = isDark ? "\u2600\uFE0F" : "\uD83C\uDF19";
                }
            }
        );
    }

    function initTheme() {
        var toggles = doc.querySelectorAll("[data-theme-toggle]");
        if (!toggles.length) {
            return;
        }
        applyTheme(readStoredTheme() || currentTheme());
        Array.prototype.forEach.call(toggles, function (button) {
            button.addEventListener("click", function () {
                var next = currentTheme() === "dark" ? "light" : "dark";
                applyTheme(next);
                storeTheme(next);
            });
        });
    }
    /* -- 3. Mobile navigation toggle -------------------------------------- */
    function initNavToggle() {
        var toggle = doc.querySelector("[data-nav-toggle]");
        var nav = doc.getElementById("primary-nav");
        if (!toggle || !nav) {
            return;
        }

        function setExpanded(expanded) {
            toggle.setAttribute("aria-expanded", String(expanded));
            nav.classList.toggle("is-open", expanded);
        }

        toggle.addEventListener("click", function () {
            setExpanded(toggle.getAttribute("aria-expanded") !== "true");
        });

        nav.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                setExpanded(false);
            }
        });

        doc.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                setExpanded(false);
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth >= 768) {
                setExpanded(false);
            }
        });
    }

    /* -- 4. Mark the nav link for the page we are on ----------------------- */
    function initActiveLink() {
        var links = doc.querySelectorAll(".primary-nav a[href]");
        if (!links.length) {
            return;
        }
        var here = window.location.pathname.split("/").pop() || "index.html";
        Array.prototype.forEach.call(links, function (link) {
            var target = link.getAttribute("href").split("#")[0].split("/").pop();
            if (target && target === here) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }
        });
    }

    /* -- 5. Back to top ---------------------------------------------------- */
    function initBackToTop() {
        var button = doc.querySelector("[data-back-to-top]");
        if (!button) {
            return;
        }

        button.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? "auto" : "smooth"
            });
        });

        function sync() {
            button.classList.toggle("is-visible", window.scrollY > 420);
        }
        sync();
        window.addEventListener("scroll", sync, { passive: true });
    }
    /* -- 6. In-page PDF viewer -------------------------------------------- */
    function initPdfViewer() {
        var triggers = doc.querySelectorAll("[data-pdf]");
        if (!triggers.length) {
            return;
        }

        var modal = null;
        var lastFocus = null;

        function close() {
            if (!modal) {
                return;
            }
            modal.remove();
            modal = null;
            doc.body.classList.remove("has-modal");
            if (lastFocus) {
                lastFocus.focus();
            }
        }

        function open(trigger) {
            var url = trigger.getAttribute("data-pdf");
            var title = trigger.getAttribute("data-pdf-title") || "Document";
            lastFocus = trigger;

            modal = doc.createElement("div");
            modal.className = "pdf-modal";
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("aria-label", title);

            var bar = doc.createElement("div");
            bar.className = "pdf-modal-bar";

            var heading = doc.createElement("span");
            heading.className = "pdf-modal-title";
            heading.textContent = title;

            var actions = doc.createElement("span");
            actions.className = "pdf-modal-actions";

            var external = doc.createElement("a");
            external.className = "btn btn-ghost btn-sm";
            external.href = url;
            external.target = "_blank";
            external.rel = "noopener";
            external.textContent = "Open in new tab";

            var closeButton = doc.createElement("button");
            closeButton.type = "button";
            closeButton.className = "btn btn-primary btn-sm";
            closeButton.textContent = "Close";
            closeButton.addEventListener("click", close);

            actions.appendChild(external);
            actions.appendChild(closeButton);
            bar.appendChild(heading);
            bar.appendChild(actions);

            var frame = doc.createElement("iframe");
            frame.className = "pdf-modal-frame";
            frame.src = url;
            frame.title = title;

            modal.appendChild(bar);
            modal.appendChild(frame);

            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    close();
                }
            });

            doc.body.appendChild(modal);
            doc.body.classList.add("has-modal");
            closeButton.focus();
        }

        Array.prototype.forEach.call(triggers, function (trigger) {
            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                open(trigger);
            });
        });

        doc.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal) {
                close();
            }
        });
    }
    /* -- 7. Contact form (no back end yet, so it drafts an email) ---------- */
    function initMailtoForm() {
        var form = doc.querySelector("[data-contact-form]");
        if (!form) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var name = (form.elements.name.value || "").trim();
            var email = (form.elements.email.value || "").trim();
            var message = (form.elements.message.value || "").trim();
            var to = form.getAttribute("data-mailto") || "";

            var subject = "Portfolio enquiry from " + (name || "your website");
            var body =
                "Name: " + name + "\n" +
                "Email: " + email + "\n\n" +
                message;

            window.location.href =
                "mailto:" + to +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);

            var status = form.querySelector("[data-form-status]");
            if (status) {
                status.textContent =
                    "Opening your email app to send this to " + to + "...";
            }
        });
    }

    function init() {
        stampYear();
        initTheme();
        initNavToggle();
        initActiveLink();
        initBackToTop();
        initPdfViewer();
        initMailtoForm();
    }

    if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();



