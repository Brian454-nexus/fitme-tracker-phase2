import React from 'react';
import MealItem from './MealItem';

const MealList = ({ meals, onDeleteMeal, onEditMeal }) => {
  if (meals.length === 0) {
    return <p className="no-meals">No meals added yet. Add your first meal!</p>;
  }

  return (
    <div className="meal-list">
      <h3>Your Meals</h3>
      <div className="meals-grid">
        {meals.map(meal => (
          <MealItem
            key={meal.id}
            meal={meal}
            onDelete={onDeleteMeal}
            onEdit={onEditMeal}
          />
        ))}
      </div>
    </div>
  );
};

export default MealList; 