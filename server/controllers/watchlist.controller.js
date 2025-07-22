import User from '../models/user.model.js';

export const addToWatchlist = async (req, res) => {
  const { movieId, title, poster } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const exists = user.watchlist.find(item => item.movieId === movieId);
    if (exists) return res.status(409).json({ msg: "Already in watchlist" });

    user.watchlist.push({ movieId, title, poster });
    await user.save();

    res.status(201).json(user.watchlist);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const { movieId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const prevLength = user.watchlist.length;
    user.watchlist = user.watchlist.filter(item => item.movieId !== movieId);

    if (user.watchlist.length === prevLength)
      return res.status(404).json({ msg: "Movie not found in watchlist" });

    await user.save();
    res.json({ msg: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
