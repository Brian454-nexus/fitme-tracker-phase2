import React, { useState } from 'react';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import './Meals.css';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);

  const handleAddMeal = (meal) => {
    setMeals([...meals, { ...meal, id: Date.now() }]);
  };

  const handleUpdateMeal = (updatedMeal) => {
    setMeals(meals.map(meal => 
      meal.id === updatedMeal.id ? updatedMeal : meal
    ));
    setEditingMeal(null);
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
  };

  return (
    <div className="meals-container">
      <h2>Meal Tracker</h2>
      <MealForm 
        onAddMeal={handleAddMeal}
        onUpdateMeal={handleUpdateMeal}
        editingMeal={editingMeal}
      />
      <MealList 
        meals={meals}
        onDeleteMeal={handleDeleteMeal}
        onEditMeal={handleEditMeal}
      />
    </div>
  );
};

export default Meals; 