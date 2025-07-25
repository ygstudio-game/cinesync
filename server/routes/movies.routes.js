import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
} from "../controllers/movies.controller.js";
const router = Router();

router.route("/popular").get(getAllMovies);
router.route("/search").get(getMovieById);
router.route("/:id").get();
router.route("/rate/:id").post();
