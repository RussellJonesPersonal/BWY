(function () {
  const CONFIG = {
    selector: "h1",
    startDelay: 200, // ms before animation starts
    totalDuration: 3500, // total animation duration
    letterDuration: 1500, // duration of each letter animation
    blurAmount: 12, // px
  };

  let currentAnimation = null;
  let lastWidth = window.innerWidth;

  function animateText(el) {
    if (!el) return;

    // Kill any running animation
    if (currentAnimation) {
      clearTimeout(currentAnimation);
      currentAnimation = null;
    }

    const originalText = el.dataset.originalText || el.textContent;
    el.dataset.originalText = originalText;

    // Prevent layout jump
    el.style.minHeight = el.offsetHeight + "px";

    // Clear and rebuild
    el.innerHTML = "";

    const words = originalText.split(" ");

    // Count characters (excluding spaces)
    const totalChars = originalText.replace(/\s/g, "").length;

    const perCharDelay = totalChars > 1 ? (CONFIG.totalDuration - CONFIG.letterDuration) / (totalChars - 1) : 0;

    let charIndex = 0;

    words.forEach((word, wIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap"; // 🔑 prevents mid-word breaks

      [...word].forEach((char) => {
        const charSpan = document.createElement("span");

        charSpan.textContent = char;
        charSpan.style.display = "inline-block";
        charSpan.style.opacity = "0";
        charSpan.style.filter = `blur(${CONFIG.blurAmount}px)`;

        charSpan.style.transition = `
          opacity ${CONFIG.letterDuration}ms ease,
          filter ${CONFIG.letterDuration}ms ease
        `;

        charSpan.style.transitionDelay = `${charIndex * perCharDelay}ms`;

        wordSpan.appendChild(charSpan);

        charIndex++;
      });

      el.appendChild(wordSpan);

      // Add space between words
      if (wIndex < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });

    // Start animation after delay
    currentAnimation = setTimeout(() => {
      const spans = el.querySelectorAll("span span");

      spans.forEach((span) => {
        span.style.opacity = "1";
        span.style.filter = "blur(0px)";
      });

      // Reveal element (prevents initial flash)
      el.classList.add("is-ready");
    }, CONFIG.startDelay);
  }

  // Debounce helper
  function debounce(fn, delay = 200) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, delay);
    };
  }

  function init() {
    const el = document.querySelector(CONFIG.selector);
    if (!el) return;

    // Hide immediately to prevent flash
    el.classList.add("js-animate-text");

    animateText(el);
  }

  // Initial run
  window.addEventListener("load", init);

  // Re-run on significant resize only
  window.addEventListener(
    "resize",
    debounce(() => {
      const el = document.querySelector(CONFIG.selector);
      if (!el) return;

      if (Math.abs(window.innerWidth - lastWidth) > 50) {
        lastWidth = window.innerWidth;
        animateText(el);
      }
    }, 250),
  );
})();
