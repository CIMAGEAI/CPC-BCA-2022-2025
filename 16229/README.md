# 🚲 Bike Booking System

A modern, mobile-friendly bike service booking system with user authentication, booking management, and admin panel.

## 🚀 Quick Setup (XAMPP)

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Make sure both services show green status

### 2. Setup Database
- Open your browser and go to: `http://localhost/your-project-folder/setup.php`
- This will automatically create all necessary database tables
- You should see "✅ Setup Complete!" message

### 3. Start Using the System
- Open `http://localhost/your-project-folder/index.html`
- Register a new account
- Login and start booking services!

## 📁 File Structure

```
├── index.html              # Main homepage
├── login.html              # User login page
├── register.html           # User registration
├── dashboard.html          # User dashboard with booking form
├── admin.php              # Admin panel
├── config.php             # Database configuration
├── setup.php              # Database setup script
├── submit.php             # Booking submission handler
├── get_user_bookings.php  # Fetch user bookings
├── contact_submit.php     # Contact form handler
└── [bike company pages]   # Individual bike company pages
```

## 🛠️ Features

### User Features
- ✅ User registration and login
- ✅ Bike company selection
- ✅ Service booking with details
- ✅ Booking status tracking
- ✅ PDF booking confirmation
- ✅ Booking cancellation
- ✅ Mobile-friendly design

### Admin Features
- ✅ View all bookings
- ✅ Update booking status
- ✅ User management
- ✅ Contact form submissions
- ✅ Statistics dashboard

## 🔧 Database Tables

### Bookings Table
- `id` - Auto increment primary key
- `name` - Customer name
- `mobile` - Contact number
- `bike_model` - Bike model
- `regno` - Registration number
- `address` - Service address
- `problem` - Problem description
- `company` - Bike company
- `token` - Unique booking token
- `service_date` - Service date
- `user_email` - User's email
- `status` - Booking status (Pending/In Process/Completed/Cancelled)
- `created_at` - Booking timestamp

### Users Table
- `id` - Auto increment primary key
- `fullName` - User's full name
- `email` - User's email (unique)
- `mobile` - Contact number
- `password` - Hashed password
- `created_at` - Registration timestamp

### Contacts Table
- `id` - Auto increment primary key
- `name` - Contact name
- `email` - Contact email
- `subject` - Message subject
- `message` - Message content
- `created_at` - Submission timestamp

## 🎨 Design Features

- Modern gradient design
- Mobile-responsive layout
- Smooth animations
- Interactive bike selection
- Professional admin interface
- PDF generation for bookings

## 🔍 Troubleshooting

### Common Issues

1. **"Database Connection Failed"**
   - Make sure XAMPP MySQL is running
   - Check `config.php` database settings

2. **"No bookings found"**
   - Run `setup.php` to create database tables
   - Check browser console (F12) for errors

3. **"Error saving booking"**
   - Ensure all form fields are filled
   - Check if user is logged in
   - Verify database connection

### Debug Tools
- `setup.php` - Database setup and testing
- `debug_booking.php` - Booking system debugging
- `test_database.php` - Database structure testing

## 📱 How to Use

1. **Homepage** (`index.html`)
   - Select your bike company
   - Login/Register if prompted

2. **Registration** (`register.html`)
   - Fill in your details
   - Create account

3. **Login** (`login.html`)
   - Enter email and password
   - Access dashboard

4. **Dashboard** (`dashboard.html`)
   - Book services
   - View booking history
   - Cancel bookings

5. **Admin Panel** (`admin.php`)
   - View all bookings
   - Update status
   - Manage users

## 🎯 Quick Test

1. Run `setup.php` in browser
2. Open `index.html`
3. Register a new account
4. Login and book a service
5. Check admin panel for the booking

## 📞 Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify XAMPP services are running
3. Run `setup.php` to ensure database is ready
4. Check all files are in the correct folder

---

**Developed with ❤️ by Praveen Kumar** 