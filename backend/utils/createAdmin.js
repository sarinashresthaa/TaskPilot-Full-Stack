 
// Admin account creation utility for initial system setup
const User = require('../models/User');

const createAdminAccount = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin account already exists');
      return;
    }

    // Create default admin account
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@taskpilot.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: process.env.ADMIN_NAME || 'System Administrator',
      role: 'admin',
      department: 'Administration',
      isActive: true
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('🎉 Admin account created successfully');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`👤 Username: ${adminData.username}`);
    console.log('⚠️  Please change the default password after first login');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    // Don't exit the process, just log the error
  }
};

module.exports = { createAdminAccount };