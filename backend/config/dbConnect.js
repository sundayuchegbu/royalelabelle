import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const DB_URI =
      process.env.NODE_ENV === "production"
        ? process.env.DB_URL
        : process.env.DB_URI;

    if (!DB_URI) {
      throw new Error("MongoDB connection string is missing.");
    }

    // Print the URI without exposing the password
    console.log("Using DB URI:", DB_URI.replace(/:(.*?)@/, ":******@"));

    console.log("Connecting to MongoDB...");

    await mongoose.connect(DB_URI);

    console.log("✅ MongoDB Connected!");
    console.log("Host:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Cause:", error.cause);
    console.error(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose Error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 Mongoose disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
