import React, { useState, useEffect } from "react";
import "./App.css";
import Meals from "./features/meals/Meals";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(() => {
    const savedGoal = localStorage.getItem("dailyCalorieGoal");
    return savedGoal ? parseInt(savedGoal) : 2000;
  });

  useEffect(() => {
    localStorage.setItem("dailyCalorieGoal", dailyCalorieGoal.toString());
  }, [dailyCalorieGoal]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>FitMe Tracker</h1>
      </header>
      <main>
        <Meals
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMealType={selectedMealType}
          setSelectedMealType={setSelectedMealType}
          dailyCalorieGoal={dailyCalorieGoal}
          setDailyCalorieGoal={setDailyCalorieGoal}
        />
      </main>
    </div>
  );
}

export default App;
