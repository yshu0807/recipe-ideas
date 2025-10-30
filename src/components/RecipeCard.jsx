import React from "react";

const RecipeCard = ({ meal }) => {
  return (
    <div className="animate-scaleIn bg-white shadow-md hover:shadow-lg transition rounded-2xl p-3 w-64 cursor-pointer transform hover:scale-105 duration-300">
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">{meal.strMeal}</h3>
    </div>
  );
};

export default RecipeCard;
