document.addEventListener("DOMContentLoaded", function () {

  // ✅ Prevent auto modal and scroll to top after login
  if (window.location.search.includes("login=1") || window.location.hash === "#ticketModal") {
    // Scroll to top (force home section)
    window.scrollTo({ top: 0, behavior: "auto" });

    // Hide modal if it exists (no need to check for "show" class immediately)
    const openModal = document.getElementById("ticketModal");
    if (openModal) {
      const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
      modalInstance.hide();
    }

    // Remove query/hash from URL to avoid repeated behavior
    history.replaceState(null, "", window.location.pathname);
  }



  // ========== LOGIN HANDLER ==========
  document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.userId && data.name && data.email) {
        // ✅ Save user data to localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.name);
        localStorage.setItem("userEmail", data.email);

        // ✅ Redirect to homepage with login=1
        window.location.href = "index.html?login=1";
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      alert("Login error. Try again later.");
    }
  });


  // ========== LOGOUT ==========
  window.logout = function () {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  // ========== HANDLE LOGIN UI ==========
  const username = localStorage.getItem("username");
  const loginBtnWrapper = document.getElementById("loginBtnWrapper");
  const userDropdown = document.getElementById("userDropdown");
  const userBtn = document.getElementById("userBtn");

  if (username && loginBtnWrapper && userDropdown && userBtn) {
    loginBtnWrapper.classList.add("d-none");
    userDropdown.classList.remove("d-none");
    userBtn.textContent = username;
  }

  const dropdownMenu = document.querySelector("#userDropdown .dropdown-menu");
  if (dropdownMenu) {
    dropdownMenu.innerHTML = `
      <li><a class="dropdown-item" href="/profile.html">My Tickets</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Logout</a></li>
    `;
  }


  // ========== INITIALIZE MAP ==========
  const map = L.map('metroMap').setView([25.615, 85.13], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.Control.geocoder({ defaultMarkGeocode: true }).addTo(map);

  // ========== STATION DISTANCE DATA FOR FARE CALCULATION ==========
  const stationDistances = {
    "danapur cantonment:saguna mor": 1.78,
    "saguna mor:rps mor": 2.87,
    "rps mor:patliputra": 1.75,
    "patliputra:rukanpura": 0.87,
    "rukanpura:raja bazar": 1.09,
    "raja bazar:patna zoo": 3.16,
    "patna zoo:vikas bhawan": 1.63,
    "vikas bhawan:vidyut bhawan": 1.16,
    "vidyut bhawan:patna junction": 1.49,
    "patna junction:cnlu": 1.2,
    "cnlu:mithapur": 1.43,
    "mithapur:ramkrishna nagar": 1.75,
    "ramkrishna nagar:jaganpura": 1.38,
    "jaganpura:khemni chak": 1.32,

    "patna junction:akashvani": 1.5,
    "akashvani:gandhi maidan": 0.62,
    "gandhi maidan:pmch": 0.53,
    "pmch:patna university": 0.42,
    "patna university:moin-ul-haq stadium": 0.43,
    "moin-ul-haq stadium:rajendra nagar": 0.47,
    "rajendra nagar:malahi pakri": 1.09,
    "malahi pakri:khemni chak": 4.93,
    "khemni chak:bhoothnath": 1.3,
    "bhoothnath:zero mile": 1.09,
    "zero mile:new isbt": 1.02
  };

  // Capitalize each word (for consistent key formatting)
  function capitalize(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  // ========== CALCULATE SHORTEST DISTANCE BETWEEN STATIONS ==========
  function calculateDistance(from, to) {
    from = from.toLowerCase();
    to = to.toLowerCase();
    const graph = {};
    for (const key in stationDistances) {
      const [s1Raw, s2Raw] = key.split(":"), s1 = s1Raw.toLowerCase(), s2 = s2Raw.toLowerCase();
      graph[s1] = graph[s1] || [];
      graph[s2] = graph[s2] || [];
      graph[s1].push(s2);
      graph[s2].push(s1);
    }
    const visited = new Set();
    const queue = [{ station: from }];
    const parentMap = {};
    while (queue.length > 0) {
      const { station } = queue.shift();
      if (station === to) {
        let curr = to, totalDistance = 0;
        while (curr !== from) {
          const prev = parentMap[curr];
          totalDistance += stationDistances[`${prev}:${curr}`] ?? stationDistances[`${curr}:${prev}`] ?? 0;
          curr = prev;
        }
        return totalDistance;
      }
      visited.add(station);
      for (const neighbor of graph[station] || []) {
        if (!visited.has(neighbor)) {
          queue.push({ station: neighbor });
          parentMap[neighbor] = station;
        }
      }
    }
    return 0;
  }

  // ========== HANDLE PAYMENT TICKET BOOKING CLICK ==========
  const payBtn = document.getElementById("payBtn");
  if (payBtn) {
    payBtn.addEventListener("click", async function () {
      const from = document.getElementById("fromStation").value.trim().toLowerCase();
      const to = document.getElementById("toStation").value.trim().toLowerCase();
      const adults = parseInt(document.getElementById("passengers").value);
      const children = parseInt(document.getElementById("children").value);
      const ticketType = document.querySelector("input[name='ticketType']:checked")?.value;

      if (!from || !to || isNaN(adults) || isNaN(children) || !ticketType || from === to) {
        alert("Please complete all fields correctly.");
        return;
      }

      const distance = calculateDistance(from, to);
      if (distance === 0) {
        alert("Invalid route selected.");
        return;
      }

      let baseFare = 10 + distance * 2;
      if (ticketType === "return") baseFare *= 2;
      else if (ticketType === "day") baseFare = 100;
      else if (ticketType === "weekly") baseFare = 500;

      const totalFare = adults * baseFare + children * (baseFare * 0.5);
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");
      const username = localStorage.getItem("username");

      if (!userId) {
        alert("Please log in to continue.");
        return;
      }

      const amountInPaise = Math.round(totalFare * 100);

      try {
        const response = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: capitalize(from),
            to: capitalize(to),
            adults,
            children,
            ticketType,
            amount: amountInPaise
          })
        });

        const data = await response.json();

        if (response.ok && data.orderId && data.key) {
          const options = {
            key: data.key,
            amount: data.amount,
            currency: "INR",
            name: "Patna Metro",
            description: `Ticket from ${capitalize(from)} to ${capitalize(to)} (${ticketType})`,
            order_id: data.orderId,
            handler: async function (res) {
              // ✅ Save booking after payment success
              const saveRes = await fetch("/api/tickets/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  from: capitalize(from),
                  to: capitalize(to),
                  adults,
                  children,
                  ticketType,
                  amount: Math.round(totalFare),
                  userId,
                  userEmail
                })
              });

              const saveData = await saveRes.json();
              if (saveRes.ok) {
                showBookingConfirmation({
                  from: capitalize(from),
                  to: capitalize(to),
                  fare: Math.round(totalFare)
                });
              } else {
                console.error("⚠️ Save Error:", saveData);
                alert("⚠️ Payment succeeded but booking save failed.");
              }
            },

            prefill: {
              name: username || "Metro User",
              email: userEmail || ""
            },
            theme: {
              color: "#0d6efd"
            }
          };

          const razor = new Razorpay(options);
          razor.open();
        } else {
          alert(data.message || "Failed to initiate payment.");
        }
      } catch (error) {
        console.error("Payment Error:", error);
        alert("Something went wrong during payment.");
      }
    });
  }

  const line1 = ["Danapur Cantonment", "Saguna Mor", "RPS Mor", "Patliputra", "Rukanpura", "Raja Bazar", "Patna Zoo", "Vikas Bhawan", "Vidyut Bhawan", "Patna Junction", "Mithapur", "Ramkrishna Nagar", "Jaganpura", "Khemni Chak", "CNLU"];
  const line2 = ["Patna Junction", "Akashvani", "Gandhi Maidan", "PMCH", "Patna University", "Moin-ul-Haq Stadium", "Rajendra Nagar", "Malahi Pakri", "Khemni Chak", "Bhoothnath", "Zero Mile", "New ISBT"];

  function populateStations(selectElement) {
    selectElement.innerHTML = '<option disabled selected value="">Select station</option>';
    const optGroup1 = document.createElement("optgroup");
    optGroup1.label = "🚇 LINE 1";
    line1.forEach(station => {
      const option = document.createElement("option");
      option.value = station.toLowerCase();
      option.textContent = station;
      optGroup1.appendChild(option);
    });
    const optGroup2 = document.createElement("optgroup");
    optGroup2.label = "🚇 LINE 2";
    line2.forEach(station => {
      const option = document.createElement("option");
      option.value = station.toLowerCase();
      option.textContent = station;
      optGroup2.appendChild(option);
    });
    selectElement.appendChild(optGroup1);
    selectElement.appendChild(optGroup2);
  }

  populateStations(document.getElementById("fareFrom"));
  populateStations(document.getElementById("fareTo"));

  document.getElementById("fareCalculatorForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const from = document.getElementById("fareFrom").value.trim().toLowerCase();
    const to = document.getElementById("fareTo").value.trim().toLowerCase();
    const adults = parseInt(document.getElementById("fareAdults").value) || 0;
    const children = parseInt(document.getElementById("fareChildren").value) || 0;
    const ticketType = document.querySelector('input[name="fareTicketType"]:checked')?.value || "single";

    if (!from || !to || from === to || adults < 1) {
      alert("Please select valid and different stations, and at least 1 adult.");
      return;
    }

    document.getElementById("fareResult").classList.add("d-none");
    document.getElementById("fareLoading").classList.remove("d-none");

    setTimeout(() => {
      const dist = calculateDistance(from, to);
      let baseFare = 10 + dist * 2; // ₹10 + ₹2 per km

      // Adjust base fare based on ticket type
      switch (ticketType) {
        case "return":
          baseFare *= 2;
          break;
        case "day":
          baseFare = 40; // flat rate for day pass (per adult)
          break;
        case "weekly":
          baseFare = 500; // flat rate for weekly pass (per adult)
          break;
      }

      // Total fare calculation
      let totalFare;
      if (ticketType === "day" || ticketType === "weekly") {
        totalFare = baseFare * adults; // passes are only for adults
      } else {
        totalFare = (baseFare * adults) + (baseFare * 0.5 * children); // children 50% fare
      }

      const time = Math.round(dist * 1.5);

      document.getElementById("fareOutput").textContent = `₹ ${Math.round(totalFare)}`;
      document.getElementById("fareDistance").textContent = `Approx. distance: ${dist.toFixed(2)} km`;
      document.getElementById("fareTime").textContent = `Estimated time: ${time} mins`;

      document.getElementById("fareLoading").classList.add("d-none");
      document.getElementById("fareResult").classList.remove("d-none");
    }, 800);
  });


  document.getElementById("swapStations").addEventListener("click", function () {
    const fromSelect = document.getElementById("fareFrom");
    const toSelect = document.getElementById("fareTo");
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    const icon = document.getElementById("swapIcon");
    icon.classList.add("rotate");
    setTimeout(() => icon.classList.remove("rotate"), 400);
  });

  const navbar = document.querySelector(".navbar");
  const collapseElement = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      const hash = this.getAttribute("href");
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        if (window.innerWidth < 992 && collapseElement.classList.contains("show")) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement);
          bsCollapse.hide();
        }
        setTimeout(() => {
          const offset = navbar.offsetHeight + 16;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }, 300);
      }
    });
  });

  // ========== LOAD MY TICKETS ON MODAL OPEN ==========
  const ticketModal = document.getElementById("ticketModal");

  if (ticketModal) {
    ticketModal.addEventListener("shown.bs.modal", async function () {
      console.log("✅ Modal is now visible");

      const userId = localStorage.getItem("userId");
      const contentDiv = document.getElementById("userTicketsContent");

      console.log("🧪 Modal opened. userId =", userId);

      if (!userId) {
        contentDiv.innerHTML = "<p class='text-danger'>Please log in to view your tickets.</p>";
        return;
      }

      contentDiv.innerHTML = "<p>Loading your tickets...</p>";

      try {
        const res = await fetch(`/api/tickets/user/${userId}`);
        const data = await res.json();

        console.log("📦 Ticket data received:", data);

        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data.message || "Failed to load tickets.");
        }

        if (data.length === 0) {
          contentDiv.innerHTML = "<p class='text-muted'>You have no tickets yet.</p>";
          return;
        }

        const ticketHtml = data.map(ticket => `
          <div class="border rounded p-3 mb-3 text-start shadow-sm bg-light">
            <h6 class="mb-1">
              <strong>${ticket.from}</strong> ➝ <strong>${ticket.to}</strong>
            </h6>
            <p class="mb-1">🧾 Type: ${ticket.ticketType} | 💸 ₹${ticket.fare}</p>
            <p class="mb-0">
              <small class="text-muted">📅 ${new Date(ticket.createdAt).toLocaleString()}</small>
            </p>
          </div>
        `).join("");

        contentDiv.innerHTML = ticketHtml;

      } catch (err) {
        console.error("❌ Error loading tickets:", err);
        contentDiv.innerHTML = "<p class='text-danger'>Error loading your tickets. Try again later.</p>";
      }
    });
  } else {
    console.warn("⚠️ ticketModal element not found.");
  }
});


// ✅ Booking confirmation popup function
function showBookingConfirmation(booking) {
  document.getElementById("confirmFrom").textContent = booking.from;
  document.getElementById("confirmTo").textContent = booking.to;
  document.getElementById("confirmFare").textContent = booking.fare;

  const qr = new QRious({
    element: document.getElementById("qrCanvas"),
    size: 200,
    value: `From: ${booking.from}\nTo: ${booking.to}\nFare: ₹${booking.fare}`
  });

  const modal = new bootstrap.Modal(document.getElementById("bookingConfirmationModal"));
  modal.show();
}

// Optional: Redirect to My Tickets page if user clicks confirm
function goToMyTickets() {
  window.location.href = "profile.html";
}
