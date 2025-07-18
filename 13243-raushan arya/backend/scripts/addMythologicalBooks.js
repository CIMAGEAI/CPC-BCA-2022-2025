const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mythologicalBooks = [
  {
    title: "The Iliad",
    author: "Homer",
    isbn: "9780140445923",
    genre: "Mythology",
    description: "An epic poem about the Trojan War, featuring heroes like Achilles, Hector, and Odysseus. One of the oldest works of Western literature.",
    publisher: "Penguin Classics",
    publicationYear: 2003,
    totalCopies: 5,
    availableCopies: 5,
    qrCode: "ILIAD001",
    tags: ["Greek Mythology", "Epic Poetry", "Classic"],
    rating: { average: 4.5, count: 12 }
  },
  {
    title: "The Odyssey",
    author: "Homer",
    isbn: "9780140268867",
    genre: "Mythology",
    description: "The epic journey of Odysseus as he tries to return home after the Trojan War, encountering gods, monsters, and magical creatures.",
    publisher: "Penguin Classics",
    publicationYear: 1999,
    totalCopies: 4,
    availableCopies: 4,
    qrCode: "ODYSSEY001",
    tags: ["Greek Mythology", "Epic Poetry", "Adventure"],
    rating: { average: 4.7, count: 15 }
  },
  {
    title: "Mythology: Timeless Tales of Gods and Heroes",
    author: "Edith Hamilton",
    isbn: "9780316223331",
    genre: "Mythology",
    description: "A comprehensive collection of Greek, Roman, and Norse myths, beautifully retold with detailed explanations of the gods and heroes.",
    publisher: "Little, Brown and Company",
    publicationYear: 2017,
    totalCopies: 6,
    availableCopies: 6,
    qrCode: "HAMILTON001",
    tags: ["Greek Mythology", "Roman Mythology", "Norse Mythology"],
    rating: { average: 4.8, count: 20 }
  },
  {
    title: "Norse Mythology",
    author: "Neil Gaiman",
    isbn: "9780393609097",
    genre: "Mythology",
    description: "A masterful retelling of Norse myths featuring Odin, Thor, Loki, and the other gods of Asgard, written by the acclaimed author Neil Gaiman.",
    publisher: "W. W. Norton & Company",
    publicationYear: 2017,
    totalCopies: 5,
    availableCopies: 5,
    qrCode: "GAIMAN001",
    tags: ["Norse Mythology", "Fantasy", "Modern Retelling"],
    rating: { average: 4.6, count: 18 }
  },
  {
    title: "The Egyptian Book of the Dead",
    author: "E. A. Wallis Budge",
    isbn: "9780486218663",
    genre: "Mythology",
    description: "Ancient Egyptian funerary text containing spells and prayers to help the deceased navigate the afterlife and achieve immortality.",
    publisher: "Dover Publications",
    publicationYear: 1967,
    totalCopies: 3,
    availableCopies: 3,
    qrCode: "EGYPT001",
    tags: ["Egyptian Mythology", "Ancient Texts", "Religious"],
    rating: { average: 4.2, count: 8 }
  },
  {
    title: "The Ramayana",
    author: "Valmiki",
    isbn: "9780140447446",
    genre: "Mythology",
    description: "One of the two major Sanskrit epics of ancient India, telling the story of Rama, Sita, and Hanuman in their battle against evil.",
    publisher: "Penguin Classics",
    publicationYear: 2006,
    totalCopies: 4,
    availableCopies: 4,
    qrCode: "RAMAYANA001",
    tags: ["Indian Mythology", "Hinduism", "Epic Poetry"],
    rating: { average: 4.4, count: 11 }
  },
  {
    title: "The Mahabharata",
    author: "Vyasa",
    isbn: "9780140446814",
    genre: "Mythology",
    description: "The longest epic poem ever written, containing the Bhagavad Gita and stories of the Pandavas and Kauravas in the great war.",
    publisher: "Penguin Classics",
    publicationYear: 2009,
    totalCopies: 3,
    availableCopies: 3,
    qrCode: "MAHABHARATA001",
    tags: ["Indian Mythology", "Hinduism", "Philosophy"],
    rating: { average: 4.3, count: 9 }
  },
  {
    title: "Chinese Mythology: An Introduction",
    author: "Anne Birrell",
    isbn: "9780801854282",
    genre: "Mythology",
    description: "A comprehensive introduction to Chinese mythology, covering creation myths, gods, goddesses, and legendary heroes from ancient China.",
    publisher: "Johns Hopkins University Press",
    publicationYear: 1999,
    totalCopies: 4,
    availableCopies: 4,
    qrCode: "CHINESE001",
    tags: ["Chinese Mythology", "Ancient China", "Cultural Studies"],
    rating: { average: 4.1, count: 7 }
  },
  {
    title: "Celtic Myths and Legends",
    author: "Peter Berresford Ellis",
    isbn: "9780785814534",
    genre: "Mythology",
    description: "A collection of Celtic myths from Ireland, Scotland, Wales, and Brittany, featuring heroes like Cú Chulainn and the Tuatha Dé Danann.",
    publisher: "Chartwell Books",
    publicationYear: 2002,
    totalCopies: 3,
    availableCopies: 3,
    qrCode: "CELTIC001",
    tags: ["Celtic Mythology", "Irish Folklore", "European Myths"],
    rating: { average: 4.0, count: 6 }
  },
  {
    title: "Japanese Mythology: A to Z",
    author: "Jeremy Roberts",
    isbn: "9781604134353",
    genre: "Mythology",
    description: "An encyclopedia of Japanese mythology covering Shinto gods, Buddhist deities, yokai spirits, and legendary creatures from Japanese folklore.",
    publisher: "Chelsea House",
    publicationYear: 2010,
    totalCopies: 4,
    availableCopies: 4,
    qrCode: "JAPANESE001",
    tags: ["Japanese Mythology", "Shinto", "Yokai"],
    rating: { average: 4.2, count: 8 }
  },
  {
    title: "The Prose Edda",
    author: "Snorri Sturluson",
    isbn: "9780140447552",
    genre: "Mythology",
    description: "A medieval Icelandic manual of poetics containing many stories from Norse mythology, including the creation of the world and Ragnarök.",
    publisher: "Penguin Classics",
    publicationYear: 2005,
    totalCopies: 3,
    availableCopies: 3,
    qrCode: "EDDA001",
    tags: ["Norse Mythology", "Medieval Literature", "Icelandic"],
    rating: { average: 4.3, count: 7 }
  },
  {
    title: "Metamorphoses",
    author: "Ovid",
    isbn: "9780140447897",
    genre: "Mythology",
    description: "A narrative poem in fifteen books describing the creation and history of the world through the lens of Greek and Roman mythology.",
    publisher: "Penguin Classics",
    publicationYear: 2004,
    totalCopies: 4,
    availableCopies: 4,
    qrCode: "OVID001",
    tags: ["Roman Mythology", "Greek Mythology", "Classical Literature"],
    rating: { average: 4.4, count: 10 }
  }
];

async function addMythologicalBooks() {
  try {
    console.log('Adding mythological books to the database...');
    
    for (const bookData of mythologicalBooks) {
      // Check if book already exists
      const existingBook = await Book.findOne({ isbn: bookData.isbn });
      if (existingBook) {
        console.log(`Book "${bookData.title}" already exists, skipping...`);
        continue;
      }

      // Create new book
      const book = new Book({
        ...bookData,
        location: bookData.location || { section: 'A', row: '1', shelf: 'M1' },
        addedBy: '507f1f77bcf86cd799439011', // Placeholder admin user ID
        status: 'active'
      });

      await book.save();
      console.log(`Added: ${bookData.title} by ${bookData.author}`);
    }

    console.log('Mythological books added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding mythological books:', error);
    process.exit(1);
  }
}

// Run the script
addMythologicalBooks(); 