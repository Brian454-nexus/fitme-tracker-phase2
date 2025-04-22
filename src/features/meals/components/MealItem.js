import React from 'react';

const MealItem = ({ meal, onDelete, onEdit }) => {
  return (
    <div className="meal-item">
      <div className="meal-header">
        <h4>{meal.name}</h4>
        <div className="meal-time">
          {meal.date} at {meal.time}
        </div>
      </div>
      <div className="meal-nutrition">
        <div className="nutrition-item">
          <span className="label">Calories:</span>
          <span className="value">{meal.calories} kcal</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Protein:</span>
          <span className="value">{meal.protein}g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Carbs:</span>
          <span className="value">{meal.carbs}g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Fats:</span>
          <span className="value">{meal.fats}g</span>
        </div>
      </div>
      <div className="meal-actions">
        <button onClick={() => onEdit(meal)} className="edit-btn">
          Edit
        </button>
        <button onClick={() => onDelete(meal.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default MealItem; 