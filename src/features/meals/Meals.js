import React, { useState, useEffect } from "react";
import MealForm from "./components/MealForm";
import MealList from "./components/MealList";
import "./Meals.css";

const Meals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(() => {
    const savedGoal = localStorage.getItem("dailyCalorieGoal");
    return savedGoal ? parseInt(savedGoal, 10) : 2000;
  });
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem("meals");
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  const [editingMeal, setEditingMeal] = useState(null);
  const [totalCaloriesToday, setTotalCaloriesToday] = useState(0);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("dailyCalorieGoal", dailyCalorieGoal.toString());
  }, [dailyCalorieGoal]);

  useEffect(() => {
    console.log("Fetching meals and calculating calories...");
  }, [selectedMealType, searchTerm]);

  const today = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter(meal => meal.date === today);
  const totalProteinToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.protein || 0), 0);
  const totalCarbsToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.carbs || 0), 0);
  const totalFatsToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.fats || 0), 0);
  const calorieProgress = Math.min((totalCaloriesToday / dailyCalorieGoal) * 100, 100);

  const handleAddMeal = (newMeal) => {
    if (editingMeal) {
      setMeals(meals.map(meal => meal.id === editingMeal.id ? newMeal : meal));
      setEditingMeal(null);
    } else {
      setMeals([...meals, { ...newMeal, id: Date.now() }]);
    }
  };

  const handleDeleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
  };

  const handleCalorieGoalChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDailyCalorieGoal(value);
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedMealType === "all" || meal.mealType === selectedMealType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="meals-container">
      <div className="daily-summary">
        <div className="calorie-goal-container">
          <h3>Daily Calorie Goal</h3>
          <div className="calorie-goal-input">
            <input
              type="number"
              value={dailyCalorieGoal}
              onChange={handleCalorieGoalChange}
              min="0"
              step="100"
            />
            <span>calories</span>
          </div>
        </div>
        <div className="calorie-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${calorieProgress}%` }}></div>
          </div>
          <p>{totalCaloriesToday} / {dailyCalorieGoal} calories</p>
        </div>
        <div className="nutrition-summary">
          <div>Protein: {totalProteinToday}g</div>
          <div>Carbs: {totalCarbsToday}g</div>
          <div>Fats: {totalFatsToday}g</div>
        </div>
      </div>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value)}
        >
          <option value="all">All Meals</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <MealForm
        onAddMeal={handleAddMeal}
        editingMeal={editingMeal}
        setEditingMeal={setEditingMeal}
      />
      <MealList
        meals={filteredMeals}
        onDelete={handleDeleteMeal}
        onEdit={handleEditMeal}
      />
    </div>
  );
};

export default Meals;
