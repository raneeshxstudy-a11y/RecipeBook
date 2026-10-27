import { Router } from "express";
import mongoose from "mongoose";
import Recipe, { categories } from "../models/Recipe.js";

const router = Router();

function validate(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const ingredients =
    typeof body.ingredients === "string" ? body.ingredients.trim() : "";
  const steps = typeof body.steps === "string" ? body.steps.trim() : "";
  const category = body.category;
  const cookingTime = Number(body.cookingTime);

  if (
    !name ||
    !ingredients ||
    !steps ||
    !categories.includes(category) ||
    !Number.isInteger(cookingTime) ||
    cookingTime < 1
  ) {
    return null;
  }

  return { name, category, ingredients, steps, cookingTime };
}

function checkId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid recipe ID." });
  }
  next();
}

router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", checkId, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = validate(req.body);
    if (!data) {
      return res.status(400).json({ message: "Please enter valid values in every field." });
    }
    const recipe = await Recipe.create(data);
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", checkId, async (req, res, next) => {
  try {
    const data = validate(req.body);
    if (!data) {
      return res.status(400).json({ message: "Please enter valid values in every field." });
    }
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", checkId, async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json({ message: "Recipe deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;