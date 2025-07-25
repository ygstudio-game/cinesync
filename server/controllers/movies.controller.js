import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Movie } from "../models/Movie.model.js";

const getAllMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(new ApiResponse("Movies fetched", 200, { movies }));
  } catch (err) {
    res
      .status(500)
      .json(new ApiError("Failed to fetch movies", 500, err.message));
  }
});

const getMovieById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json(new ApiError("Movie not found", 404));
    }

    res.status(200).json(new ApiResponse("Movie fetched", 200, { movie }));
  } catch {
    res
      .status(500)
      .json(new ApiError("Failed to fetch movie", 500, err.message));
  }
});

const getMovieByTitle = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res
      .status(400)
      .json(new ApiError(400, "Send a name to search for", err.message));
  }

  const movie = await Movie.findBy({ title: title });

  if (!movie) {
    res
      .status(404)
      .json(new ApiError("No movie found with such title", 404, err.message));
  }

  res
    .status(200)
    .json(
      new ApiResponse("Movie fetched with the given title", 200, { movie })
    );
});

const movieReviews = asyncHandler(
  async(req, (res) => {
    //what to do
  })
);
export { getAllMovies, getMovieById, getMovieByTitle, movieReviews };
