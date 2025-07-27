import express from "express";
import {
  searchTitles,
  getTitleDetails,
  batchGetTitles,
  getTitleEpisodes,
  getCertifications,
  getTitleVideos
} from "../controllers/movies.controller.js";
import authMiddleware from "../middleware/auth.Middleware.js";

const router = express.Router();

// Public endpoints (no auth required)
router.get("/search", searchTitles);
router.get("/:titleId", getTitleDetails);
router.get("/:titleId/episodes", getTitleEpisodes);
router.get("/:titleId/certificates", getCertifications);
router.get("/:titleId/videos", getTitleVideos);
router.post("/batch", batchGetTitles);

export default router;