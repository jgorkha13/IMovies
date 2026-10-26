const mongoose = require('mongoose');

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Primary MongoDB connection failed (${error.message}).`);

    // In development or when requested, fall back to in-memory MongoDB
    if (process.env.NODE_ENV !== 'production' || process.env.USE_MEMORY_DB === 'true') {
      try {
        console.log('[Database] Starting in-memory fallback MongoDB instance...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[Database] In-memory MongoDB Connected at: ${memUri}`);
        return conn;
      } catch (memErr) {
        console.warn('[Database] In-memory fallback could not be initialized:', memErr.message);
      }
    }
    console.warn('[Database] Please provide a valid MONGODB_URI in your .env or platform config.');
  }
};

module.exports = connectDB;
