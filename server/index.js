import app from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 5000;

// Load environment variables from the .env file
// Ensure this is done before using any environment variables
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    console.log("Database connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    app.get("/", (req, res) => {
      res.send("Welcome to the API");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  });
