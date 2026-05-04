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
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};
