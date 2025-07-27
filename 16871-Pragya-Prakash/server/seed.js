const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parampara-foods', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleCategories = [
  {
    name: 'Traditional Snacks',
    slug: 'traditional-snacks',
    description: 'Authentic traditional Indian snacks and savories',
    icon: '🥨',
    color: '#F59E0B',
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: 'Pickles & Chutneys',
    slug: 'pickles-chutneys',
    description: 'Spicy and tangy pickles and chutneys',
    icon: '🥒',
    color: '#EF4444',
    isFeatured: true,
    sortOrder: 2
  },
  {
    name: 'Sweets & Desserts',
    slug: 'sweets-desserts',
    description: 'Traditional Indian sweets and desserts',
    icon: '🍬',
    color: '#EC4899',
    isFeatured: true,
    sortOrder: 3
  }
];

const sampleProducts = [
  {
    name: "Mango Pickle (Aam Ka Achar)",
    description: "Traditional spicy mango pickle made with raw mangoes, mustard oil, and aromatic spices. Perfect accompaniment with rice, roti, or any Indian meal.",
    shortDescription: "Spicy traditional mango pickle with authentic flavors",
    price: 180,
    comparePrice: 220,
    stock: 50,
    sku: "MP001",
    weight: { value: 500, unit: 'g' },
    ingredients: ["Raw Mango", "Mustard Oil", "Red Chili Powder", "Turmeric", "Salt", "Fenugreek Seeds", "Fennel Seeds"],
    allergens: [],
    dietaryInfo: ["vegetarian", "vegan"],
    origin: {
      region: "North India",
      state: "Punjab",
      country: "India"
    },
    preparationTime: 0,
    shelfLife: { value: 12, unit: 'months' },
    storageInstructions: "Store in a cool, dry place. Keep refrigerated after opening.",
    cookingInstructions: "Ready to eat. Serve as accompaniment with meals.",
    tags: ["pickle", "mango", "spicy", "traditional"],
    isFeatured: true,
    isBestSeller: true,
    mainImage: {
      url: "/assets/mangoPickle.jpg",
      public_id: "mango-pickle"
    },
    images: [
      {
        url: "/assets/mangoPickle.jpg",
        public_id: "mango-pickle-1"
      }
    ]
  },
  {
    name: "Nimki (Namak Para)",
    description: "Crispy diamond-shaped savory snacks made with refined flour, ghee, and aromatic spices. A perfect tea-time snack that's crunchy and flavorful.",
    shortDescription: "Crispy diamond-shaped savory tea-time snacks",
    price: 120,
    comparePrice: 150,
    stock: 75,
    sku: "NK001",
    weight: { value: 250, unit: 'g' },
    ingredients: ["Refined Flour", "Ghee", "Cumin Seeds", "Black Pepper", "Salt", "Ajwain"],
    allergens: ["wheat", "gluten"],
    dietaryInfo: ["vegetarian"],
    origin: {
      region: "North India",
      state: "Uttar Pradesh",
      country: "India"
    },
    preparationTime: 0,
    shelfLife: { value: 3, unit: 'months' },
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    cookingInstructions: "Ready to eat. Perfect with tea or coffee.",
    tags: ["snacks", "nimki", "savory", "tea-time"],
    isFeatured: true,
    isNewArrival: true,
    mainImage: {
      url: "/assets/nimki.jpg",
      public_id: "nimki"
    },
    images: [
      {
        url: "/assets/nimki.jpg",
        public_id: "nimki-1"
      }
    ]
  },
  {
    name: "Thekua (Khajuria)",
    description: "Traditional sweet cookies made with wheat flour, jaggery, and ghee. These crispy, golden-brown cookies are flavored with cardamom and fennel seeds.",
    shortDescription: "Traditional sweet cookies with jaggery and aromatic spices",
    price: 160,
    comparePrice: 200,
    stock: 60,
    sku: "TK001",
    weight: { value: 300, unit: 'g' },
    ingredients: ["Wheat Flour", "Jaggery", "Ghee", "Cardamom", "Fennel Seeds", "Coconut"],
    allergens: ["wheat", "gluten"],
    dietaryInfo: ["vegetarian"],
    origin: {
      region: "East India",
      state: "Bihar",
      country: "India"
    },
    preparationTime: 0,
    shelfLife: { value: 2, unit: 'months' },
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    cookingInstructions: "Ready to eat. Perfect with tea or as dessert.",
    tags: ["sweets", "thekua", "jaggery", "traditional"],
    isFeatured: true,
    isBestSeller: true,
    mainImage: {
      url: "/assets/thekua.jpg",
      public_id: "thekua"
    },
    images: [
      {
        url: "/assets/thekua.jpg",
        public_id: "thekua-1"
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@parampara.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@parampara.com',
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210',
        address: {
          street: '123 Admin Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      });
      console.log('Created admin user');
    }

    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`Created ${createdCategories.length} categories`);

    // Map products to categories
    const categoryMap = {
      'pickle': createdCategories.find(c => c.slug === 'pickles-chutneys'),
      'snacks': createdCategories.find(c => c.slug === 'traditional-snacks'),
      'sweets': createdCategories.find(c => c.slug === 'sweets-desserts')
    };

    // Add category and vendor to each product
    const productsWithRelations = sampleProducts.map(product => {
      let category = categoryMap['snacks']; // default
      
      if (product.tags.includes('pickle')) {
        category = categoryMap['pickle'];
      } else if (product.tags.includes('sweets') || product.tags.includes('dessert')) {
        category = categoryMap['sweets'];
      }

      return {
        ...product,
        category: category._id,
        vendor: adminUser._id
      };
    });

    // Insert products
    const createdProducts = await Product.insertMany(productsWithRelations);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Database seeded successfully!');
    console.log('\nAdmin Login Details:');
    console.log('Email: admin@parampara.com');
    console.log('Password: admin123');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Login to admin panel');
    console.log('3. View products in the store');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
