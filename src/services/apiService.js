/**
 * API Service for handling external API requests
 * This service acts as a proxy to avoid exposing API keys in the frontend
 */
import axios from "axios";

// Create an axios instance with default configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch exercises from the API Ninjas Exercise API
 * @param {string} muscle - The muscle group to target
 * @returns {Promise<Array>} - Array of exercises
 */
export const fetchExercises = async (muscle) => {
  try {
    // Use environment variable for API key
    const apiKey = process.env.REACT_APP_API_NINJAS_KEY;

    if (!apiKey) {
      console.error("API Ninjas key is missing. Please check your .env file.");
      throw new Error("API key is missing");
    }

    const response = await apiClient.get(
      `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
      {
        headers: {
          "X-Api-Key": apiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

/**
 * Fetch meals from The Meal DB API
 * @param {Object} params - Query parameters
 * @param {string} params.type - Type of query (search, filter, random)
 * @param {string} params.query - Search term or category
 * @returns {Promise<Array>} - Array of meals
 */
export const fetchMeals = async ({ type, query }) => {
  try {
    const MEALDB_API_BASE = "https://www.themealdb.com/api/json/v1/1/";
    let url = "";

    switch (type) {
      case "search":
        url = `${MEALDB_API_BASE}search.php?s=${query}`;
        break;
      case "category":
        url = `${MEALDB_API_BASE}filter.php?c=${query}`;
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
    return response.data;
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw error;
  }
};
