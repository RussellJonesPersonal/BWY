(function () {
  gsap.registerPlugin(ScrollTrigger);

  // Improve rendering smoothness
  gsap.config({
    force3D: true,
  });

  // =========================
  // PARALLAX (MULTIPLE SECTIONS)
  // =========================
  function initParallax() {
    const sections = document.querySelectorAll(".parallax-section");

    sections.forEach((section) => {
      const bg = section.querySelector(".parallax-bg-inner");
      if (!bg) return;

      let tween;

      function buildParallax() {
        if (tween) {
          tween.scrollTrigger.kill();
          tween.kill();
        }

        const sectionHeight = section.offsetHeight;
        const speed = parseFloat(section.dataset.parallax) || 0.12;
        const travel = Math.round(sectionHeight * speed);

        tween = gsap.fromTo(
          bg,
          { y: -travel },
          {
            y: travel,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      buildParallax();

      ScrollTrigger.addEventListener("refreshInit", buildParallax);
    });
  }

  // =========================
  // INIT
  // =========================
  function init() {
    initParallax();
    ScrollTrigger.refresh();
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
