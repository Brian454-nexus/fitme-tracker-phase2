/**
 * API Service for handling external API requests
 * This service acts as a proxy to avoid exposing API keys in the frontend
 */
import axios from "axios";

// Create an axios instance with default configuration
const apiClient = axios.create({
  timeout: 5000, // 5 seconds timeout - faster response
  headers: {
    "Content-Type": "application/json",
  },
  // Add caching headers
  cache: true,
});

/**
 * Fetch exercises from the API Ninjas Exercise API
 * @param {string} muscle - The muscle group to target
 * @returns {Promise<Array>} - Array of exercises
 */
export const fetchExercises = async (muscle) => {
  // Fallback exercises for each muscle group
  const fallbackExercises = {
    chest: [
      {
        id: "c1",
        name: "Bench Press",
        type: "strength",
        muscle: "chest",
        equipment: "barbell",
        difficulty: "intermediate",
        instructions:
          "Lie on a flat bench with your feet flat on the floor. Grip the barbell with hands slightly wider than shoulder-width. Lift the bar off the rack and hold it straight over you with arms locked. Lower the bar slowly until it touches your chest. Push the bar back to the starting position.",
      },
      {
        id: "c2",
        name: "Push-ups",
        type: "strength",
        muscle: "chest",
        equipment: "body only",
        difficulty: "beginner",
        instructions:
          "Get down on all fours, placing your hands slightly wider than your shoulders. Straighten your arms and legs. Lower your body until your chest nearly touches the floor. Pause, then push yourself back up.",
      },
      {
        id: "c3",
        name: "Dumbbell Flyes",
        type: "strength",
        muscle: "chest",
        equipment: "dumbbell",
        difficulty: "intermediate",
        instructions:
          "Lie on a flat bench with a dumbbell in each hand. Extend your arms above your chest with palms facing each other. Lower the weights in an arc motion until you feel a stretch in your chest. Return to the starting position.",
      },
    ],
    back: [
      {
        id: "b1",
        name: "Pull-ups",
        type: "strength",
        muscle: "back",
        equipment: "body only",
        difficulty: "intermediate",
        instructions:
          "Grab the pull-up bar with your palms facing away from you. Pull your body up until your chin is above the bar. Lower yourself back down with control.",
      },
      {
        id: "b2",
        name: "Deadlift",
        type: "strength",
        muscle: "back",
        equipment: "barbell",
        difficulty: "intermediate",
        instructions:
          "Stand with feet shoulder-width apart, barbell over your feet. Bend at the hips and knees to grip the bar. Lift the bar by extending your hips and knees, keeping your back straight. Return the bar to the floor with control.",
      },
      {
        id: "b3",
        name: "Bent Over Rows",
        type: "strength",
        muscle: "back",
        equipment: "barbell",
        difficulty: "intermediate",
        instructions:
          "Bend at the waist with knees slightly bent, holding a barbell with hands shoulder-width apart. Pull the barbell towards your lower chest, keeping your back straight. Lower the barbell back down with control.",
      },
    ],
    legs: [
      {
        id: "l1",
        name: "Squats",
        type: "strength",
        muscle: "legs",
        equipment: "barbell",
        difficulty: "intermediate",
        instructions:
          "Stand with feet shoulder-width apart, barbell across your upper back. Bend your knees and lower your hips until your thighs are parallel to the floor. Return to the starting position.",
      },
      {
        id: "l2",
        name: "Lunges",
        type: "strength",
        muscle: "legs",
        equipment: "body only",
        difficulty: "beginner",
        instructions:
          "Stand with feet hip-width apart. Step forward with one leg and lower your body until both knees are bent at 90 degrees. Push back up to the starting position and repeat with the other leg.",
      },
      {
        id: "l3",
        name: "Leg Press",
        type: "strength",
        muscle: "legs",
        equipment: "machine",
        difficulty: "beginner",
        instructions:
          "Sit on the leg press machine with your feet on the platform shoulder-width apart. Release the safety and lower the platform until your knees are at 90 degrees. Push the platform back up without locking your knees.",
      },
    ],
    abs: [
      {
        id: "a1",
        name: "Crunches",
        type: "strength",
        muscle: "abs",
        equipment: "body only",
        difficulty: "beginner",
        instructions:
          "Lie on your back with knees bent and feet flat on the floor. Place your hands behind your head. Lift your shoulders off the floor by contracting your abs. Lower back down with control.",
      },
      {
        id: "a2",
        name: "Plank",
        type: "strength",
        muscle: "abs",
        equipment: "body only",
        difficulty: "beginner",
        instructions:
          "Get into a push-up position, but rest on your forearms instead of your hands. Keep your body in a straight line from head to heels. Hold this position.",
      },
      {
        id: "a3",
        name: "Russian Twists",
        type: "strength",
        muscle: "abs",
        equipment: "body only",
        difficulty: "intermediate",
        instructions:
          "Sit on the floor with knees bent and feet lifted slightly. Lean back slightly, keeping your back straight. Twist your torso to the right, then to the left, touching the floor on each side.",
      },
    ],
    arms: [
      {
        id: "ar1",
        name: "Bicep Curls",
        type: "strength",
        muscle: "arms",
        equipment: "dumbbell",
        difficulty: "beginner",
        instructions:
          "Stand with a dumbbell in each hand, arms at your sides, palms facing forward. Keeping your upper arms stationary, curl the weights up to shoulder level. Lower back down with control.",
      },
      {
        id: "ar2",
        name: "Tricep Dips",
        type: "strength",
        muscle: "arms",
        equipment: "body only",
        difficulty: "beginner",
        instructions:
          "Sit on the edge of a bench with hands gripping the edge. Slide your butt off the bench with legs extended. Lower your body by bending your elbows until they're at 90 degrees. Push back up until arms are straight.",
      },
      {
        id: "ar3",
        name: "Hammer Curls",
        type: "strength",
        muscle: "arms",
        equipment: "dumbbell",
        difficulty: "beginner",
        instructions:
          "Stand with a dumbbell in each hand, arms at your sides, palms facing your body. Keeping your upper arms stationary, curl the weights up to shoulder level. Lower back down with control.",
      },
    ],
  };

  try {
    // Use environment variable for API key
    const apiKey = process.env.REACT_APP_API_NINJAS_KEY;

    if (!apiKey) {
      console.error("API Ninjas key is missing. Please check your .env file.");
      return fallbackExercises[muscle] || [];
    }

    const response = await apiClient.get(
      `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
      {
        headers: {
          "X-Api-Key": apiKey,
        },
      }
    );

    // If the API returns empty data, use fallback exercises
    if (!response.data || response.data.length === 0) {
      console.log(`No exercises found for ${muscle}, using fallback data`);
      return fallbackExercises[muscle] || [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    // Return fallback exercises instead of throwing an error
    return fallbackExercises[muscle] || [];
  }
};

// Cache for meal data to avoid repeated API calls
const mealCache = {
  random: null,
  categories: null,
  search: {},
  category: {},
};

// Fallback meals for when API fails
const fallbackMeals = {
  random: {
    meals: [
      {
        idMeal: "fb1",
        strMeal: "Spaghetti Bolognese",
        strMealThumb:
          "https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg",
        strCategory: "Pasta",
        strArea: "Italian",
      },
      {
        idMeal: "fb2",
        strMeal: "Chicken Stir Fry",
        strMealThumb:
          "https://www.themealdb.com/images/media/meals/wwuqvt1487345467.jpg",
        strCategory: "Chicken",
        strArea: "Asian",
      },
      {
        idMeal: "fb3",
        strMeal: "Vegetable Curry",
        strMealThumb:
          "https://www.themealdb.com/images/media/meals/wqqvyq1511179730.jpg",
        strCategory: "Vegetarian",
        strArea: "Indian",
      },
    ],
  },
  categories: {
    meals: [
      { strCategory: "Beef" },
      { strCategory: "Chicken" },
      { strCategory: "Dessert" },
      { strCategory: "Lamb" },
      { strCategory: "Pasta" },
      { strCategory: "Pork" },
      { strCategory: "Seafood" },
      { strCategory: "Side" },
      { strCategory: "Starter" },
      { strCategory: "Vegetarian" },
    ],
  },
};

/**
 * Fetch meals from The Meal DB API with caching and improved error handling
 * @param {Object} params - Query parameters
 * @param {string} params.type - Type of query (search, filter, random)
 * @param {string} params.query - Search term or category
 * @returns {Promise<Object>} - Object containing meals array
 */
export const fetchMeals = async ({ type, query }) => {
  try {
    const MEALDB_API_BASE = "https://www.themealdb.com/api/json/v1/1/";
    let url = "";
    let cacheKey = "";

    // Check if we have cached data
    if (type === "random" && mealCache.random) {
      return mealCache.random;
    } else if (type === "categories" && mealCache.categories) {
      return mealCache.categories;
    } else if (type === "search" && query && mealCache.search[query]) {
      return mealCache.search[query];
    } else if (type === "category" && query && mealCache.category[query]) {
      return mealCache.category[query];
    }

    // Build URL based on request type
    switch (type) {
      case "search":
        url = `${MEALDB_API_BASE}search.php?s=${encodeURIComponent(query)}`;
        cacheKey = query;
        break;
      case "category":
        url = `${MEALDB_API_BASE}filter.php?c=${encodeURIComponent(query)}`;
        cacheKey = query;
        break;
      case "random":
        url = `${MEALDB_API_BASE}random.php`;
        break;
      case "categories":
        url = `${MEALDB_API_BASE}list.php?c=list`;
        break;
      default:
        url = `${MEALDB_API_BASE}random.php`;
    }

    const response = await apiClient.get(url);

    // Check if the response has valid data
    if (!response.data || !response.data.meals) {
      console.warn(
        `No meals found for ${type} ${query || ""}, using fallback data`
      );

      // Use fallback data based on type
      if (type === "random") {
        return fallbackMeals.random;
      } else if (type === "categories") {
        return fallbackMeals.categories;
      } else {
        return { meals: [] };
      }
    }

    // For category searches, we need to fetch full meal details for each meal
    if (
      type === "category" &&
      response.data.meals &&
      response.data.meals.length > 0
    ) {
      // Add missing properties to category results
      response.data.meals = response.data.meals.map((meal) => ({
        ...meal,
        strCategory: query, // Add the category
        strArea: "Various", // Add a placeholder area
      }));
    }

    // Cache the response
    if (type === "random") {
      mealCache.random = response.data;
    } else if (type === "categories") {
      mealCache.categories = response.data;
    } else if (type === "search" && cacheKey) {
      mealCache.search[cacheKey] = response.data;
    } else if (type === "category" && cacheKey) {
      mealCache.category[cacheKey] = response.data;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching meals:", error);

    // Return fallback data based on type
    if (type === "random") {
      return fallbackMeals.random;
    } else if (type === "categories") {
      return fallbackMeals.categories;
    } else {
      return { meals: [] };
    }
  }
};
