const membershipBenefitsSwiper = new Swiper(".membership-benefits-swiper", {
  loop: true,
  speed: 600,

  autoplay: {
    delay: 2200,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  slidesPerView: 3,
  slidesPerGroup: 3,
  spaceBetween: 32,
  centeredSlides: true,

  breakpoints: {
    // Small mobile
    480: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 32,
      centeredSlides: false,
    },

    // Bootstrap sm
    576: {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 48,
      centeredSlides: false,
    },

    // Bootstrap md
    768: {
      slidesPerView: 5,
      slidesPerGroup: 1,
      spaceBetween: 64,
      centeredSlides: false,
    },

    // Bootstrap lg
    992: {
      slidesPerView: 5,
      slidesPerGroup: 1,
      spaceBetween: 72,
      centeredSlides: false,
    },

    // Bootstrap xl
    1200: {
      slidesPerView: 6,
      slidesPerGroup: 1,
      spaceBetween: 72,
      centeredSlides: false,
    },
  },
});
