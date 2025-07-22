import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // ✅ now unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: [
      {
        movieId: String,
        title: String,
        poster: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
