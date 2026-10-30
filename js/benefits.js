(function () {
  const comparison = document.querySelector("[data-membership-comparison]");

  if (!comparison) return;

  const params = new URLSearchParams(window.location.search);
  const selectedPlan = params.get("plan");

  if (!selectedPlan) return;

  const validPlans = ["free", "member", "family", "overseas", "student-teacher", "teacher", "overseas-teacher"];

  if (!validPlans.includes(selectedPlan)) return;

  // ======================
  // HIGHLIGHT COLUMN
  // ======================

  const selectedCells = comparison.querySelectorAll(`[data-plan="${CSS.escape(selectedPlan)}"]`);

  selectedCells.forEach(function (cell) {
    cell.classList.add("is-highlighted");
  });

  // ======================
  // SCROLL COLUMN INTO VIEW
  // ======================

  const selectedHeader = comparison.querySelector(`thead [data-plan="${CSS.escape(selectedPlan)}"]`);

  if (!selectedHeader) return;

  requestAnimationFrame(function () {
    const comparisonRect = comparison.getBoundingClientRect();
    const headerRect = selectedHeader.getBoundingClientRect();

    const targetScroll =
      comparison.scrollLeft + headerRect.left - comparisonRect.left - comparison.clientWidth / 2 + headerRect.width / 2;

    comparison.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  });
})();
