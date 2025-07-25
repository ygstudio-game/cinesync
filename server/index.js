import app from "./app.js";
import  connectDB  from "./db/index.js";
import dotenv from "dotenv";
 

// Load environment variables from the .env file
// Ensure this is done before using any environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

connectDB(MONGO_URI,DB_NAME)
  .then(() => {
    console.log("Database connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    app.get("/", (req, res) => {
      res.send("Welcome to the API");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  });
