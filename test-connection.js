const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
  });
