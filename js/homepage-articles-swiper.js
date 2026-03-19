const newsSwiper = new Swiper(".news-swiper", {
  loop: true,
  centeredSlides: true,
  spaceBetween: 24,
  speed: 600,

  grabCursor: true,

  // ✅ stability fixes
  observer: true,
  observeParents: true,
  preloadImages: true,
  updateOnImagesReady: true,

  pagination: {
    el: ".news-swiper .swiper-pagination",
    clickable: true,
  },

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  // ✅ your original breakpoints (unchanged)
  breakpoints: {
    0: { slidesPerView: 1.2 },
    992: { slidesPerView: 2.2 },
    1400: { slidesPerView: 3.2 },
    2000: { slidesPerView: 4.2 },
    2600: { slidesPerView: 5.2 },
  },

  on: {
    init(swiper) {
      requestAnimationFrame(() => {
        swiper.update();
      });
    },
  },
});

// ✅ final safety pass after full load
window.addEventListener("load", () => {
  newsSwiper.update();
});
