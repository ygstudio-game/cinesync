import Watchlist from '../models/watchlist.model.js';

export const addToWatchlist = async (req, res) => {
  const { movieId, title, poster } = req.body;

  try {
    const alreadyExists = await Watchlist.findOne({ userId: req.user.id, movieId });
    if (alreadyExists) return res.status(409).json({ msg: "Already in watchlist" });

    const item = await Watchlist.create({
      userId: req.user.id,
      movieId,
      title,
      poster
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const removed = await Watchlist.findOneAndDelete({
      userId: req.user.id,
      movieId: req.params.movieId
    });

    if (!removed) return res.status(404).json({ msg: "Not found" });

    res.json({ msg: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
