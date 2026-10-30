(function () {
  const SELECTOR = "[data-announcements]";
  const AUTOPLAY_DELAY = 5000;

  // Bootstrap 5 breakpoints
  const BREAKPOINTS = {
    md: 768,
    lg: 992,
    xl: 1200,
  };

  // ============================================================
  // CURRENT VIEWPORT CAPACITY
  // ============================================================

  function getCapacity() {
    const width = window.innerWidth;

    if (width >= BREAKPOINTS.xl) {
      return 3.2;
    }

    if (width >= BREAKPOINTS.lg) {
      return 3.2;
    }

    if (width >= BREAKPOINTS.md) {
      return 2.2;
    }

    return 1.2;
  }

  // ============================================================
  // ANNOUNCEMENT COMPONENT
  // ============================================================

  function createAnnouncements(component) {
    const swiperEl = component.querySelector(".announcements__swiper");

    if (!swiperEl) return;

    /*
     * IMPORTANT:
     * Only count original slides.
     *
     * We do this before Swiper is initialised so loop duplicates
     * cannot affect the announcement count.
     */
    const count = swiperEl.querySelectorAll(".swiper-wrapper > .swiper-slide").length;

    // No announcements
    if (count === 0) {
      component.hidden = true;
      return;
    }

    // Component manually disabled
    if (component.dataset.enabled === "false") {
      component.hidden = true;
      return;
    }

    component.hidden = false;

    let swiper = null;
    let currentCapacity = null;

    // ==========================================================
    // INITIALISE
    // ==========================================================

    function initialise() {
      const capacity = getCapacity();

      /*
       * Never display more slots than actual announcements.
       *
       * 2 announcements at 2600px:
       * Math.min(2, 4) = 2
       *
       * 5 announcements at 2600px:
       * Math.min(5, 4) = 4
       */
      const slidesPerView = Math.min(count, capacity);

      /*
       * Only rotate if something is currently hidden.
       *
       * 5 announcements / 4 visible = loop
       * 4 announcements / 4 visible = static
       * 2 announcements / 4 capacity = 2 visible, static
       */
      const shouldRotate = count > slidesPerView;

      currentCapacity = capacity;

      swiper = new Swiper(swiperEl, {
        slidesPerView: slidesPerView,

        spaceBetween: 12,

        loop: shouldRotate,

        allowTouchMove: shouldRotate,

        grabCursor: shouldRotate,

        watchOverflow: true,

        speed: 700,

        autoplay: shouldRotate
          ? {
              delay: AUTOPLAY_DELAY,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false,

        a11y: {
          enabled: true,
        },

        /*
         * Don't use Swiper's responsive breakpoints here.
         *
         * We calculate the correct slidesPerView ourselves and
         * rebuild only when a Bootstrap breakpoint is crossed.
         *
         * That keeps loop + slidesPerView in sync.
         */
      });
    }

    // ==========================================================
    // DESTROY
    // ==========================================================

    function destroy() {
      if (!swiper) return;

      swiper.destroy(true, true);
      swiper = null;
    }

    // ==========================================================
    // RESPONSIVE
    // ==========================================================

    function handleResize() {
      const newCapacity = getCapacity();

      /*
       * Ignore ordinary resizing inside the same breakpoint.
       */
      if (newCapacity === currentCapacity) return;

      destroy();
      initialise();
    }

    initialise();

    window.addEventListener("resize", debounce(handleResize, 150));
  }

  // ============================================================
  // DEBOUNCE
  // ============================================================

  function debounce(callback, delay) {
    let timeoutId;

    return function (...args) {
      window.clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  }

  // ============================================================
  // INITIALISE ALL COMPONENTS
  // ============================================================

  function initAnnouncements() {
    const components = document.querySelectorAll(SELECTOR);

    if (!components.length) return;

    components.forEach(createAnnouncements);
  }

  // ============================================================
  // START
  // ============================================================

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnnouncements, { once: true });
  } else {
    initAnnouncements();
  }
})();
