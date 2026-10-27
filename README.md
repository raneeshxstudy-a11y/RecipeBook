# COOKnCHILL

COOKnCHILL is a MERN Recipe Book for saving and managing favourite recipes.

## Features

- Add recipes with a name, category, ingredients, preparation steps, and cooking time
- View recipe cards and full details
- Edit and delete saved recipes
- See the most recently added recipe
- Use the app on desktop and mobile

## Project structure

- `frontend/` — React and Vite
- `backend/` — Node.js, Express, Mongoose, and REST API

## Run locally

Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

Set a test MongoDB Atlas connection string in `backend/.env`. Then run these in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## API

- `GET /api/recipes` — list recipes
- `GET /api/recipes/:id` — view one recipe
- `POST /api/recipes` — add a recipe
- `PUT /api/recipes/:id` — edit a recipe
- `DELETE /api/recipes/:id` — delete a recipe

## Deployment

Build the frontend and run the Express server. On Render, set `MONGODB_URI` to the test Atlas connection string.
