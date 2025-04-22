import { useState, useEffect } from "react";

const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('fitme_favorite_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fitme_favorite_workouts', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (exercise) => {
    setFavorites((prev) => [...prev, exercise]);
  };

  const removeFavorite = (exercise) => {
    setFavorites((prev) => prev.filter((fav) => fav.name !== exercise.name));
  };

  const isFavorite = (exercise) => {
    return favorites.some((fav) => fav.name === exercise.name);
  };

  const toggleFavorite = (exercise) => {
    if (isFavorite(exercise)) {
      removeFavorite(exercise);
    } else {
      addFavorite(exercise);
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

export default useFavorites;
