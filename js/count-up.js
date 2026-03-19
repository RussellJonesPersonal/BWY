(function () {
  gsap.registerPlugin(ScrollTrigger);

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
  // INIT COUNTERS
  // =========================
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");

    counters.forEach((el) => {
      let tween;

      ScrollTrigger.create({
        trigger: el,
        start: "top 95%",
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
  // INIT
  // =========================
  function init() {
    initCounters();
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
