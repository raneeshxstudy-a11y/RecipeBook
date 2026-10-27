import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  category: "Breakfast",
  ingredients: "",
  steps: "",
  cookingTime: "",
};

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Could not complete the request.");
  }
  return data;
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  async function loadRecipes() {
    const data = await api("/recipes");
    setRecipes(data);
  }

  useEffect(() => {
    loadRecipes()
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  function goToForm() {
    document.getElementById("recipe-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(recipe) {
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: String(recipe.cookingTime),
    });
    setEditingId(recipe._id);
    setFormError("");
    setSelected(null);
    requestAnimationFrame(goToForm);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function saveRecipe(event) {
    event.preventDefault();
    setFormError("");

    const cookingTime = Number(form.cookingTime);
    if (
      !form.name.trim() ||
      !form.ingredients.trim() ||
      !form.steps.trim() ||
      !Number.isInteger(cookingTime) ||
      cookingTime < 1
    ) {
      setFormError("Fill in every field and use a positive whole cooking time.");
      return;
    }

    setSaving(true);
    try {
      await api(editingId ? `/recipes/${editingId}` : "/recipes", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          ingredients: form.ingredients.trim(),
          steps: form.steps.trim(),
          cookingTime,
        }),
      });

      await loadRecipes();
      setMessage(editingId ? "Recipe updated." : "Recipe added.");
      setEditingId(null);
      setForm(emptyForm);
      document.getElementById("saved-recipes")?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function openRecipe(id) {
    try {
      const recipe = await api(`/recipes/${id}`);
      setSelected(recipe);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteRecipe(recipe) {
    if (!window.confirm(`Delete "${recipe.name}"?`)) return;

    try {
      await api(`/recipes/${recipe._id}`, { method: "DELETE" });
      await loadRecipes();
      if (selected?._id === recipe._id) setSelected(null);
      if (editingId === recipe._id) cancelEdit();
      setMessage("Recipe deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          COOK<span className="brand-n">n</span>CHILL
        </span>
        {selected && (
          <button className="back-button" onClick={() => setSelected(null)}>
            ← Back to recipes
          </button>
        )}
      </header>

      {selected ? (
        <main className="details-page">
          <span className="category">{selected.category}</span>
          <h1>{selected.name}</h1>
          <p className="time">Cooking time: {selected.cookingTime} minutes</p>

          <section>
            <h2>Ingredients</h2>
            <p className="recipe-text">{selected.ingredients}</p>
          </section>

          <section>
            <h2>Preparation steps</h2>
            <p className="recipe-text">{selected.steps}</p>
          </section>

          <div className="details-actions">
            <button className="outline-button" onClick={() => startEdit(selected)}>
              Edit Recipe
            </button>
            <button className="delete-button" onClick={() => deleteRecipe(selected)}>
              Delete Recipe
            </button>
          </div>
        </main>
      ) : (
        <main className="page">
          <section className="intro">
            <div className="intro-main">
              <div className="intro-copy">
                <h1>My Recipe Book</h1>
                <p>A simple place to save the recipes you enjoy making.</p>
              </div>
              <img
                className="hero-photo"
                src="/food.png"
                alt="A prepared meal on a plate"
              />
            </div>

            <div className="top-boxes">
              <button className="small-box add-box" onClick={goToForm}>
                + Add Recipe
              </button>

              <div className="small-box recent-box">
                <strong>Recently Added</strong>
                {recipes.length > 0 ? (
                  <button
                    className="recent-link"
                    onClick={() => openRecipe(recipes[0]._id)}
                  >
                    {recipes[0].name} →
                  </button>
                ) : (
                  <span>No recipes saved yet</span>
                )}
              </div>
            </div>
          </section>

          <section id="saved-recipes" className="saved-section">
            <h2>Saved Recipes</h2>
            {message && <p className="message" role="status">{message}</p>}
            {loading && <p>Loading recipes...</p>}
            {!loading && recipes.length === 0 && (
              <p>No recipes yet. Add your first recipe below.</p>
            )}

            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <article className="recipe-card" key={recipe._id}>
                  <button
                    className="card-content"
                    onClick={() => openRecipe(recipe._id)}
                  >
                    <span className="category">{recipe.category}</span>
                    <h3>{recipe.name}</h3>
                    <p className="ingredients-preview">
                      Ingredients: {recipe.ingredients}
                    </p>
                    <p className="time">{recipe.cookingTime} minutes</p>
                    <span className="view-link">View details →</span>
                  </button>
                  <div className="card-actions">
                    <button onClick={() => startEdit(recipe)}>Edit</button>
                    <button onClick={() => deleteRecipe(recipe)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="recipe-form" className="form-section">
            <div className="form-panel">
              <h2>{editingId ? "Edit Recipe" : "Add a Recipe"}</h2>

              <form onSubmit={saveRecipe}>
                <label>
                  Recipe name
                  <input
                    name="name"
                    value={form.name}
                    onChange={changeForm}
                    required
                  />
                </label>

                <label>
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={changeForm}
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snack</option>
                    <option>Dessert</option>
                  </select>
                </label>

                <label>
                  Ingredients
                  <textarea
                    name="ingredients"
                    value={form.ingredients}
                    onChange={changeForm}
                    rows="4"
                    required
                  />
                </label>

                <label>
                  Preparation steps
                  <textarea
                    name="steps"
                    value={form.steps}
                    onChange={changeForm}
                    rows="5"
                    required
                  />
                </label>

                <label>
                  Cooking time (minutes)
                  <input
                    name="cookingTime"
                    type="number"
                    min="1"
                    step="1"
                    value={form.cookingTime}
                    onChange={changeForm}
                    required
                  />
                </label>

                {formError && <p className="error" role="alert">{formError}</p>}

                <div className="form-actions">
                  <button className="save-button" type="submit" disabled={saving}>
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Save Recipe"}
                  </button>
                  {editingId && (
                    <button
                      className="outline-button"
                      type="button"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <aside className="form-note">
              <h3>Good food is worth remembering.</h3>
              <p>
                Save your ingredients and steps here, so your favourite meals
                are easy to make again.
              </p>
            </aside>
          </section>
        </main>
      )}
    </div>
  );
}