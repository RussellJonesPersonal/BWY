const testimonialsSwiper = new Swiper(".testimonials-swiper", {
  loop: true,
  speed: 600,
  spaceBetween: 24,

  grabCursor: true,

  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".testimonials-swiper .swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    992: {
      slidesPerView: 2,
    },
  },

  on: {
    init(swiper) {
      setTimeout(() => swiper.update(), 50);
    },
  },
});
