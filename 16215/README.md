# LibraryPro - Library Management System

A full-featured library management system with user authentication, book management, borrowing system, and admin dashboard.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access (User/Admin)

### 📚 Book Management
- Add, edit, delete books (Admin only)
- Search books by title, author, or ISBN
- Filter by category
- Sort by title, author, year, or availability
- Track book copies and availability

### 🔄 Borrow/Return System
- Request books for borrowing
- Return books with fine calculation
- Track due dates and overdue books
- View borrowing history

### 👨‍💼 Admin Dashboard
- User management (view, update roles, delete)
- System statistics and reports
- Overdue books tracking
- User activity reports
- Feedback management

### 💬 Feedback System
- Submit feedback and suggestions
- Admin can view and manage feedback

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Frontend**: HTML, CSS, JavaScript

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. **Clone or download the project**
   ```bash
   cd bboks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/librarypro
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your machine
   - Cloud: Use MongoDB Atlas or similar service

5. **Run the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Frontend: Open `index.html` in your browser
   - Backend API: `http://localhost:5000`

## Default Admin Credentials

When you first run the server, it will automatically create an admin user:
- **Email**: `admin@librarypro.com`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Books
- `GET /api/books` - Get all books (with search/filter)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Borrow/Return
- `POST /api/borrow/request` - Request/Issue a book
- `POST /api/borrow/return/:borrowId` - Return a book
- `GET /api/borrow/my-books` - Get user's borrowed books
- `GET /api/borrow/all` - Get all borrows (Admin only)
- `GET /api/borrow/overdue` - Get overdue books (Admin only)

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/reports/overdue` - Get overdue report
- `GET /api/admin/reports/user-activity/:userId` - Get user activity

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (Admin only)
- `GET /api/feedback/type/:type` - Get feedback by type (Admin only)
- `DELETE /api/feedback/:id` - Delete feedback (Admin only)

## Sample Data

The server automatically seeds sample data on first run:
- 5 classic books with covers
- Admin user account

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Books**: Search and filter through the book collection
3. **Borrow Books**: Request books for borrowing (14-day loan period)
4. **Return Books**: Return books on time to avoid fines ($1/day overdue)
5. **Admin Features**: Access admin dashboard for management tasks

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled for frontend integration

## File Structure

```
bboks/
├── models/           # Mongoose models
│   ├── User.js
│   ├── Book.js
│   ├── Borrow.js
│   └── Feedback.js
├── routes/           # API routes
│   ├── auth.js
│   ├── books.js
│   ├── borrow.js
│   ├── admin.js
│   └── feedback.js
├── middleware/       # Custom middleware
│   └── auth.js
├── style/           # CSS files
├── js/              # Frontend JavaScript
├── *.html           # Frontend pages
├── server.js        # Main server file
├── package.json
└── README.md
```

## Troubleshooting

1. **MongoDB Connection Error**: Make sure MongoDB is running
2. **Port Already in Use**: Change PORT in .env file
3. **JWT Errors**: Check JWT_SECRET in .env file
4. **CORS Issues**: Frontend and backend should be on same domain or configure CORS properly

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## License

This project is open source and available under the ISC License. 