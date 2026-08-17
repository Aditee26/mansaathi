const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI from environment
 * variables. The app intentionally fails fast if the database is
 * unreachable, since nothing useful can happen without it.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
