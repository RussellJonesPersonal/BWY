(function () {
  gsap.registerPlugin(ScrollTrigger);

  // Improve rendering smoothness
  gsap.config({
    force3D: true,
  });

  // =========================
  // COUNT UP
  // =========================
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const duration = parseFloat(el.dataset.duration) || 2;

    const obj = { value: 0 };

    const tween = gsap.to(obj, {
      value: target,
      duration,
      ease: "power1.out",
      onUpdate: () => {
        el.textContent = Math.floor(obj.value).toLocaleString();
      },
    });

    return tween;
  }

  // =========================
  // INIT COUNTERS ON VIEW (RESET ENABLED)
  // =========================
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");

    counters.forEach((el) => {
      let tween;

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "bottom top",

        onEnter: () => {
          tween = animateCount(el);
        },

        onLeave: () => {
          if (tween) tween.kill();
          el.textContent = "0";
        },

        onEnterBack: () => {
          tween = animateCount(el);
        },

        onLeaveBack: () => {
          if (tween) tween.kill();
          el.textContent = "0";
        },
      });
    });
  }

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
    initCounters();
    initParallax();

    // Ensure everything is measured correctly AFTER layout settles
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
