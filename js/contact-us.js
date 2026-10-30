// Demonstration-only contact form interaction.
// No information is sent or stored. Replace with a real server-side
// submission workflow before publishing the form as functional.

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("contact-section");
  const form = document.getElementById("bwy-contact-form");

  if (!section) return;

  const params = new URLSearchParams(window.location.search);

  if (params.get("contact") === "thanks") {
    section.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-lg-9 col-xl-8 col-xxl-7 mx-auto">
            <div class="content-body" role="status">
              <h2>Thank you</h2>
              <p>Thank you for completing the form.</p>
              <p class="small text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sagittis magna id dignissim. Aliquam dignissim velit rhoncus libero maximus, vel iaculis nibh blandit. </p>
              <p><a class="btn btn-subtle-primary" href="home.html">Back to homepage</a></p>
            </div>
          </div>
        </div>
      </div>`;
    return;
  }

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const files = document.getElementById("contact-files");
    const maxBytes = 5 * 1024 * 1024;
    if (files && [...files.files].some((file) => file.size > maxBytes)) {
      files.setCustomValidity("Each file must be 5MB or smaller.");
      files.reportValidity();
      files.addEventListener("change", () => files.setCustomValidity(""), { once: true });
      return;
    }

    const destination = new URL(window.location.href);
    destination.searchParams.set("contact", "thanks");
    window.location.assign(destination.href);
  });
});
