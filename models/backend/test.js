// NOTE: Only for schema checking during dev. Not needed in prod.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");

    // Load all models to check for schema issues
    require("./models/Movie");
    require("./models/User");
    require("./models/Review");
    require("./models/Playlist");

    console.log("✅ All models loaded correctly");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
