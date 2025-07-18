const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
require('dotenv').config();

// Sample books data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Fiction",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    publisher: "Scribner",
    publicationYear: 1925,
    edition: "1st Edition",
    pages: 180,
    language: "English",
    totalCopies: 5,
    availableCopies: 3,
    location: {
      shelf: "A1",
      row: "1",
      section: "Classic Fiction"
    },
    qrCode: "LT-BK-001",
    tags: ["classic", "american literature", "romance"],
    status: "active"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780446310789",
    genre: "Fiction",
    description: "The story of young Scout Finch and her father Atticus in a racially divided Alabama town.",
    publisher: "Grand Central Publishing",
    publicationYear: 1960,
    edition: "1st Edition",
    pages: 281,
    language: "English",
    totalCopies: 4,
    availableCopies: 2,
    location: {
      shelf: "A2",
      row: "1",
      section: "Classic Fiction"
    },
    qrCode: "LT-BK-002",
    tags: ["classic", "social justice", "coming of age"],
    status: "active"
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Science Fiction",
    description: "A dystopian novel about totalitarianism and surveillance society.",
    publisher: "Signet Classic",
    publicationYear: 1949,
    edition: "1st Edition",
    pages: 328,
    language: "English",
    totalCopies: 6,
    availableCopies: 4,
    location: {
      shelf: "B1",
      row: "2",
      section: "Science Fiction"
    },
    qrCode: "LT-BK-003",
    tags: ["dystopian", "political", "surveillance"],
    status: "active"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    genre: "Romance",
    description: "The story of Elizabeth Bennet and Mr. Darcy in Georgian-era England.",
    publisher: "Penguin Classics",
    publicationYear: 1813,
    edition: "1st Edition",
    pages: 432,
    language: "English",
    totalCopies: 3,
    availableCopies: 1,
    location: {
      shelf: "C1",
      row: "3",
      section: "Romance"
    },
    qrCode: "LT-BK-004",
    tags: ["romance", "classic", "british literature"],
    status: "active"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928241",
    genre: "Fantasy",
    description: "The adventure of Bilbo Baggins, a hobbit who embarks on a quest with thirteen dwarves.",
    publisher: "Houghton Mifflin Harcourt",
    publicationYear: 1937,
    edition: "1st Edition",
    pages: 366,
    language: "English",
    totalCopies: 7,
    availableCopies: 5,
    location: {
      shelf: "D1",
      row: "4",
      section: "Fantasy"
    },
    qrCode: "LT-BK-005",
    tags: ["fantasy", "adventure", "middle-earth"],
    status: "active"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    genre: "Fiction",
    description: "The story of Holden Caulfield, a teenager navigating the complexities of growing up.",
    publisher: "Little, Brown and Company",
    publicationYear: 1951,
    edition: "1st Edition",
    pages: 277,
    language: "English",
    totalCopies: 4,
    availableCopies: 2,
    location: {
      shelf: "A3",
      row: "1",
      section: "Classic Fiction"
    },
    qrCode: "LT-BK-006",
    tags: ["coming of age", "american literature", "teenage angst"],
    status: "active"
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    isbn: "9780399501487",
    genre: "Fiction",
    description: "A group of British boys stranded on an uninhabited island and their attempt to govern themselves.",
    publisher: "Penguin Books",
    publicationYear: 1954,
    edition: "1st Edition",
    pages: 224,
    language: "English",
    totalCopies: 5,
    availableCopies: 3,
    location: {
      shelf: "A4",
      row: "1",
      section: "Classic Fiction"
    },
    qrCode: "LT-BK-007",
    tags: ["allegory", "survival", "human nature"],
    status: "active"
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    isbn: "9780451526342",
    genre: "Fiction",
    description: "An allegorical novella about farm animals who rebel against their human farmer.",
    publisher: "Signet",
    publicationYear: 1945,
    edition: "1st Edition",
    pages: 140,
    language: "English",
    totalCopies: 6,
    availableCopies: 4,
    location: {
      shelf: "A5",
      row: "1",
      section: "Classic Fiction"
    },
    qrCode: "LT-BK-008",
    tags: ["allegory", "political satire", "revolution"],
    status: "active"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    genre: "Fiction",
    description: "A novel about a young Andalusian shepherd who dreams of finding a worldly treasure.",
    publisher: "HarperOne",
    publicationYear: 1988,
    edition: "1st Edition",
    pages: 208,
    language: "English",
    totalCopies: 8,
    availableCopies: 6,
    location: {
      shelf: "E1",
      row: "5",
      section: "Modern Fiction"
    },
    qrCode: "LT-BK-009",
    tags: ["philosophical", "adventure", "self-discovery"],
    status: "active"
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    isbn: "9781594631931",
    genre: "Fiction",
    description: "The story of Amir, a young boy from Kabul, and his journey to redemption.",
    publisher: "Riverhead Books",
    publicationYear: 2003,
    edition: "1st Edition",
    pages: 371,
    language: "English",
    totalCopies: 5,
    availableCopies: 3,
    location: {
      shelf: "E2",
      row: "5",
      section: "Modern Fiction"
    },
    qrCode: "LT-BK-010",
    tags: ["afghanistan", "redemption", "friendship"],
    status: "active"
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    genre: "Science",
    description: "A popular science book about cosmology and the universe.",
    publisher: "Bantam Books",
    publicationYear: 1988,
    edition: "1st Edition",
    pages: 256,
    language: "English",
    totalCopies: 4,
    availableCopies: 2,
    location: {
      shelf: "F1",
      row: "6",
      section: "Science"
    },
    qrCode: "LT-BK-011",
    tags: ["cosmology", "physics", "universe"],
    status: "active"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    genre: "History",
    description: "A book about the history of human evolution and civilization.",
    publisher: "Harper",
    publicationYear: 2014,
    edition: "1st Edition",
    pages: 443,
    language: "English",
    totalCopies: 6,
    availableCopies: 4,
    location: {
      shelf: "G1",
      row: "7",
      section: "History"
    },
    qrCode: "LT-BK-012",
    tags: ["anthropology", "evolution", "civilization"],
    status: "active"
  }
];

async function setupBooks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user to set as addedBy
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please run setup-admin.js first.');
      process.exit(1);
    }

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Add sample books with admin as addedBy
    const booksWithUser = sampleBooks.map(book => ({
      ...book,
      addedBy: adminUser._id
    }));

    const createdBooks = await Book.insertMany(booksWithUser);
    console.log(`Successfully added ${createdBooks.length} books to the database`);

    // Display added books
    console.log('\nAdded books:');
    createdBooks.forEach(book => {
      console.log(`- ${book.title} by ${book.author} (ISBN: ${book.isbn})`);
    });

    console.log('\nBooks setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error setting up books:', error);
    process.exit(1);
  }
}

// Run the setup
setupBooks(); 