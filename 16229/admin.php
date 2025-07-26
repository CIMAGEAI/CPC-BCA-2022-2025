<?php
include 'config.php';

// Fetch contacts
$contact_sql = "SELECT * FROM contacts ORDER BY id DESC";
$contact_result = $conn->query($contact_sql);

// Fetch users (from localStorage data - in real app this would be from database)
$users = isset($_GET['users']) ? json_decode($_GET['users'], true) : [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Bike Solutions</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

    body {
      font-family: Arial, sans-serif;
            background: linear-gradient(to right, #1e3c72, #2a5298);
            color: white;
            position: relative;
            min-height: 100vh;
        }

        /* Watermark */
        body::after {
            content: "Praveen Kumar";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 4rem;
            color: rgba(255, 255, 255, 0.07);
            z-index: 0;
            white-space: nowrap;
            pointer-events: none;
        }

        /* Header with gradient text */
        header {
            text-align: center;
            padding: 30px 20px 20px;
            background: linear-gradient(45deg, #ff4081, #ff9100);
            position: relative;
            z-index: 1;
            border-bottom: 5px solid #fff;
        }

        header h1 {
            font-size: 3.5rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 5px;
            background: linear-gradient(45deg, #23fc02, #067ff1, #e6fb05, #4c02fa);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 
                2px 2px 6px rgba(0, 0, 0, 0.3),
                -2px -2px 6px rgba(255, 255, 255, 0.15);
            animation: gradientShift 8s ease infinite;
            margin-bottom: 10px;
            position: relative;
            display: inline-block;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        header p {
            font-size: 1.5rem;
            margin-top: 10px;
            color: #ccc;
            font-weight: bold;
        }

        /* Navigation bar */
        nav {
            background-color: rgba(0,0,0,0.5);
            padding: 10px;
            z-index: 1;
            position: relative;
        }

        nav a {
            color: white;
            text-decoration: none;
            margin: 0 20px;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }

        nav a:hover {
            color: #ffd700;
            transform: translateY(-2px);
        }

        /* Admin Container */
        .admin-container {
            max-width: 1400px;
            margin: 0 auto;
      padding: 20px;
            position: relative;
            z-index: 1;
        }

        .admin-header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .admin-header h2 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #ffd700, #ff9100);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
        }

        .admin-header p {
            font-size: 1.2rem;
            color: #e0e0e0;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }

        .stat-card i {
            font-size: 3rem;
            margin-bottom: 15px;
            background: linear-gradient(45deg, #ffd700, #ff9100);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .stat-card h3 {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: #23fc02;
        }

        .stat-card p {
            font-size: 1.1rem;
            color: #e0e0e0;
        }

        .section-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 25px;
            color: #ffd700;
            font-weight: bold;
      text-align: center;
            position: relative;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #ff4081, #ff9100);
            border-radius: 2px;
        }

        .data-table {
      width: 100%;
      border-collapse: collapse;
            margin-top: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            overflow: hidden;
        }

        .data-table th {
            background: linear-gradient(45deg, #ff4081, #ff9100);
            color: white;
            padding: 15px;
      text-align: left;
            font-weight: bold;
            font-size: 1.1rem;
        }

        .data-table td {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: #e0e0e0;
        }

        .data-table tr:hover {
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }

        .data-table tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.02);
        }

        .status-badge {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-pending {
            background: linear-gradient(45deg, #ffa726, #ff9800);
            color: white;
        }

        .status-completed {
            background: linear-gradient(45deg, #66bb6a, #4caf50);
            color: white;
        }

        .status-cancelled {
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            color: white;
        }

        .token-badge {
            background: linear-gradient(45deg, #23fc02, #4caf50);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 0.9rem;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-view {
            background: linear-gradient(45deg, #2196f3, #42a5f5);
            color: white;
        }

        .btn-edit {
            background: linear-gradient(45deg, #ff9800, #ffa726);
            color: white;
        }

        .btn-delete {
            background: linear-gradient(45deg, #f44336, #ef5350);
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #ccc;
            font-size: 1.2rem;
        }

        .status-note {
            color: #ccc;
            font-style: italic;
            font-size: 0.9rem;
        }

        .tab-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
        }

        .tab-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .tab-btn.active {
            background: linear-gradient(45deg, #ff4081, #ff9100);
            border-color: transparent;
        }

        .tab-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        /* Modern Footer */
        .modern-footer {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
            color: white;
            padding: 40px 20px 20px;
            margin-top: 50px;
            position: relative;
            overflow: hidden;
        }

        .modern-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #ff4081, #ff9100, #23fc02, #067ff1);
            animation: rainbowShift 3s ease infinite;
        }

        @keyframes rainbowShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            position: relative;
            z-index: 1;
        }

        .footer-section {
            padding: 0 15px;
        }

        .footer-section h3 {
            color: #ffd700;
            font-size: 1.3rem;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
        }

        .footer-section h3::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 30px;
            height: 2px;
            background: linear-gradient(90deg, #ff4081, #ff9100);
            transition: width 0.3s ease;
        }

        .footer-section:hover h3::after {
            width: 50px;
        }

        .footer-links {
            list-style: none;
            padding: 0;
        }

        .footer-links li {
            margin-bottom: 8px;
        }

        .footer-links a {
            color: #e0e0e0;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
            position: relative;
            padding: 2px 0;
        }

        .footer-links a::before {
            content: '→';
            margin-right: 8px;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
        }

        .footer-links a:hover {
            color: #ffd700;
            transform: translateX(5px);
        }

        .footer-links a:hover::before {
            opacity: 1;
            transform: translateX(0);
        }

        .contact-info {
            list-style: none;
            padding: 0;
        }

        .contact-info li {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            color: #e0e0e0;
        }

        .contact-info i {
            margin-right: 10px;
            color: #ffd700;
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
        }

        .social-icons {
            display: flex;
            gap: 15px;
            margin-top: 15px;
            justify-content: center;
            align-items: center;
        }

        .social-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: white;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .social-icon i {
            font-size: 1.2rem;
      color: white;
    }

        .social-icon::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }

        .social-icon:hover::before {
            left: 100%;
        }

        .social-icon.facebook {
            background: linear-gradient(45deg, #1877f2, #42a5f5);
        }

        .social-icon.instagram {
            background: linear-gradient(45deg, #e4405f, #f06292);
        }

        .social-icon.whatsapp {
            background: linear-gradient(45deg, #25d366, #4caf50);
        }

        .social-icon:hover {
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            margin-top: 30px;
            padding-top: 20px;
            text-align: center;
            color: #ccc;
            font-size: 0.9rem;
        }

        .footer-bottom strong {
            color: #ffd700;
      font-weight: bold;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            header h1 {
                font-size: 2.5rem;
            }

            .admin-container {
                padding: 15px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }

            .section-card {
                padding: 20px;
            }

            .section-title {
                font-size: 1.8rem;
            }

            .data-table {
                font-size: 0.9rem;
            }

            .data-table th,
            .data-table td {
                padding: 10px 8px;
            }

            .tab-buttons {
                flex-direction: column;
                gap: 10px;
            }

            .tab-btn {
                padding: 12px 20px;
            }

            .modern-footer {
                padding: 30px 15px 15px;
            }

            .footer-content {
                grid-template-columns: 1fr;
                gap: 25px;
            }

            .footer-section {
                text-align: center;
                padding: 0 10px;
            }

            .social-icons {
                justify-content: center;
                gap: 12px;
            }

            .social-icon {
                width: 35px;
                height: 35px;
                font-size: 1rem;
            }

            .contact-info li {
                justify-content: center;
            }
        }

        @media (max-width: 480px) {
            header h1 {
                font-size: 2rem;
            }

            .section-card {
                padding: 15px;
            }

            .section-title {
                font-size: 1.5rem;
            }

            .data-table {
                font-size: 0.8rem;
            }

            .data-table th,
            .data-table td {
                padding: 8px 5px;
            }

            .modern-footer {
                padding: 25px 10px 10px;
            }

            .footer-section h3 {
                font-size: 1.1rem;
            }

            .social-icon {
                width: 30px;
                height: 30px;
                font-size: 0.9rem;
            }
    }
  </style>
</head>
<body>
    <header>
        <h1>The Bike Solution</h1>
        <p>Admin Dashboard</p>
    </header>

    <!-- Navigation Bar -->
    <nav>
        <a href="index.html">Home</a>
        <a href="aboutus.html">About Us</a>
        <a href="contactus.html">Contact Us</a>
    </nav>

    <!-- Admin Container -->
    <div class="admin-container">
        <!-- Admin Header -->
        <div class="admin-header">
            <h2>Admin Dashboard</h2>
            <p>Manage bookings, users, and contact messages</p>
        </div>

        <!-- Statistics Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <i class="fas fa-tools"></i>
                <h3 id="totalBookings">0</h3>
                <p>Total Bookings</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <h3 id="totalUsers">0</h3>
                <p>Registered Users</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-envelope"></i>
                <h3 id="totalContacts">0</h3>
                <p>Contact Messages</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <h3 id="pendingBookings">0</h3>
                <p>Pending Services</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-check-circle"></i>
                <h3 id="completedBookings">0</h3>
                <p>Completed Services</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-times-circle"></i>
                <h3 id="cancelledBookings">0</h3>
                <p>Cancelled Services</p>
            </div>
        </div>

        <!-- Tab Buttons -->
        <div class="tab-buttons">
            <button class="tab-btn active" onclick="showTab('bookings')">
                <i class="fas fa-tools"></i> Bookings
            </button>
            <button class="tab-btn" onclick="showTab('users')">
                <i class="fas fa-users"></i> Users
            </button>
            <button class="tab-btn" onclick="showTab('contacts')">
                <i class="fas fa-envelope"></i> Contacts
            </button>
        </div>

        <!-- Bookings Tab -->
        <div id="bookings" class="tab-content active">
            <div class="section-card">
                <h3 class="section-title">Service Bookings</h3>
                <table class="data-table">
                    <thead>
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Mobile</th>
    <th>Bike Model</th>
    <th>Reg No</th>
                            <th>Company</th>
    <th>Problem</th>
    <th>Token</th>
    <th>Service Date</th>
    <th>Amount</th>
    <th>Status</th>
                            <th>Actions</th>
  </tr>
                    </thead>
                    <tbody id="bookingsTableBody">
                        <tr><td colspan="11" class="no-data">Loading bookings...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Users Tab -->
        <div id="users" class="tab-content">
            <div class="section-card">
                <h3 class="section-title">Registered Users</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Registration Date</th>
                            <th>Total Bookings</th>
                            <th>Actions</th>
      </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        <!-- Users will be populated by JavaScript -->
                    </tbody>
</table>
            </div>
        </div>

        <!-- Contacts Tab -->
        <div id="contacts" class="tab-content">
            <div class="section-card">
                <h3 class="section-title">Contact Messages</h3>
                <table class="data-table">
                    <thead>
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Email</th>
    <th>Mobile</th>
    <th>Message</th>
    <th>Received At</th>
                            <th>Actions</th>
  </tr>
                    </thead>
                    <tbody>
  <?php if ($contact_result->num_rows > 0): ?>
    <?php while($row = $contact_result->fetch_assoc()): ?>
      <tr>
        <td><?= $row['id'] ?></td>
        <td><?= htmlspecialchars($row['name']) ?></td>
        <td><?= htmlspecialchars($row['email']) ?></td>
        <td><?= htmlspecialchars($row['mobile']) ?></td>
        <td><?= htmlspecialchars($row['message']) ?></td>
        <td><?= $row['created_at'] ?></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-view" onclick="viewContact(<?= $row['id'] ?>)">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-delete" onclick="deleteContact(<?= $row['id'] ?>)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
      </tr>
    <?php endwhile; ?>
  <?php else: ?>
                            <tr><td colspan="7" class="no-data">No contact messages found</td></tr>
  <?php endif; ?>
                    </tbody>
</table>
            </div>
        </div>
    </div>

    <!-- Modern Footer -->
    <footer class="modern-footer">
        <div class="footer-content">
            <!-- Quick Links Section -->
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="index.html">🏠 Home</a></li>
                    <li><a href="aboutus.html">👥 About Us</a></li>
                    <li><a href="contactus.html">📞 Contact Us</a></li>
                    <li><a href="admin.php">⚙️ Admin Panel</a></li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div class="footer-section">
                <h3>Contact Info</h3>
                <ul class="contact-info">
                    <li><i>📞</i> +91 6202019630</li>
                    <li><i>📧</i> info@bikesolutions.com</li>
                    <li><i>📍</i> Near P&M mall, Patna, Bihar</li>
                    <li><i>🕒</i> Mon-Sat: 9AM-7PM</li>
                </ul>
            </div>

            <!-- Social Media -->
            <div class="footer-section">
                <h3>Follow Us</h3>
                <div class="social-icons">
                    <a href="https://www.facebook.com/bikesolution" target="_blank" class="social-icon facebook" title="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/bikesolution" target="_blank" class="social-icon instagram" title="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://wa.me/916202019630" target="_blank" class="social-icon whatsapp" title="WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>

            <!-- Services -->
            <div class="footer-section">
                <h3>Our Services</h3>
                <ul class="footer-links">
                    <li><a href="#">🔧 Bike Repair</a></li>
                    <li><a href="#">🛠️ Maintenance</a></li>
                    <li><a href="#">🚿 Bike Wash</a></li>
                    <li><a href="#">🔋 Battery Service</a></li>
                </ul>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <p>&copy; 2024 <strong>The Bike Solution</strong>. All rights reserved. | Designed and Developed by <strong>Praveen Kumar</strong> 🚀 | Passionate about Bikes & Code</p>
        </div>
    </footer>

    <div id="amountModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); align-items:center; justify-content:center; z-index:9999;">
  <div style="background:#fff; color:#222; border-radius:12px; padding:32px 24px; min-width:320px; max-width:90vw; box-shadow:0 8px 32px rgba(0,0,0,0.3); position:relative;">
    <h2 style="margin-bottom:18px; color:#2a5298;">Enter Final Amount</h2>
    <form id="amountForm">
      <input type="number" id="finalAmountInput" name="amount" min="0" required placeholder="Enter amount (₹)" style="width:100%; padding:12px; font-size:1.1rem; border-radius:8px; border:1px solid #ccc; margin-bottom:18px;">
      <input type="hidden" id="amountBookingId" name="booking_id">
      <div style="display:flex; gap:12px; justify-content:flex-end;">
        <button type="button" onclick="closeAmountModal()" style="padding:8px 18px; border-radius:8px; border:none; background:#eee; color:#333; font-weight:bold;">Cancel</button>
        <button type="submit" style="padding:8px 18px; border-radius:8px; border:none; background:linear-gradient(45deg,#23fc02,#4caf50); color:#fff; font-weight:bold;">Submit</button>
      </div>
    </form>
  </div>
</div>
<script>
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Load data for specific tabs
    if (tabName === 'users') {
        loadUsers();
    }
}

function loadBookings() {
    fetch('get_bookings.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.bookings && data.bookings.length > 0) {
                displayBookings(data.bookings);
                updateBookingStats(data.bookings);
            } else if (data.success && (!data.bookings || data.bookings.length === 0)) {
                document.getElementById('bookingsTableBody').innerHTML = 
                    '<tr><td colspan="12" class="no-data">No bookings found in the database.</td></tr>';
            } else {
                document.getElementById('bookingsTableBody').innerHTML = 
                    `<tr><td colspan="12" class="no-data">Error loading bookings: ${data.message || 'Unknown error'}</td></tr>`;
            }
        })
        .catch(error => {
            document.getElementById('bookingsTableBody').innerHTML = 
                `<tr><td colspan="12" class="no-data">Network or JS error: ${error}</td></tr>`;
        });
}

function displayBookings(bookings) {
    // Sort bookings by created_at or id (latest first)
    bookings.sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id));
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="12" class="no-data">No bookings found</td></tr>';
        return;
    }

    bookingsTableBody.innerHTML = bookings.map(booking => {
        const statusClass = 'status-' + booking.status.toLowerCase();
        // Enforce status workflow
        let statusOptions = [];
        if (booking.status === 'Pending') {
            statusOptions = ['Started', 'Rejected'];
        } else if (booking.status === 'Started') {
            statusOptions = ['Completed', 'Rejected'];
        } else if (booking.status === 'Completed') {
            statusOptions = ['Delivered'];
        } // Delivered/Rejected: no further changes
        let statusDropdown = '';
        if (statusOptions.length > 0) {
            statusDropdown = `<select class="status-dropdown" onchange="changeBookingStatus(${booking.id}, this.value)">`;
            statusDropdown += `<option value="${booking.status}" selected disabled>${booking.status}</option>`;
            statusOptions.forEach(option => {
                statusDropdown += `<option value="${option}">${option}</option>`;
            });
            statusDropdown += '</select>';
        } else {
            statusDropdown = `<span class="status-note">No further action</span>`;
        }
        return `
            <tr id="booking-row-${booking.id}">
                <td>${booking.id}</td>
                <td>${escapeHtml(booking.name)}</td>
                <td>${escapeHtml(booking.mobile)}</td>
                <td>${escapeHtml(booking.bike_model)}</td>
                <td>${escapeHtml(booking.regno)}</td>
                <td>${escapeHtml(booking.company)}</td>
                <td>${escapeHtml(booking.problem)}</td>
                <td><span class="token-badge">${escapeHtml(booking.token)}</span></td>
                <td>${escapeHtml(booking.service_date)}</td>
                <td>${booking.amount !== null && booking.amount !== undefined ? '₹' + booking.amount : '-'}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(booking.status)}</span></td>
                <td>${statusDropdown}</td>
            </tr>
        `;
    }).join('');
}

// Update booking status logic
function changeBookingStatus(bookingId, status) {
    if (status === 'Delivered') {
        // Show modal for amount entry
        document.getElementById('amountModal').style.display = 'flex';
        document.getElementById('amountBookingId').value = bookingId;
        document.getElementById('finalAmountInput').value = '';
        return;
    }
    // Normal status change
    const formData = new FormData();
    formData.append('booking_id', bookingId);
    formData.append('status', status);
    fetch('update_booking.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        loadBookings();
    })
    .catch(error => {
        alert('Error updating booking status. Please try again.');
    });
}
// Modal submit for Delivered
if (document.getElementById('amountForm')) {
    document.getElementById('amountForm').onsubmit = function(e) {
        e.preventDefault();
        const bookingId = document.getElementById('amountBookingId').value;
        const amount = document.getElementById('finalAmountInput').value;
        if (!amount || isNaN(amount) || amount < 0) {
            alert('Please enter a valid amount.');
            return;
        }
        const formData = new FormData();
        formData.append('booking_id', bookingId);
        formData.append('status', 'Delivered');
        formData.append('amount', amount);
        fetch('update_booking.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('amountModal').style.display = 'none';
            loadBookings();
        })
        .catch(error => {
            alert('Error saving amount. Please try again.');
        });
    };
}

function updateBookingStats(bookings) {
    const pendingBookings = bookings.filter(booking => booking.status === 'Pending');
    const completedBookings = bookings.filter(booking => booking.status === 'Completed');
    const cancelledBookings = bookings.filter(booking => booking.status === 'Cancelled');
    const startedBookings = bookings.filter(booking => booking.status === 'Started');
    const deliveredBookings = bookings.filter(booking => booking.status === 'Delivered');
    const rejectedBookings = bookings.filter(booking => booking.status === 'Rejected');
    document.getElementById('totalBookings').textContent = bookings.length;
    // Pending count logic: show only if > 0, else show 0 or hide
    const pendingElem = document.getElementById('pendingBookings');
    if (pendingBookings.length > 0) {
        pendingElem.textContent = pendingBookings.length;
        pendingElem.parentElement.style.display = '';
    } else {
        pendingElem.textContent = '0';
        pendingElem.parentElement.style.display = 'none'; // Hide the card if zero
    }
    document.getElementById('completedBookings').textContent = completedBookings.length;
    document.getElementById('cancelledBookings').textContent = cancelledBookings.length;
    // Optionally, you can add started, delivered, rejected counts if you want
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const usersTableBody = document.getElementById('usersTableBody');
    const totalUsersElement = document.getElementById('totalUsers');

    // Update total users count
    totalUsersElement.textContent = users.length;

    if (users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
        return;
    }

    usersTableBody.innerHTML = users.map(user => {
        // Count user's bookings
        const userBookings = bookings.filter(booking => booking.userEmail === user.email);
        
        return `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>${userBookings.length}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-view" onclick="viewUser('${user.email}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-edit" onclick="editUser('${user.email}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', function() {
    loadBookings();
    loadContactStats();
});
</script>
</html>