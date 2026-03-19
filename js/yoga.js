document.querySelectorAll(".dropdown").forEach((dropdown) => {
  const toggle = dropdown.querySelector(".dropdown-toggle");

  dropdown.addEventListener("show.bs.dropdown", () => {
    toggle.classList.add("is-open");
  });

  dropdown.addEventListener("hide.bs.dropdown", () => {
    toggle.classList.remove("is-open");
  });
});
