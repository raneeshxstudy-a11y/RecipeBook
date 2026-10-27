import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import recipeRoutes from "./routes/recipes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/recipes", recipeRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Server error. Please try again." });
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(process.env.PORT || 5000, () => {
    console.log("API running on http://localhost:5000");
  });
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
}