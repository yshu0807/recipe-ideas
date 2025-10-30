import React, { useEffect, useState } from "react";

const RecipeModal = ({ meal, onClose }) => {
  const [details, setDetails] = useState(meal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (meal && !meal.strInstructions && meal.idMeal) {
        setLoading(true);
        try {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const data = await res.json();
          if (data.meals && data.meals[0]) {
            setDetails(data.meals[0]);
          }
        } catch (err) {
          console.error("Error fetching recipe details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [meal]);

  if (!meal) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-lg text-gray-600 animate-scaleIn">
          Loading recipe details...
        </div>
      </div>
    );
  }

  const handleClose = () => {
    // ✅ If this is a standalone new tab, go back
    if (window.opener) {
      window.close(); // close only the modal tab
    } else {
      // ✅ If inside main app, just close modal
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-scaleIn">
        {/* ❌ Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-orange-600 mb-4 text-center">
          {details?.strMeal || "Recipe"}
        </h2>

        {/* Image */}
        {details?.strMealThumb && (
          <img
            src={details.strMealThumb}
            alt={details.strMeal}
            className="rounded-xl w-full mb-5 shadow-md"
          />
        )}

        {/* Ingredients */}
        {details?.strInstructions && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Ingredients
            </h3>
            <ul className="list-disc list-inside text-left mb-5 text-gray-700">
              {Array.from({ length: 20 }, (_, i) => i + 1)
                .map((i) => {
                  const ingredient = details[`strIngredient${i}`];
                  const measure = details[`strMeasure${i}`];
                  return (
                    ingredient &&
                    ingredient.trim() && (
                      <li key={i}>
                        {ingredient} — {measure}
                      </li>
                    )
                  );
                })
                .filter(Boolean)}
            </ul>

            {/* Instructions */}
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Instructions
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
              {details.strInstructions}
            </p>
          </>
        )}

        {/* YouTube Link */}
        {details?.strYoutube && (
          <a
            href={details.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            🎥 Watch on YouTube
          </a>
        )}
      </div>
    </div>
  );
};

export default RecipeModal;
