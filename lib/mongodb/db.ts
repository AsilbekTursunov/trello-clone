import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGO_URI!, {
    serverSelectionTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    bufferCommands: true,
  });
};
