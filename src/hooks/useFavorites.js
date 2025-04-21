import { useState, useEffect } from "react";

const FAVORITES_KEY = "fitme_favorite_workouts";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (workout) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.name === workout.name)) {
        return prev;
      }
      return [...prev, workout];
    });
  };

  const removeFavorite = (workoutName) => {
    setFavorites((prev) =>
      prev.filter((workout) => workout.name !== workoutName)
    );
  };

  const isFavorite = (workoutName) => {
    return favorites.some((workout) => workout.name === workoutName);
  };

  const toggleFavorite = (workout) => {
    if (isFavorite(workout.name)) {
      removeFavorite(workout.name);
    } else {
      addFavorite(workout);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
