document.addEventListener("DOMContentLoaded", () => {
  const durationInput = document.getElementById("id_duration_months");
  const priceInput = document.getElementById("id_price");
  const planTypeSelect = document.getElementById("id_plan_type");

  const pricing = {
    Basic: 500,
    Standard: 1000,
    Premium: 2000,
  };

  function updatePrice() {
    const months = parseInt(durationInput.value);
    const planType = planTypeSelect.value;
    if (months > 0 && pricing[planType]) {
      priceInput.value = pricing[planType] * months;
    } else {
      priceInput.value = "";
    }
  }

  durationInput.addEventListener("input", updatePrice);
  planTypeSelect.addEventListener("change", updatePrice);

  updatePrice();
});
document.querySelectorAll('.message-box').forEach(box => {
  // Close when clicking the ✖
  const closeBtn = box.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      box.style.opacity = '0';
      setTimeout(() => box.style.display = 'none', 300);
    });
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    box.style.opacity = '0';
    setTimeout(() => box.style.display = 'none', 300);
  }, 5000);
});