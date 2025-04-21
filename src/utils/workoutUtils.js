export const filterWorkouts = (workouts, filters) => {
  return workouts.filter((workout) => {
    if (filters.difficulty && workout.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.equipment && workout.equipment !== filters.equipment) {
      return false;
    }
    if (filters.type && workout.type !== filters.type) {
      return false;
    }
    return true;
  });
};

export const sortWorkouts = (workouts, sortBy) => {
  return [...workouts].sort((a, b) => {
    switch (sortBy) {
      case "difficulty":
        const difficultyOrder = { beginner: 0, intermediate: 1, expert: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "name":
        return a.name.localeCompare(b.name);
      case "equipment":
        return a.equipment.localeCompare(b.equipment);
      default:
        return 0;
    }
  });
};

export const getWorkoutStats = (workouts) => {
  const stats = {
    total: workouts.length,
    byDifficulty: {
      beginner: 0,
      intermediate: 0,
      expert: 0,
    },
    byEquipment: {},
    byType: {},
  };

  workouts.forEach((workout) => {
    // Count by difficulty
    stats.byDifficulty[workout.difficulty] =
      (stats.byDifficulty[workout.difficulty] || 0) + 1;

    // Count by equipment
    stats.byEquipment[workout.equipment] =
      (stats.byEquipment[workout.equipment] || 0) + 1;

    // Count by type
    stats.byType[workout.type] = (stats.byType[workout.type] || 0) + 1;
  });

  return stats;
};

export const getRandomWorkout = (workouts) => {
  if (!workouts.length) return null;
  const randomIndex = Math.floor(Math.random() * workouts.length);
  return workouts[randomIndex];
};

export const getWorkoutSuggestions = (workouts, currentWorkout) => {
  if (!workouts.length || !currentWorkout) return [];

  return workouts
    .filter(
      (workout) =>
        workout.muscle === currentWorkout.muscle &&
        workout.name !== currentWorkout.name
    )
    .slice(0, 3);
};
