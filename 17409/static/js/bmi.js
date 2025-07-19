document.addEventListener("DOMContentLoaded", () => {
  // Auto-hide alert after 5s
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.add("fade-out");
    }, 5000);
  });

  // Input validation before submit
  const form = document.querySelector("#bmi-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const height = parseFloat(document.querySelector("#id_height_cm").value);
      const weight = parseFloat(document.querySelector("#id_weight_kg").value);

      if (!height || !weight || height <= 0 || weight <= 0) {
        e.preventDefault();
        showError("Please enter valid height and weight greater than 0.");
      }
    });
  }

  function showError(msg) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-error fade-in";
    errorDiv.innerText = msg;
    document.querySelector(".bmi-container").prepend(errorDiv);

    setTimeout(() => {
      errorDiv.classList.add("fade-out");
    }, 5000);
  }
});