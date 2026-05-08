import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Bootstraps the database connection.
 * If a MONGODB_URI is provided in the environment (e.g., Production), it connects to the external cluster.
 * Otherwise, it provisions a local in-memory MongoDB instance for seamless zero-config local development.
 */
export const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  try {
    if (!uri) {
      console.log("⚠️ No MongoDB URI provided. Starting in-memory MongoDB server...");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected to ${uri.includes('memory') ? 'In-Memory Server' : 'External Cluster'}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    
    // If the error looks like a connection failure to an external cluster, try in-memory fallback
    if (uri && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
      console.log("🔄 Attempting fallback to In-Memory MongoDB for local development stability...");
      try {
        const mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        await mongoose.connect(fallbackUri);
        console.log("✅ Fallback Successful: Connected to In-Memory MongoDB Server.");
      } catch (fallbackErr) {
        console.error("❌ Fatal: Fallback failed. Application exiting.", fallbackErr);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};
