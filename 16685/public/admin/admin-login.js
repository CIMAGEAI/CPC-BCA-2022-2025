// 🔐 Admin Logic
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  const token = localStorage.getItem("adminToken");
  const onLoginPage = window.location.pathname === "/admin/admin-login.html";

  // ✅ Handle Admin Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorBox = document.getElementById("error");

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("adminToken", data.token);
          window.location.href = "/admin/dashboard.html";
        } else {
          errorBox.textContent = data.message || "Login failed";
        }
      } catch (err) {
        console.error("Login error:", err);
        errorBox.textContent = "Server error. Please try again.";
      }
    });

    // ✅ Show/hide password logic
    const showPasswordCheckbox = document.getElementById("showPassword");
    const passwordField = document.getElementById("password");

    if (showPasswordCheckbox && passwordField) {
      showPasswordCheckbox.addEventListener("change", () => {
        passwordField.type = showPasswordCheckbox.checked ? "text" : "password";
      });
    }
  }

  // ✅ Redirect to login if not authenticated
  if (!token && !onLoginPage) {
    window.location.href = "/admin/admin-login.html";
    return;
  }

  // ✅ Auto-fetch users if on users.html
  const userTableBody = document.getElementById("usersTableBody");
  if (token && userTableBody) {
    fetchUsers(token);
  }
});

async function fetchUsers(token) {
  try {
    const response = await fetch("/api/admin/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/admin-login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();
    populateUsersTable(users);
  } catch (error) {
    console.error("Error loading users:", error);
    const tbody = document.getElementById("usersTableBody");
    if (tbody) {
      tbody.innerHTML = `
        <tr><td colspan="5" class="text-danger">Unable to load user data</td></tr>
      `;
    }
  }
}

function populateUsersTable(users) {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No registered users found.</td></tr>`;
    return;
  }

  users.forEach((user, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${capitalize(user.name)}</td>
      <td>${user.email}</td>
      <td>${user.role === "admin" ? "👨‍💼 Admin" : "👤 User"}</td>
      <td>${formatDate(user.createdAt)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function capitalize(text = "") {
  return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
