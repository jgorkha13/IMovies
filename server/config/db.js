const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Note: Could not connect to MongoDB at "${mongoUri}" (${error.message}).`);
    console.log(`[Database] Active: Running with built-in memory store so the app works out of the box!`);
    console.log(`[Database] Tip: To connect to MongoDB Atlas or local MongoDB, update MONGODB_URI in your .env file.`);
    return null;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
