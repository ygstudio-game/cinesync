import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import movieRoutes from "./routes/movies.routes.js";
import cookieParser from "cookie-parser"; 

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

//routes for the app
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/movies", movieRoutes);

export default app;
