const mongoose = require('mongoose');

/**
 * connectDB
 *
 * Establishes a connection to MongoDB Atlas using the URI stored in .env
 *
 * Why a separate file?
 * - Keeps server.js clean — it just calls connectDB(), nothing more
 * - Easier to test the connection in isolation
 * - Single place to update if we ever change database providers
 *
 * Why async/await?
 * - mongoose.connect() returns a Promise
 * - We await it so we know the result before the server starts
 * - If it fails, we exit the process — no point running an API with no database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);

    // Exit the process with failure code
    // Code 1 means "exited with an error"
    // This prevents the server from running in a broken state
    process.exit(1);
  }
};

module.exports = connectDB;
