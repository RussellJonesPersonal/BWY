function initCardSwiper(selector) {
  const swiperEl = document.querySelector(selector);

  if (!swiperEl) return null;

  const paginationEl = swiperEl.querySelector(".swiper-pagination");

  return new Swiper(swiperEl, {
    // ======================
    // LAYOUT
    // ======================

    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 24,

    // ======================
    // BEHAVIOUR
    // ======================

    loop: true,
    speed: 600,
    grabCursor: true,

    observer: true,
    observeParents: true,

    // ======================
    // PAGINATION
    // ======================

    pagination: {
      el: paginationEl,
      clickable: true,
    },

    // ======================
    // AUTOPLAY
    // ======================

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  });
}

// ======================
// INITIALISE CAROUSELS
// ======================

const newsSwiper = initCardSwiper(".news-swiper");
const eventsSwiper = initCardSwiper(".events-swiper");
const courseSwiper = initCardSwiper(".course-swiper");
