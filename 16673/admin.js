document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".nav-link");
  const contentArea = document.getElementById("content-area");

  const pages = {
    home: "<h2>Home</h2><p>Welcome to the admin panel.</p>",
    registration: "<h2>Registration</h2><p>Manage user registrations here.</p>",
    "booking-history": "<h2>Booking History</h2><p>View past bookings.</p>",
    "contact-history": "<h2>Contact History</h2><p>View contact messages.</p>",
    "inquiry-history":
      "<h2>Inquiry History</h2><p>Check customer inquiries.</p>",
    "add-rooms": "<h2>Add Rooms</h2><p>Add new rooms to the hotel.</p>",
  };

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const section = this.getAttribute("href").substring(1); // Remove #
      if (pages[section]) {
        contentArea.innerHTML = pages[section];
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");

  toggleButton.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
  });
});
