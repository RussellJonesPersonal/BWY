(function () {
  gsap.registerPlugin(ScrollTrigger);

  const DEFAULTS = {
    duration: 0.8,
    ease: "power2.out",
    distance: 40,
  };

  function getInitialOffset(type, distance) {
    switch (type) {
      case "fade-up":
        return { y: distance };
      case "fade-down":
        return { y: -distance };
      case "slide-left":
        return { x: distance };
      case "slide-right":
        return { x: -distance };
      case "zoom-in":
        return { scale: 0.9 };
      default:
        return {};
    }
  }

  function initAnimations() {
    console.log("INIT RUNNING");

    const elements = document.querySelectorAll("[data-animate]");

    elements.forEach((el) => {
      const type = el.dataset.animate;
      if (!type) return;

      const delay = parseFloat(el.dataset.delay) || 0;
      const duration = parseFloat(el.dataset.duration) || DEFAULTS.duration;
      const ease = el.dataset.ease || DEFAULTS.ease;
      const stagger = parseFloat(el.dataset.stagger);
      const distance = parseFloat(el.dataset.distance) || DEFAULTS.distance;

      const selector = el.dataset.children;
      let targets;

      try {
        targets = selector ? el.querySelectorAll(selector.trim()) : el.children.length ? Array.from(el.children) : [el];
      } catch (e) {
        console.warn("Invalid selector:", selector);
        return;
      }

      if (!targets || targets.length === 0) return;

      const initial = getInitialOffset(type, distance);

      // GROUP ANIMATION
      if (!isNaN(stagger) && targets.length > 0) {
        gsap.fromTo(
          targets,
          {
            opacity: 0,
            ...initial,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration,
            delay,
            ease,
            stagger,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
              onLeave: (self) => gsap.to(self.animation, { timeScale: 1.5 }),
              onEnterBack: (self) => gsap.to(self.animation, { timeScale: 1 }),
            },
          },
        );
        return;
      }

      // SINGLE ELEMENT
      gsap.fromTo(
        el,
        {
          opacity: 0,
          ...initial,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
            onLeave: (self) => gsap.to(self.animation, { timeScale: 1.5 }),
            onEnterBack: (self) => gsap.to(self.animation, { timeScale: 1 }),
          },
        },
      );
    });
  }

  if (document.readyState === "complete") {
    requestAnimationFrame(() => {
      initAnimations();
      ScrollTrigger.refresh();
    });
  } else {
    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        initAnimations();
        ScrollTrigger.refresh();
      });
    });
  }
})();
