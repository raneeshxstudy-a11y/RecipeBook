import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import recipeRoutes from "./routes/recipes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/recipes", recipeRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const backendDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(backendDir, "../frontend/dist");
app.use(express.static(frontendDist));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Server error. Please try again." });
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`COOKnCHILL running on port ${port}`);
  });
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
}
