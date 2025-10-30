import { useState, useEffect } from "react";
import RecipeModal from "./components/RecipeModal";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // 🍳 Fetch "Recipe of the Day"
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => setRandomRecipe(data.meals[0]))
      .catch((err) => console.error(err));
  }, []);

  // 🔎 Search recipes by name + ingredient
  const fetchRecipes = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setNoResults(false);

    try {
      const [byNameRes, byIngredientRes] = await Promise.all([
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`),
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`)
      ]);

      const [byNameData, byIngredientData] = await Promise.all([
        byNameRes.json(),
        byIngredientRes.json()
      ]);

      const nameMeals = byNameData.meals || [];
      const ingredientMeals = byIngredientData.meals || [];

      // Merge results without duplicates
      const merged = [
        ...nameMeals,
        ...ingredientMeals.filter(
          (m) => !nameMeals.find((nm) => nm.idMeal === m.idMeal)
        )
      ];

      setRecipes(merged);
      setNoResults(merged.length === 0);

      // 🌐 Open results in new tab
      const newTab = window.open("", "_blank");
      newTab.document.write(`
        <html>
          <head>
            <title>Recipe Results for ${searchTerm}</title>
            <style>
              body {
                font-family: sans-serif;
                background: linear-gradient(135deg, #fdf2f8, #e0e7ff);
                color: #333;
                margin: 0;
                padding: 20px;
                text-align: center;
              }
              .recipe-card {
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                display: inline-block;
                margin: 10px;
                width: 220px;
                overflow: hidden;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                transition: 0.3s;
              }
              .recipe-card:hover { transform: scale(1.05); }
              img { width: 100%; height: 160px; object-fit: cover; }
              h3 { margin: 10px 0; font-size: 16px; }
            </style>
          </head>
          <body>
            <h1>🍽️ Recipes for "${searchTerm}"</h1>
            ${
              merged.length
                ? merged
                    .map(
                      (m) => `
                  <a href="/?id=${m.idMeal}" target="_self" class='recipe-card'>
                    <img src='${m.strMealThumb}' alt='${m.strMeal}' />
                    <h3>${m.strMeal}</h3>
                  </a>`
                    )
                    .join("")
                : "<p>No recipes found.</p>"
            }
          </body>
        </html>
      `);
      newTab.document.close();
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Handle Recipe ID from URL (when user clicks in new tab)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => setSelectedRecipe(data.meals[0]))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 to-purple-100 text-gray-800 font-sans">
      {/* 🎈 Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-pink-300 opacity-40 w-60 h-60 rounded-full blur-3xl animate-float1"></div>
        <div className="absolute bg-purple-400 opacity-40 w-72 h-72 rounded-full blur-3xl animate-float2 top-1/3 left-2/3"></div>
        <div className="absolute bg-orange-300 opacity-40 w-56 h-56 rounded-full blur-3xl animate-float3 bottom-10 left-10"></div>
      </div>

      <div className="relative text-center py-10 animate-fadeIn z-10">
        {/* 🔍 Header */}
        <h1 className="text-4xl font-extrabold text-orange-600 flex items-center justify-center gap-2">
          <span role="img" aria-label="magnifying glass">🔍</span> Recipe Finder
        </h1>
        <p className="text-gray-600 mt-2">
          Discover delicious recipes from around the world — enter any ingredient or recipe name!
        </p>

        {/* 🔎 Search Bar */}
        <div className="flex justify-center mt-6">
          <input
            type="text"
            placeholder="e.g. chicken, pasta, egg, biryani..."
            className="border border-gray-300 rounded-l-full px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
          />
          <button
            onClick={fetchRecipes}
            className="bg-orange-500 text-white px-5 py-2 rounded-r-full hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>

        {/* 🌟 Recipe of the Day */}
        {randomRecipe && (
          <div className="mt-10 animate-scaleIn">
            <h2 className="text-2xl font-semibold text-orange-500 mb-4">
              🌟 Recipe of the Day
            </h2>
            <div
              className="bg-white shadow-md rounded-2xl p-5 w-80 mx-auto cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedRecipe(randomRecipe)}
            >
              <img
                src={randomRecipe.strMealThumb}
                alt={randomRecipe.strMeal}
                className="rounded-lg w-full"
              />
              <h3 className="mt-3 font-semibold text-lg">{randomRecipe.strMeal}</h3>
            </div>
          </div>
        )}
      </div>

      {/* 🍲 Modal */}
      {selectedRecipe && (
        <RecipeModal
          meal={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
