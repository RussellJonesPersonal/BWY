(function () {
  gsap.config({
    force3D: true,
  });

  function initParallax() {
    const sections = document.querySelectorAll(".parallax-section");

    const items = [];

    sections.forEach((section) => {
      const bg = section.querySelector(".parallax-bg-inner");
      if (!bg) return;

      const baseSpeed = parseFloat(section.dataset.parallax) || 0.15;

      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const speed = isMobile ? baseSpeed : baseSpeed * 2;

      items.push({
        section,
        bg,
        speed,
      });
    });

    function update() {
      const viewportHeight = window.innerHeight;

      items.forEach(({ section, bg, speed }) => {
        const rect = section.getBoundingClientRect();

        // Progress through viewport
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);

        // Clamp 0–1
        const clamped = Math.max(0, Math.min(1, progress));

        // ✅ Eased movement (premium feel)
        const eased = Math.sin((clamped - 0.5) * Math.PI);

        const maxTravel = section.offsetHeight * speed;

        const y = eased * maxTravel;

        gsap.set(bg, { y });
      });
    }

    function rafLoop() {
      update();
      requestAnimationFrame(rafLoop);
    }

    rafLoop();
  }

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      initParallax();
    });
  });

  window.addEventListener("resize", () => {
    // Values recalc automatically each frame
  });
})();
