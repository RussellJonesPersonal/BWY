(function () {
  // ======================
  // CUSTOM BREADCRUMB TRAILS
  // ======================
  //
  // Use these on pages that don't themselves appear in the nav,
  // such as individual news articles and events.
  //
  // Example:
  // data-breadcrumb="news-blog"

  const breadcrumbTrails = {
    "news-blog": [
      {
        label: "News & Blog",
        href: "news-blog.html",
      },
    ],

    regions: [
      {
        label: "Regions",
        href: "regions.html",
      },
    ],

    classes: [
      {
        label: "Classes & Events",
        href: "classes-events.html",
      },
      {
        label: "Classes",
        href: "classes.html",
      },
    ],

    events: [
      {
        label: "Classes & Events",
        href: "classes-events.html",
      },
      {
        label: "Events",
        href: "events.html",
      },
    ],
  };

  // ======================
  // LOAD PARTIAL
  // ======================

  async function loadPartial(mount, url, errorLabel) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${errorLabel} request failed: ${response.status}`);
      }

      mount.innerHTML = await response.text();

      return true;
    } catch (error) {
      console.error(`Unable to load ${errorLabel.toLowerCase()}:`, error);

      return false;
    }
  }

  // ======================
  // LOAD NAVIGATION
  // ======================

  async function loadNavigation() {
    const mount = document.querySelector('[data-component="main-nav"]');

    if (!mount) return;

    const currentSection = mount.dataset.section || "";
    const currentPage = mount.dataset.page || "";
    const breadcrumbTrail = mount.dataset.breadcrumb || "";

    const loaded = await loadPartial(mount, "partials/nav.html", "Navigation");

    if (!loaded) return;

    setActiveNavigation(mount, currentSection, currentPage);

    populateBreadcrumb(mount, currentSection, currentPage, breadcrumbTrail);
  }

  // ======================
  // LOAD FOOTER
  // ======================

  async function loadFooter() {
    const mount = document.querySelector('[data-component="site-footer"]');

    if (!mount) return;

    await loadPartial(mount, "partials/footer.html", "Footer");
  }

  // ======================
  // ACTIVE NAVIGATION
  // ======================

  function setActiveNavigation(nav, currentSection, currentPage) {
    // TOP-LEVEL SECTION

    if (currentSection) {
      const section = nav.querySelector(`[data-nav-section="${CSS.escape(currentSection)}"]`);

      if (section) {
        section.classList.add("active");

        const topLevelLink = section.querySelector(":scope > .nav-link");

        if (topLevelLink) {
          topLevelLink.classList.add("active");
        }
      }
    }

    // CURRENT PAGE

    if (currentPage) {
      const page = nav.querySelector(`[data-nav-page="${CSS.escape(currentPage)}"]`);

      if (page) {
        page.classList.add("active");
        page.setAttribute("aria-current", "page");

        const parentSection = page.closest("[data-nav-section]");

        if (parentSection) {
          parentSection.classList.add("active");

          const topLevelLink = parentSection.querySelector(":scope > .nav-link");

          if (topLevelLink) {
            topLevelLink.classList.add("active");
          }
        }
      }
    }
  }

  // ======================
  // BREADCRUMB
  // ======================

  function populateBreadcrumb(nav, currentSection, currentPage, breadcrumbTrail) {
    const breadcrumbMount = document.querySelector('[data-component="breadcrumb"]');

    if (!breadcrumbMount) return;

    // Homepage, 404, etc.
    if (!currentSection && !currentPage && !breadcrumbTrail) {
      breadcrumbMount.hidden = true;
      return;
    }

    // Always begin with Home.
    const items = [
      {
        label: "Home",
        href: "index.html",
      },
    ];

    // ======================
    // CUSTOM TRAIL
    // ======================

    if (breadcrumbTrail && breadcrumbTrails[breadcrumbTrail]) {
      breadcrumbTrails[breadcrumbTrail].forEach(function (item) {
        items.push(item);
      });

      breadcrumbMount.hidden = false;

      renderBreadcrumb(breadcrumbMount, items, true);

      return;
    }

    // ======================
    // NORMAL NAV-BASED TRAIL
    // ======================

    let page = null;

    if (currentPage) {
      page = nav.querySelector(`[data-nav-page="${CSS.escape(currentPage)}"]`);
    }

    let section = null;

    if (currentSection) {
      section = nav.querySelector(`[data-nav-section="${CSS.escape(currentSection)}"]`);
    }

    // Infer section from page if necessary.
    if (!section && page) {
      section = page.closest("[data-nav-section]");
    }

    if (!section) {
      breadcrumbMount.hidden = true;
      return;
    }

    const sectionLink = section.querySelector(":scope > .nav-link");

    if (!sectionLink) {
      breadcrumbMount.hidden = true;
      return;
    }

    items.push({
      label: getCleanText(sectionLink),
      href: null,
    });

    breadcrumbMount.hidden = false;

    renderBreadcrumb(breadcrumbMount, items, false);
  }

  // ======================
  // RENDER BREADCRUMB
  // ======================

  function renderBreadcrumb(mount, items, linkLastItem) {
    const list = document.createElement("ol");

    list.className = "breadcrumb";

    items.forEach(function (item, index) {
      const li = document.createElement("li");

      li.className = "breadcrumb-item";

      const isLast = index === items.length - 1;

      // Normal breadcrumb:
      // final item represents the current section,
      // so isn't a link.

      if (isLast && !linkLastItem) {
        li.classList.add("active");
        li.setAttribute("aria-current", "page");
        li.textContent = item.label;
      }

      // Linked breadcrumb item.
      else if (item.href) {
        const link = document.createElement("a");

        link.href = item.href;
        link.textContent = item.label;

        li.appendChild(link);
      }

      // Fallback.
      else {
        li.textContent = item.label;
      }

      list.appendChild(li);
    });

    mount.replaceChildren(list);
  }

  // ======================
  // CLEAN TEXT
  // ======================

  function getCleanText(element) {
    return element.textContent.replace(/\s+/g, " ").trim();
  }

  // ======================
  // PAGE READY
  // ======================

  function revealPage() {
    document.documentElement.classList.remove("page-loading");
  }

  // ======================
  // START
  // ======================

  async function start() {
    try {
      await Promise.all([loadNavigation(), loadFooter()]);
    } catch (error) {
      console.error("Unable to initialise page partials:", error);
    } finally {
      revealPage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true,
    });
  } else {
    start();
  }
})();
