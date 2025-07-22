import express from 'express';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';
import authMiddleware from '../middleware/auth.Middleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', addToWatchlist);
router.get('/', getWatchlist);
router.delete('/:movieId', removeFromWatchlist);

export default router;
