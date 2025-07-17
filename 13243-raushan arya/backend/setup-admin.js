const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './config.env' });

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@libratech.com',
      password: 'Admin@123',
      role: 'admin',
      department: 'Administration',
      phone: '+1234567890',
      address: 'Library Administration',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@libratech.com');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 