import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: String,
  },
  { timestamps: true }
);

export default model("Review", reviewSchema);
