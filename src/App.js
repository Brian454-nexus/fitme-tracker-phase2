import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [meals, setMeals] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    time: '',
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast'
  });

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    // Load daily calorie goal from localStorage if exists
    const savedGoal = localStorage.getItem('dailyCalorieGoal');
    if (savedGoal) {
      setDailyCalorieGoal(parseInt(savedGoal));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMeal) {
      setMeals(meals.map(meal => 
        meal.id === editingMeal.id ? { ...formData, id: editingMeal.id } : meal
      ));
      setEditingMeal(null);
    } else {
      setMeals([...meals, { ...formData, id: Date.now() }]);
    }
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      time: '',
      date: new Date().toISOString().split('T')[0],
      mealType: 'breakfast'
    });
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setFormData(meal);
  };

  const handleCalorieGoalChange = (e) => {
    const newGoal = parseInt(e.target.value);
    setDailyCalorieGoal(newGoal);
    localStorage.setItem('dailyCalorieGoal', newGoal);
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedMealType === 'all' || meal.mealType === selectedMealType;
    return matchesSearch && matchesType;
  });

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(meal => meal.date === today);
  const totalCaloriesToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.calories || 0), 0);
  const totalProteinToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.protein || 0), 0);
  const totalCarbsToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.carbs || 0), 0);
  const totalFatsToday = todayMeals.reduce((sum, meal) => sum + parseInt(meal.fats || 0), 0);

  const calorieProgress = Math.min((totalCaloriesToday / dailyCalorieGoal) * 100, 100);

  return (
    <div className="App">
      <header className="App-header">
        <h1>FitMe Tracker</h1>
      </header>
      <main className="main-content">
        <div className="daily-summary">
          <h2>Today's Summary</h2>
          <div className="calorie-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calorieProgress}%` }}
              ></div>
            </div>
            <div className="calorie-info">
              <span>{totalCaloriesToday} / {dailyCalorieGoal} kcal</span>
              <input
                type="number"
                value={dailyCalorieGoal}
                onChange={handleCalorieGoalChange}
                className="calorie-goal-input"
                min="0"
              />
            </div>
          </div>
          <div className="nutrition-summary">
            <div className="nutrition-item">
              <span className="label">Protein:</span>
              <span className="value">{totalProteinToday}g</span>
            </div>
            <div className="nutrition-item">
              <span className="label">Carbs:</span>
              <span className="value">{totalCarbsToday}g</span>
            </div>
            <div className="nutrition-item">
              <span className="label">Fats:</span>
              <span className="value">{totalFatsToday}g</span>
            </div>
          </div>
        </div>

        <div className="meals-container">
          <div className="meal-form-container">
            <h2>Add/Edit Meal</h2>
            <form onSubmit={handleSubmit} className="meal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Meal Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Meal Type:</label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleChange}
                    required
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time:</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Calories:</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Protein (g):</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Carbs (g):</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fats (g):</label>
                  <input
                    type="number"
                    name="fats"
                    value={formData.fats}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">
                {editingMeal ? 'Update Meal' : 'Add Meal'}
              </button>
            </form>
          </div>

          <div className="meals-list-container">
            <div className="meals-controls">
              <h2>Your Meals</h2>
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="meal-type-filter"
                >
                  <option value="all">All Meals</option>
                  {mealTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filteredMeals.length === 0 ? (
              <p className="no-meals">No meals found. Add your first meal!</p>
            ) : (
              <div className="meals-grid">
                {filteredMeals.map(meal => (
                  <div key={meal.id} className="meal-item">
                    <div className="meal-header">
                      <h4>{meal.name}</h4>
                      <div className="meal-meta">
                        <span className="meal-type">{meal.mealType}</span>
                        <span className="meal-time">
                          {meal.date} at {meal.time}
                        </span>
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
                      <button onClick={() => handleEditMeal(meal)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteMeal(meal.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
