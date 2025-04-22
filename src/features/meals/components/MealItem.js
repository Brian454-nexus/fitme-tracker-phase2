import React from "react"; const MealItem = ({ meal }) => { return ( <div className="meal-item"> <h4>{meal.name}</h4> <p>{meal.calories} calories</p> </div> ); }; export default MealItem;
