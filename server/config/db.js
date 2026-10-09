import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ridesync';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[RideSync DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[RideSync DB] MongoDB Connection Error: ${error.message}`);
    console.info(`[RideSync DB] Note: Set MONGODB_URI in .env to connect to MongoDB Atlas or ensure local MongoDB is active.`);
    throw error;
  }
}
