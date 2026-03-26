(function () {
  // =========================
  // COUNT UP
  // =========================
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const duration = parseFloat(el.dataset.duration) || 2;

    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration,
      ease: "power1.out",
      onUpdate: () => {
        el.textContent = Math.floor(obj.value).toLocaleString();
      },
    });
  }

  // =========================
  // INIT COUNTERS (IO)
  // =========================
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);

            // 🔑 run once, then stop observing
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,

        // 🔑 THIS is the magic:
        // triggers BEFORE fully in view (fixes mobile delay)
        rootMargin: "0px 0px -10% 0px",

        threshold: 0,
      },
    );

    counters.forEach((el) => observer.observe(el));
  }

  // =========================
  // INIT
  // =========================
  function init() {
    initCounters();
  }

  // =========================
  // SAFE LOAD
  // =========================
  if (document.readyState === "complete") {
    requestAnimationFrame(init);
  } else {
    window.addEventListener("load", () => {
      requestAnimationFrame(init);
    });
  }
})();
