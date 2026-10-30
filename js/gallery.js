(function () {
  const galleries = document.querySelectorAll("[data-gallery]");

  if (!galleries.length) return;

  galleries.forEach(function (gallery) {
    const slides = Array.from(gallery.querySelectorAll(".bwy-gallery-slide"));

    if (!slides.length) return;

    // ======================
    // INLINE SWIPER
    // ======================

    const inlineSwiper = new Swiper(gallery, {
      loop: true,
      slidesPerView: 1.2,
      spaceBetween: 16,

      breakpoints: {
        768: {
          slidesPerView: 2.2,
          spaceBetween: 24,
        },

        992: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      },
    });

    // ======================
    // BUILD LIGHTBOX
    // ======================

    const lightbox = document.createElement("div");

    lightbox.className = "bwy-gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image gallery");

    const lightboxInner = document.createElement("div");

    lightboxInner.className = "bwy-gallery-lightbox-inner";

    // Main Swiper

    const lightboxSwiperElement = document.createElement("div");

    lightboxSwiperElement.className = "bwy-gallery-lightbox-swiper swiper";

    const wrapper = document.createElement("div");

    wrapper.className = "swiper-wrapper";

    slides.forEach(function (slide) {
      const sourceImage = slide.querySelector("img");

      if (!sourceImage) return;

      const lightboxSlide = document.createElement("div");

      lightboxSlide.className = "swiper-slide";

      const image = document.createElement("img");

      image.className = "bwy-gallery-lightbox-image";
      image.src = sourceImage.src;
      image.alt = sourceImage.alt;

      lightboxSlide.appendChild(image);
      wrapper.appendChild(lightboxSlide);
    });

    lightboxSwiperElement.appendChild(wrapper);

    // Previous button

    const prevButton = document.createElement("button");

    prevButton.type = "button";
    prevButton.className = "bwy-gallery-lightbox-prev";
    prevButton.setAttribute("aria-label", "Previous image");

    prevButton.innerHTML = `
      <span
        class="iconify"
        data-icon="mdi:chevron-left"
        aria-hidden="true"
      ></span>
    `;

    // Next button

    const nextButton = document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "bwy-gallery-lightbox-next";
    nextButton.setAttribute("aria-label", "Next image");

    nextButton.innerHTML = `
      <span
        class="iconify"
        data-icon="mdi:chevron-right"
        aria-hidden="true"
      ></span>
    `;

    // Close button

    const closeButton = document.createElement("button");

    closeButton.type = "button";
    closeButton.className = "bwy-gallery-lightbox-close";
    closeButton.setAttribute("aria-label", "Close gallery");

    closeButton.innerHTML = `
      <span
        class="iconify"
        data-icon="mdi:close"
        aria-hidden="true"
      ></span>
    `;

    lightboxInner.appendChild(lightboxSwiperElement);
    lightboxInner.appendChild(prevButton);
    lightboxInner.appendChild(nextButton);
    lightboxInner.appendChild(closeButton);

    lightbox.appendChild(lightboxInner);

    document.body.appendChild(lightbox);

    // ======================
    // LIGHTBOX SWIPER
    // ======================

    const lightboxSwiper = new Swiper(lightboxSwiperElement, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 32,
      speed: 400,

      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },

      keyboard: {
        enabled: true,
      },
    });

    // ======================
    // OPEN
    // ======================

    function openLightbox(index) {
      if (inlineSwiper.autoplay) {
        inlineSwiper.autoplay.stop();
      }

      lightboxSwiper.slideToLoop(index, 0);

      document.body.style.overflow = "hidden";

      lightbox.classList.add("is-open");

      closeButton.focus();
    }

    // ======================
    // CLOSE
    // ======================

    function closeLightbox() {
      lightbox.classList.remove("is-open");

      document.body.style.overflow = "";

      if (inlineSwiper.autoplay) {
        inlineSwiper.autoplay.start();
      }
    }

    // ======================
    // INLINE IMAGE CLICKS
    // ======================

    slides.forEach(function (slide, index) {
      slide.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    // ======================
    // CLOSE EVENTS
    // ======================

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
      const clickedImage = event.target.closest(".bwy-gallery-lightbox-image");

      const clickedControl = event.target.closest(
        ".bwy-gallery-lightbox-prev, .bwy-gallery-lightbox-next, .bwy-gallery-lightbox-close",
      );

      if (!clickedImage && !clickedControl) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  });
})();
