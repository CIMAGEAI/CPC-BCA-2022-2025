# Library Management System - Backend

A comprehensive Node.js backend for the Library Management System with Express.js, MongoDB, and JWT authentication.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 📚 **Book Management**: CRUD operations for books with QR code integration
- 👥 **User Management**: Admin panel for managing users (students, faculty, staff, librarians)
- 🔄 **Transaction System**: Book issuing, returning, and renewal with fine calculation
- 📱 **QR Code Integration**: Generate and scan QR codes for quick book operations
- 📧 **Email Notifications**: Password reset and overdue book notifications
- 📊 **Statistics & Reports**: Comprehensive analytics for library operations
- 🔍 **Advanced Search**: Full-text search with filters and sorting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **QR Codes**: qrcode library
- **Security**: Helmet, CORS, Rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=24h
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud service)

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Books
- `GET /api/books` - Get all books (with pagination, filtering)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book (Admin/Librarian)
- `PUT /api/books/:id` - Update book (Admin/Librarian)
- `DELETE /api/books/:id` - Delete book (Admin/Librarian)
- `GET /api/books/search` - Search books
- `GET /api/books/stats` - Get book statistics (Admin/Librarian)
- `GET /api/books/qr/:qrCode` - Get book by QR code

### Transactions
- `GET /api/transactions` - Get all transactions (Admin/Librarian)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions/issue` - Issue a book (Admin/Librarian)
- `POST /api/transactions/return` - Return a book (Admin/Librarian)
- `POST /api/transactions/renew` - Renew a book (Admin/Librarian)
- `GET /api/transactions/user/:userId` - Get user transactions
- `GET /api/transactions/overdue` - Get overdue transactions (Admin/Librarian)
- `PUT /api/transactions/:id/pay-fine` - Pay fine (Admin/Librarian)

### Users
- `GET /api/users` - Get all users (Admin/Librarian)
- `GET /api/users/:id` - Get single user (Admin/Librarian)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `PUT /api/users/:id/toggle-status` - Toggle user status (Admin)
- `GET /api/users/stats` - Get user statistics (Admin)
- `GET /api/users/search` - Search users (Admin/Librarian)

### QR Codes
- `GET /api/qr/generate/:bookId` - Generate QR code for a book
- `POST /api/qr/scan` - Scan QR code and get book info
- `POST /api/qr/bulk-generate` - Generate QR codes for multiple books

## User Roles

1. **Admin**: Full system access
2. **Librarian**: Book and transaction management
3. **Student**: Can borrow books (limited)
4. **Faculty**: Can borrow books (extended limits)
5. **Staff**: Can borrow books (standard limits)

## Database Schema

### User Collection
- Basic info (name, email, password)
- Role-based access control
- Department and student ID
- Account status and timestamps

### Book Collection
- Book details (title, author, ISBN, genre)
- Inventory management (total/available copies)
- Location tracking (shelf, row, section)
- QR code integration
- Rating and status

### Transaction Collection
- Issue/return/renewal tracking
- Due date management
- Fine calculation
- User and book references

## Security Features

- JWT token authentication
- Password encryption with bcrypt
- Role-based authorization
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## Error Handling

- Centralized error handling middleware
- Custom error response class
- Validation error handling
- Database error handling

## Development

### Project Structure
```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # File uploads
├── config.env       # Environment variables
├── package.json     # Dependencies
├── server.js        # Main server file
└── README.md        # This file
```

### Adding New Features

1. Create model in `models/` directory
2. Create controller in `controllers/` directory
3. Create routes in `routes/` directory
4. Add route to `server.js`
5. Update documentation

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Set up proper JWT secret
4. Configure email settings
5. Set up reverse proxy (nginx)
6. Use PM2 or similar process manager

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 