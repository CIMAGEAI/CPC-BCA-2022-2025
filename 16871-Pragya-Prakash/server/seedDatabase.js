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
  },
  {
    name: 'Ready-to-Eat',
    slug: 'ready-to-eat',
    description: 'Convenient ready-to-eat traditional foods',
    icon: '🍽️',
    color: '#10B981',
    sortOrder: 4
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
    nutritionalInfo: {
      calories: 120,
      protein: 2,
      carbohydrates: 15,
      fat: 8,
      fiber: 3,
      sugar: 10,
      sodium: 800,
      servingSize: "1 tbsp (15g)"
    },
    ingredients: ["Raw Mango", "Mustard Oil", "Red Chili Powder", "Turmeric", "Salt", "Fenugreek Seeds", "Fennel Seeds"],
    allergens: ["none"],
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
    nutritionalInfo: {
      calories: 450,
      protein: 8,
      carbohydrates: 65,
      fat: 18,
      fiber: 2,
      sugar: 2,
      sodium: 600,
      servingSize: "1 cup (30g)"
    },
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
    nutritionalInfo: {
      calories: 380,
      protein: 6,
      carbohydrates: 55,
      fat: 16,
      fiber: 3,
      sugar: 25,
      sodium: 150,
      servingSize: "2 pieces (25g)"
    },
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
  },
  {
    name: "Papad (Papadum)",
    description: "Thin, crispy flatbreads made from lentil flour and spices. These are typically roasted or fried and served as an accompaniment with meals.",
    shortDescription: "Crispy lentil flatbreads perfect with meals",
    price: 90,
    comparePrice: 120,
    stock: 100,
    sku: "PD001",
    weight: { value: 200, unit: 'g' },
    nutritionalInfo: {
      calories: 280,
      protein: 12,
      carbohydrates: 45,
      fat: 8,
      fiber: 8,
      sugar: 2,
      sodium: 400,
      servingSize: "2 pieces (20g)"
    },
    ingredients: ["Urad Dal Flour", "Salt", "Black Pepper", "Cumin Seeds", "Asafoetida"],
    allergens: ["none"],
    dietaryInfo: ["vegetarian", "vegan", "gluten-free"],
    origin: {
      region: "West India",
      state: "Gujarat",
      country: "India"
    },
    preparationTime: 5,
    shelfLife: { value: 6, unit: 'months' },
    storageInstructions: "Store in a cool, dry place. Keep away from moisture.",
    cookingInstructions: "Roast on low flame or deep fry until crispy and golden brown.",
    tags: ["papad", "lentil", "crispy", "accompaniment"],
    isOnSale: true,
    salePercentage: 25,
    mainImage: {
      url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop",
      public_id: "papad"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop",
        public_id: "papad-1"
      }
    ]
  },
  {
    name: "Murukku (Chakli)",
    description: "Spiral-shaped crispy snacks made from rice flour and urad dal flour. These crunchy snacks are seasoned with sesame seeds and spices.",
    shortDescription: "Spiral-shaped crispy rice flour snacks",
    price: 140,
    comparePrice: 180,
    stock: 80,
    sku: "MR001",
    weight: { value: 250, unit: 'g' },
    nutritionalInfo: {
      calories: 420,
      protein: 10,
      carbohydrates: 70,
      fat: 12,
      fiber: 4,
      sugar: 3,
      sodium: 500,
      servingSize: "1 cup (35g)"
    },
    ingredients: ["Rice Flour", "Urad Dal Flour", "Sesame Seeds", "Cumin Seeds", "Salt", "Red Chili Powder"],
    allergens: ["none"],
    dietaryInfo: ["vegetarian", "vegan", "gluten-free"],
    origin: {
      region: "South India",
      state: "Tamil Nadu",
      country: "India"
    },
    preparationTime: 0,
    shelfLife: { value: 3, unit: 'months' },
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    cookingInstructions: "Ready to eat. Perfect with tea or coffee.",
    tags: ["murukku", "chakli", "rice", "crispy"],
    isNewArrival: true,
    mainImage: {
      url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop",
      public_id: "murukku"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop",
        public_id: "murukku-1"
      }
    ]
  },
  {
    name: "Gulab Jamun Mix",
    description: "Ready-to-make mix for soft, spongy gulab jamuns. These sweet balls are soaked in sugar syrup and flavored with cardamom and rose water.",
    shortDescription: "Ready-to-make mix for soft, spongy gulab jamuns",
    price: 200,
    comparePrice: 250,
    stock: 40,
    sku: "GJ001",
    weight: { value: 400, unit: 'g' },
    nutritionalInfo: {
      calories: 320,
      protein: 4,
      carbohydrates: 60,
      fat: 8,
      fiber: 1,
      sugar: 45,
      sodium: 100,
      servingSize: "2 pieces (30g)"
    },
    ingredients: ["Khoya", "Refined Flour", "Baking Soda", "Cardamom", "Rose Water", "Sugar"],
    allergens: ["wheat", "gluten", "dairy"],
    dietaryInfo: ["vegetarian"],
    origin: {
      region: "North India",
      state: "Delhi",
      country: "India"
    },
    preparationTime: 30,
    shelfLife: { value: 6, unit: 'months' },
    storageInstructions: "Store in a cool, dry place. Keep away from moisture.",
    cookingInstructions: "Mix with water, shape into balls, deep fry until golden, soak in sugar syrup.",
    tags: ["gulab jamun", "sweets", "dessert", "traditional"],
    isFeatured: true,
    mainImage: {
      url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
      public_id: "gulab-jamun"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
        public_id: "gulab-jamun-1"
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
      'sweets': createdCategories.find(c => c.slug === 'sweets-desserts'),
      'ready': createdCategories.find(c => c.slug === 'ready-to-eat')
    };

    // Add category and vendor to each product
    const productsWithRelations = sampleProducts.map(product => {
      let category = categoryMap['snacks']; // default
      
      if (product.tags.includes('pickle')) {
        category = categoryMap['pickle'];
      } else if (product.tags.includes('sweets') || product.tags.includes('dessert')) {
        category = categoryMap['sweets'];
      } else if (product.preparationTime > 0) {
        category = categoryMap['ready'];
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

    // Update categories with product counts
    for (const category of createdCategories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, {
        'metadata.productCount': productCount
      });
    }

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