// admin/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  // 🔒 Redirect to login if not authenticated
  if (!token) {
    window.location.href = "/admin/admin-login.html";
    return;
  }

  // 📊 Fetch admin stats and update dashboard
  fetch("/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Unauthorized or failed to fetch");
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("totalUsers").textContent = data.totalUsers ?? 0;
      document.getElementById("totalTickets").textContent = data.totalBookings ?? 0;
      document.getElementById("ticketsToday").textContent = data.bookingsToday ?? 0;
      document.getElementById("revenue").textContent = `₹ ${data.revenue ?? 0}`;
    })
    .catch((err) => {
      console.error("Failed to load dashboard stats:", err);
      alert("Error loading dashboard stats.");
    });
});

// 🚪 Admin Logout
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/admin-login.html";
}
