import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    releaseYear: Number,
    genre: [String],
    posterUrl: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

export default model("Movie", movieSchema);
