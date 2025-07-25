import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  getMovieByTitle,
  movieReviews,
} from "../controllers/movies.controller.js";

const router = Router();

router.route("/popular").get(getAllMovies);
router.route("/search").get(getMovieByTitle);
router.route("/:id").get(getMovieById);
router.route("/rate/:id").post(movieReviews);
