import React, { useState, useEffect } from "react";

const MealForm = ({ onAddMeal, editingMeal, setEditingMeal }) => {
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    mealType: "breakfast",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editingMeal) {
      setFormData(editingMeal);
    }
  }, [editingMeal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMeal) {
      onAddMeal({ ...formData, id: editingMeal.id });
      setEditingMeal(null);
    } else {
      onAddMeal({ ...formData, id: Date.now() });
    }
    setFormData({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      mealType: "breakfast",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Meal name"
            required
          />
        </div>
        <div className="form-group">
          <select
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="Calories"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            placeholder="Protein (g)"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="number"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            placeholder="Carbs (g)"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="fats"
            value={formData.fats}
            onChange={handleChange}
            placeholder="Fats (g)"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit">
        {editingMeal ? "Update Meal" : "Add Meal"}
      </button>
    </form>
  );
};

export default MealForm;
