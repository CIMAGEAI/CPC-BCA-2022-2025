# 🏛️ LibraTech - Library Management System

A modern, comprehensive library management system built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JavaScript.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Librarian, Student, Faculty, Staff)
- Password reset functionality
- Account activation/deactivation

### 📚 Book Management
- Complete CRUD operations for books
- Advanced search and filtering
- ISBN validation
- QR code generation for books
- Book availability tracking
- Genre categorization

### 👥 User Management
- User registration and profiles
- Student ID management
- Department-based organization
- User status management

### 🔄 Transaction Management
- Book borrowing and returns
- Due date tracking
- Fine calculation for overdue books
- Transaction history
- Borrowing limits by role

### 📊 Analytics & Reporting
- Book statistics and analytics
- User activity reports
- Transaction summaries
- Overdue book tracking

### 🎨 Modern UI/UX
- Responsive design
- Beautiful animations
- Professional styling
- Intuitive navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy and edit the config file
   cp config.env.example config.env
   ```
   
   Update `backend/config.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/libraryDB
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

6. **Open the frontend**
   - Navigate to the `frontend` folder
   - Open `index.html` in your browser
   - Or serve it using a local server:
     ```bash
     cd frontend
     python -m http.server 3000
     # or
     npx serve .
     ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/libraryDB` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `30d` |

### Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **XSS Protection**: Cross-site scripting prevention
- **NoSQL Injection Protection**: MongoDB query sanitization
- **Parameter Pollution Protection**: HTTP parameter pollution prevention

## 📁 Project Structure

```
library-management-system/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── uploads/             # File uploads
│   ├── config.env           # Environment variables
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
├── frontend/
│   ├── *.html              # HTML pages
│   ├── styles.css          # Main stylesheet
│   ├── *.js                # JavaScript files
│   └── favicon.ico         # Site icon
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:token` - Reset password

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin/Librarian)
- `PUT /api/books/:id` - Update book (Admin/Librarian)
- `DELETE /api/books/:id` - Delete book (Admin)
- `GET /api/books/search` - Search books
- `GET /api/books/stats` - Book statistics

### Users
- `GET /api/users` - Get all users (Admin/Librarian)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `PATCH /api/users/:id/toggle-status` - Toggle user status

### Transactions
- `GET /api/transactions` - Get all transactions (Admin/Librarian)
- `GET /api/transactions/my-transactions` - Get user's transactions
- `POST /api/transactions/borrow` - Borrow book
- `PUT /api/transactions/:id/return` - Return book
- `GET /api/transactions/stats` - Transaction statistics

## 🛡️ Security Considerations

### Production Deployment

1. **Change default credentials**
   - Update JWT_SECRET to a strong, unique value
   - Use environment-specific configuration

2. **Database security**
   - Enable MongoDB authentication
   - Use connection string with credentials
   - Restrict database access

3. **HTTPS**
   - Use SSL/TLS certificates
   - Configure secure headers
   - Enable HSTS

4. **Rate limiting**
   - Adjust rate limits for production
   - Monitor API usage

5. **CORS configuration**
   - Update allowed origins for production
   - Restrict to specific domains

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-long-and-very-random-secret-key
JWT_EXPIRE=7d
```

## 🚀 Deployment

### Heroku
1. Create a Heroku app
2. Add MongoDB add-on
3. Set environment variables
4. Deploy using Git

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### VPS/Cloud
1. Set up Node.js and MongoDB
2. Configure nginx as reverse proxy
3. Use PM2 for process management
4. Set up SSL certificates

## 🧪 Testing

```bash
# Run backend tests (when implemented)
npm test

# Run linting
npm run lint
npm run lint:fix
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- Complete authentication system
- Book management
- User management
- Transaction handling
- Modern UI/UX

---

**Built with ❤️ for modern library management** 