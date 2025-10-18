import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    console.log("🧠 Mongo URI:", process.env.MONGO_URI);

    console.log("🚀 Trying to connect to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};
