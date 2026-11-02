import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the Express MongoDB API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  connectDB()
    .then(() => {
      console.log("Database connected successfully");
      console.log(`Server running on port http://localhost:${PORT}`);
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error);
    });
});
