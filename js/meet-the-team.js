document.addEventListener("DOMContentLoaded", () => {
  const grids = document.querySelectorAll(".team-grid");
  const cards = document.querySelectorAll(".team-card");

  let currentBio = null;
  let requestId = 0;

  // ======================
  // ROW DETECTION
  // ======================

  function getRows(grid) {
    const gridCards = Array.from(grid.querySelectorAll(".team-card"));
    const rows = [];

    gridCards.forEach((card) => {
      const top = card.offsetTop;
      let row = rows.find((item) => Math.abs(item.top - top) < 5);

      if (!row) {
        row = { top, cards: [] };
        rows.push(row);
      }

      row.cards.push(card);
    });

    return rows.sort((a, b) => a.top - b.top);
  }

  // ======================
  // ACCESSIBILITY
  // ======================

  cards.forEach((card) => {
    const name = card.querySelector(".team-card__name")?.textContent.trim() || "team member";

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Read more about ${name}`);
    card.setAttribute("aria-expanded", "false");
    card.removeAttribute("aria-controls");
  });

  // ======================
  // HEIGHT ANIMATION
  // ======================

  function transitionHeight(element, targetHeight) {
    return new Promise((resolve) => {
      let finished = false;
      let fallback;

      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(fallback);
        element.removeEventListener("transitionend", onTransitionEnd);
        resolve();
      };

      const onTransitionEnd = (event) => {
        if (event.target === element && event.propertyName === "height") finish();
      };

      element.addEventListener("transitionend", onTransitionEnd);
      fallback = setTimeout(finish, 550);

      requestAnimationFrame(() => {
        element.style.height = `${targetHeight}px`;
      });
    });
  }

  // ======================
  // CLOSE CURRENT BIO
  // ======================

  async function closeBio() {
    if (!currentBio) return;

    const closing = currentBio;
    const { element, card } = closing;
    currentBio = null;

    card.setAttribute("aria-expanded", "false");
    card.removeAttribute("aria-controls");

    element.style.height = `${element.getBoundingClientRect().height}px`;
    element.offsetHeight; // Commit the starting height.
    await transitionHeight(element, 0);
    element.remove();
  }

  // ======================
  // INSERT BIO AFTER ITS CARD ROW
  // ======================

  function insertBio(card) {
    const grid = card.closest(".team-grid");
    const template = card.querySelector(".team-card__bio");
    if (!grid || !template) return;

    const row = getRows(grid).find((item) => item.cards.includes(card));
    if (!row) return;

    const lastCardInRow = row.cards[row.cards.length - 1];
    const bio = document.createElement("div");
    const bioId = `team-bio-${crypto.randomUUID()}`;

    bio.className = "team-bio";
    bio.id = bioId;
    bio.style.height = "0px";

    const inner = document.createElement("div");
    inner.className = "team-bio__inner";
    inner.appendChild(template.content.cloneNode(true));

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "team-bio__close";
    closeButton.setAttribute("aria-label", "Close biography");
    closeButton.innerHTML = '<i class="iconify" data-icon="mdi:close" aria-hidden="true"></i>';
    inner.appendChild(closeButton);
    bio.appendChild(inner);

    lastCardInRow.insertAdjacentElement("afterend", bio);

    card.setAttribute("aria-expanded", "true");
    card.setAttribute("aria-controls", bioId);
    currentBio = { element: bio, card, grid };

    closeButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      requestId += 1;
      await closeBio();
      card.focus({ preventScroll: true });
    });

    transitionHeight(bio, inner.scrollHeight).then(() => {
      if (currentBio?.element === bio) bio.style.height = "auto";
    });
  }

  // ======================
  // OPEN / TOGGLE BIO
  // ======================

  async function openBio(card) {
    const thisRequest = ++requestId;

    if (currentBio?.card === card) {
      await closeBio();
      return;
    }

    await closeBio();
    if (thisRequest !== requestId) return;

    insertBio(card);
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ======================
  // WHOLE CARD INTERACTION — ALL SCREEN SIZES
  // ======================

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openBio(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openBio(card);
    });
  });

  // ======================
  // REPOSITION OPEN BIO ON RESIZE
  // ======================

  function repositionCurrentBio() {
    if (!currentBio) return;

    const { element, card, grid } = currentBio;
    const row = getRows(grid).find((item) => item.cards.includes(card));
    if (!row) return;

    const lastCardInRow = row.cards[row.cards.length - 1];
    lastCardInRow.insertAdjacentElement("afterend", element);

    const inner = element.querySelector(".team-bio__inner");
    if (inner) element.style.height = "auto";
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(repositionCurrentBio, 100);
  });

  // Escape closes the expanded biography.
  document.addEventListener("keydown", async (event) => {
    if (event.key !== "Escape" || !currentBio) return;
    const card = currentBio.card;
    requestId += 1;
    await closeBio();
    card.focus({ preventScroll: true });
  });
});
