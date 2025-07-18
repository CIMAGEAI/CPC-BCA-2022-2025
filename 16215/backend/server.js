require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./src/routes/auth');
const bookRoutes = require('./src/routes/books');
const borrowRoutes = require('./src/routes/borrow');
const adminRoutes = require('./src/routes/admin');
const feedbackRoutes = require('./src/routes/feedback');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://amanroy843:y3hPkxhCtc4Wpk8D@cluster0.un1tsg8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('LibraryPro API is running');
});

// Seed sample data (only if database is empty)
const seedData = async () => {
  try {
    const User = require('./src/models/User');
    const Book = require('./src/models/Book');
    const bcrypt = require('bcryptjs');

    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created: admin@gmail.com / admin123');
    }

    // Check if sample books exist
    const booksCount = await Book.countDocuments();
    if (booksCount === 0) {
      const sampleBooks = [
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          category: 'Fiction',
          publishedYear: 1925,
          isbn: '978-0743273565',
          coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
          totalCopies: 3,
          availableCopies: 3
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          category: 'Fiction',
          publishedYear: 1960,
          isbn: '978-0446310789',
          coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
          totalCopies: 2,
          availableCopies: 2
        },
        {
          title: '1984',
          author: 'George Orwell',
          category: 'Science Fiction',
          publishedYear: 1949,
          isbn: '978-0451524935',
          coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
          totalCopies: 4,
          availableCopies: 4
        },
        {
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          category: 'Romance',
          publishedYear: 1813,
          isbn: '978-0141439518',
          coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
          totalCopies: 2,
          availableCopies: 2
        },
        {
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          category: 'Fantasy',
          publishedYear: 1937,
          isbn: '978-0547928241',
          coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          totalCopies: 3,
          availableCopies: 3
        }
      ];

      await Book.insertMany(sampleBooks);
      console.log('Sample books added to database');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

// Run seed data after MongoDB connects
mongoose.connection.once('open', () => {
  seedData();
});

// --- ADMIN USER RESET SCRIPT ---
if (process.env.RESET_ADMIN === 'true') {
  (async () => {
    const User = require('./src/models/User');
    const bcrypt = require('bcryptjs');
    const email = 'admin@gmail.com';
    const password = 'admin123';
    const name = 'Admin User';
    let user = await User.findOne({ email });
    if (user) {
      await User.deleteOne({ email });
      console.log('Old admin user deleted.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name, email, password: hashedPassword, role: 'admin' });
    console.log('Admin user created: ' + email + ' / ' + password);
    process.exit(0);
  })();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 