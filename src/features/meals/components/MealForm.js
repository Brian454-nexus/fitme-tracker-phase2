import React, { useState, useEffect } from 'react';

const MealForm = ({ onAddMeal, onUpdateMeal, editingMeal }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    time: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingMeal) {
      setFormData(editingMeal);
    }
  }, [editingMeal]);

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
      onUpdateMeal(formData);
    } else {
      onAddMeal(formData);
    }
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      time: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="meal-form">
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
      <button type="submit" className="submit-btn">
        {editingMeal ? 'Update Meal' : 'Add Meal'}
      </button>
    </form>
  );
};

export default MealForm; 