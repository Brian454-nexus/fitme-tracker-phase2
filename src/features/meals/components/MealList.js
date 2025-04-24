import React from "react";
import MealItem from "./MealItem";

const MealList = ({ meals, onDelete, onEdit }) => {
  return (
    <div className="meal-list">
      {meals.length === 0 ? (
        <p>No meals found. Add your first meal!</p>
      ) : (
        meals.map(meal => (
          <MealItem
            key={meal.id}
            meal={meal}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
};

export default MealList;
