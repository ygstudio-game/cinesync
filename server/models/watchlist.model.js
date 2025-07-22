import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String, // TMDB ID or internal movie ID
    required: true
  },
  title: String,
  poster: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
