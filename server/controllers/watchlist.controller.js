import Watchlist from "../models/WatchList.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId, title, poster } = req.body;

  try {
    const alreadyExists = await Watchlist.findOne({
      userId: req.user.id,
      movieId,
    });
    if (alreadyExists)
      return res
        .status(409)
        .json(new ApiError("Already exists", 409, "Item already in watchlist"));

    const item = await Watchlist.create({
      userId: req.user.id,
      movieId,
      title,
      poster,
    });

    res.status(201).json(
      new ApiResponse("Added to watchlist", 201, {
        item: {
          id: item._id,
          movieId: item.movieId,
          title: item.title,
          poster: item.poster,
        },
      })
    );
  } catch (err) {
    res
      .status(500)
      .json(new ApiError("Failed to add to watchlist", 500, err.message));
  }
});

export const getWatchlist = asyncHandler(async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user.id });
    res.json(new ApiResponse("Watchlist fetched", 200, { items }));
  } catch (err) {
    res
      .status(500)
      .json(new ApiError("Failed to fetch watchlist", 500, err.message));
  }
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  try {
    const removed = await Watchlist.findOneAndDelete({
      userId: req.user.id,
      movieId: req.params.movieId,
    });

    if (!removed)
      return res
        .status(404)
        .json(new ApiError("Not found", 404, "Item not found in watchlist"));

    res.json(
      new ApiResponse("Removed from watchlist", 200, {
        item: {
          id: removed._id,
          movieId: removed.movieId,
          title: removed.title,
          poster: removed.poster,
        },
      })
    );
  } catch (err) {
    res
      .status(500)
      .json(new ApiError("Failed to remove item", 500, err.message));
  }
});
