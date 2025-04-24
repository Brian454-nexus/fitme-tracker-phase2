import React from "react";

const MealItem = ({ meal, onDelete, onEdit }) => {
  return (
    <div className="meal-card">
      <span className="meal-type">{meal.mealType}</span>
      <h3>{meal.name}</h3>
      <p>Calories: {meal.calories}</p>
      {meal.protein && <p>Protein: {meal.protein}g</p>}
      {meal.carbs && <p>Carbs: {meal.carbs}g</p>}
      {meal.fats && <p>Fats: {meal.fats}g</p>}
      <p>Date: {meal.date}</p>
      <p>Time: {meal.time}</p>
      <div className="meal-actions">
        <button className="edit-btn" onClick={() => onEdit(meal)}>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(meal.id)}>Delete</button>
      </div>
    </div>
  );
};

export default MealItem;
