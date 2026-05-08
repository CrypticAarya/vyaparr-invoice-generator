import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  const mongooseOptions = {
    autoIndex: !isProduction, // Disable auto-indexing in production for performance
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    if (!uri && !isProduction) {
      console.log("⚠️ No MongoDB URI. Provisioning in-memory dev database...");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    if (!uri && isProduction) {
      throw new Error("FATAL: MONGODB_URI is required in production.");
    }

    await mongoose.connect(uri, mongooseOptions);
    
    mongoose.connection.on('error', err => {
      console.error(`❌ MongoDB Runtime Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Reconnecting...');
    });

    console.log(`✅ MongoDB Connected: ${uri.includes('memory') ? 'Dev Memory' : 'Production Cluster'}`);
  } catch (err) {
    console.error("❌ MongoDB Initial Connection Failure:", err.message);
    
    if (!isProduction) {
      console.log("🔄 Retrying with local in-memory fallback...");
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    } else {
      process.exit(1);
    }
  }
};
