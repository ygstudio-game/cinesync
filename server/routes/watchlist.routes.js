import express from 'express';
import { addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', verifyToken, addToWatchlist);
router.delete('/remove/:movieId', verifyToken, removeFromWatchlist);

export default router;
