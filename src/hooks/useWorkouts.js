import { useState, useEffect } from "react";
import axios from "axios";

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const fetchWorkouts = async (muscle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/exercises?muscle=${muscle.toLowerCase()}`,
        {
          headers: {
            "X-Api-Key": process.env.REACT_APP_API_NINJAS_KEY,
          },
        }
      );
      setWorkouts(response.data);
      setSelectedMuscle(muscle);
    } catch (err) {
      setError("Failed to fetch workouts. Please try again later.");
      console.error("Error fetching workouts:", err);
    }
    setLoading(false);
  };

  const getRandomWorkout = () => {
    if (workouts.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * workouts.length);
    return workouts[randomIndex];
  };

  const filterByDifficulty = (difficulty) => {
    return workouts.filter((workout) => workout.difficulty === difficulty);
  };

  return {
    workouts,
    loading,
    error,
    selectedMuscle,
    fetchWorkouts,
    getRandomWorkout,
    filterByDifficulty,
  };
};

export default useWorkouts;
