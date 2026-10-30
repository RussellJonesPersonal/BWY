// ======================
// RANDOM PAGE-TITLE POSE
// ======================

const pose = document.getElementById("random-pose");

if (pose) {
  const randomNumber = Math.floor(Math.random() * 27) + 1;
  pose.src = `assets/images/poses/pose_silhouette_${randomNumber}.svg`;
}

// ======================
// ALTERNATIVE LOGO
// Add ?logo-alt to the URL
// ======================

const params = new URLSearchParams(window.location.search);

if (params.has("logo-alt")) {
  function swapLogo() {
    const logo = document.querySelector(".navbar-bwy__logo img");

    if (!logo) return false;

    logo.src = "assets/images/logo-alternative.jpg";

    return true;
  }

  // Try immediately in case the nav has already loaded.
  if (!swapLogo()) {
    // Otherwise wait for the partial navigation to be inserted.
    const observer = new MutationObserver(() => {
      if (swapLogo()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// ======================
// REGIONAL COLOUR ACCENTS
// URLs: ?region=north-west, ?region=london, etc.
// Actual colours are defined ONLY in _regional-themes.scss.
// ======================

const validRegions = new Set([
  "east",
  "london",
  "midlands",
  "north",
  "north-west",
  "overseas",
  "scotland",
  "south",
  "south-east",
  "south-west",
  "wales",
  "yorkshire",
]);

const selectedRegion = params.get("region");

if (selectedRegion && validRegions.has(selectedRegion)) {
  document.documentElement.dataset.region = selectedRegion;

  // Existing pose randomisation runs above, so this uses its final URL.
  // The SVG remains an <img> on unthemed pages.
  if (pose) {
    const poseArt = pose.closest(".page-title-art");
    if (poseArt) {
      const svgURL = new URL(pose.getAttribute("src"), document.baseURI).href;
      poseArt.style.setProperty("--region-pose-url", `url(${JSON.stringify(svgURL)})`);
    }
  }
}
