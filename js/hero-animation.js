(function () {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const DEFAULTS = {
    duration: isMobile ? 600 : 800,
    distance: isMobile ? 20 : 40,
    stagger: isMobile ? 50 : 80,
    easing: "cubic-bezier(0.2, 0.65, 0.2, 1)",
    threshold: 0.12,
    rootMargin: isMobile ? "0px 0px -8% 0px" : "0px 0px -10% 0px",
  };

  function getInitialStyles(type, distance) {
    switch (type) {
      case "fade-up":
        return {
          opacity: "0",
          transform: `translate3d(0, ${distance}px, 0)`,
        };
      case "fade-down":
        return {
          opacity: "0",
          transform: `translate3d(0, -${distance}px, 0)`,
        };
      case "slide-left":
        return {
          opacity: "0",
          transform: `translate3d(${distance}px, 0, 0)`,
        };
      case "slide-right":
        return {
          opacity: "0",
          transform: `translate3d(-${distance}px, 0, 0)`,
        };
      case "zoom-in":
        return {
          opacity: "0",
          transform: "scale(0.9)",
        };
      default:
        return {
          opacity: "0",
          transform: `translate3d(0, ${distance}px, 0)`,
        };
    }
  }

  function getTargets(el) {
    const selector = el.dataset.children;

    try {
      if (selector) {
        return Array.from(el.querySelectorAll(selector.trim()));
      }

      if (el.children.length) {
        return Array.from(el.children);
      }

      return [el];
    } catch (e) {
      console.warn("Invalid selector:", selector);
      return [];
    }
  }

  function prepareElement(target, initialStyles, duration, delay, easing) {
    target.style.opacity = initialStyles.opacity;
    target.style.transform = initialStyles.transform;
    target.style.transitionProperty = "opacity, transform";
    target.style.transitionDuration = `${duration}ms`;
    target.style.transitionTimingFunction = easing;
    target.style.transitionDelay = `${delay}ms`;
    target.style.willChange = "opacity, transform";
  }

  function revealElement(target) {
    target.style.opacity = "1";
    target.style.transform = "translate3d(0, 0, 0) scale(1)";

    window.setTimeout(() => {
      target.style.willChange = "auto";
    }, 1000);
  }

  function initAnimations() {
    const animatedBlocks = document.querySelectorAll("[data-animate]");
    if (!animatedBlocks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const targets = el._animationTargets || [];
          if (!targets.length) {
            observer.unobserve(el);
            return;
          }

          targets.forEach((target, index) => {
            const delay = Number(target.dataset._computedDelay || 0);
            window.setTimeout(() => revealElement(target), delay);
          });

          observer.unobserve(el);
        });
      },
      {
        threshold: DEFAULTS.threshold,
        rootMargin: DEFAULTS.rootMargin,
      },
    );

    animatedBlocks.forEach((el) => {
      const type = el.dataset.animate;
      if (!type) return;

      const duration = parseFloat(el.dataset.duration) || DEFAULTS.duration / 1000;
      const distance = parseFloat(el.dataset.distance) || DEFAULTS.distance;
      const easing = el.dataset.ease || DEFAULTS.easing;
      const baseDelay = (parseFloat(el.dataset.delay) || 0) * 1000;
      const staggerAttr = el.dataset.stagger;
      const stagger =
        staggerAttr !== undefined && staggerAttr !== "" ? parseFloat(staggerAttr) * 1000 : DEFAULTS.stagger;

      const targets = getTargets(el);
      if (!targets.length) return;

      const initialStyles = getInitialStyles(type, distance);
      const computedDuration = Math.round(duration * 1000);
      const perItemStagger = targets.length > 1 ? Math.max(0, stagger) : 0;

      targets.forEach((target, index) => {
        const computedDelay = baseDelay + index * perItemStagger;
        target.dataset._computedDelay = String(computedDelay);
        prepareElement(target, initialStyles, computedDuration, 0, easing);
      });

      el._animationTargets = targets;
      observer.observe(el);
    });
  }

  function start() {
    initAnimations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
