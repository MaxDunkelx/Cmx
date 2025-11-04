import { db } from './localDb.js';

// Check if we should use local database
const useLocalDB = process.env.MONGODB_URI === 'local';

if (useLocalDB) {
  // Use local JSON database
  console.log('📁 Using local JSON database');
  global.localDb = db;
  console.log('✅ Local database initialized');
} else {
  // Use MongoDB (original setup)
  import mongoose from 'mongoose';

  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  };

  connectDB();
}

export default function connectDB() {
  // Already handled above
}
