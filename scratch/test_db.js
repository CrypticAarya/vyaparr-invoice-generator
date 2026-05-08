const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function checkConnection() {
  console.log('Attempting to connect to MongoDB...');
  console.log('URI:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB Connection Successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(err.message);
    process.exit(1);
  }
}

checkConnection();
