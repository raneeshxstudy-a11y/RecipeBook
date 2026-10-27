import mongoose from "mongoose";

export const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: categories },
    ingredients: { type: String, required: true, trim: true },
    steps: { type: String, required: true, trim: true },
    cookingTime: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);