import User from '../models/User.js';

export const addToWatchlist = async (req, res) => {
  const userId = req.user.id;
  const { movieId, title, poster } = req.body;

  try {
    const user = await User.findById(userId);
    const exists = user.watchlist.find(item => item.movieId === movieId);

    if (exists) {
      return res.status(400).json({ msg: 'Movie already in watchlist' });
    }

    user.watchlist.push({ movieId, title, poster });
    await user.save();

    res.status(200).json({ msg: 'Added to watchlist', watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.params;

  try {
    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(item => item.movieId !== movieId);
    await user.save();

    res.status(200).json({ msg: 'Removed from watchlist', watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
