import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaSearch,
  FaUtensils,
  FaTags,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import LogMealModal from './LogMealModal'; // Import the modal

// Debounce Hook (optional but recommended for search)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// API Base URL
const MEALDB_API_BASE = "https://www.themealdb.com/api/json/v1/1/";

// #region Styled Components
const MealsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  color: ${(props) => props.theme.text};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  opacity: 0.7;
  font-size: 1.1rem;
`;

const SummaryAndSearch = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// --- Daily Summary Styles ---
const DailySummaryCard = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.border};
`;

const SummaryTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const GoalInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  input {
    width: 80px;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    text-align: center;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.accent};
    }
  }
  span {
    opacity: 0.8;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${(props) => props.theme.border};
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem 0 1rem 0;
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: ${(props) => props.theme.accent};
  border-radius: 5px;
`;

const CalorieText = styled.p`
  text-align: center;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const NutritionBreakdown = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const NutritionItem = styled.div`
  span {
    display: block;
    font-weight: 600;
    margin-bottom: 0.2rem;
    color: ${(props) => props.theme.accent};
  }
`;

// --- Search and Filter Styles ---
const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.cardBackground};
  border-radius: 0.8rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid ${(props) => props.theme.border};

  svg {
    margin-right: 0.8rem;
    color: ${(props) => props.theme.text};
    opacity: 0.6;
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  padding: 0.8rem 0.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.text};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.text};
    opacity: 0.5;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    opacity: 0.8;
  }
`;

const SelectDropdown = styled.select`
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.accent};
  }
`;

// --- Recipe Display Styles ---
const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  font-size: 2rem;
  color: ${(props) => props.theme.accent};
  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  background-color: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 1rem;
  color: #ff4444;
  text-align: center;

  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const RecipeGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const RecipeCard = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${(props) => props.theme.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const RecipeInfo = styled.div`
  padding: 1rem;
`;

const RecipeTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecipeTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;

  span {
    background-color: ${(props) => props.theme.border};
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
  }
`;

// #endregion

const Meals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Changed from mealType
  const [categories, setCategories] = useState([]);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(() => {
    const savedGoal = localStorage.getItem("dailyCalorieGoal");
    return savedGoal ? parseInt(savedGoal, 10) : 2000;
  });
  // State for API data
  const [meals, setMeals] = useState([]); // API results
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for manually logged meals
  const [loggedMeals, setLoggedMeals] = useState(() => {
    const savedMeals = localStorage.getItem("loggedMealsData");
    return savedMeals ? JSON.parse(savedMeals) : [];
  });

  // NEW: Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealForModal, setSelectedMealForModal] = useState(null);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${MEALDB_API_BASE}list.php?c=list`);
        if (response.data && response.data.meals) {
          setCategories(response.data.meals.map((cat) => cat.strCategory));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Handle error silently or show a small indicator
      }
    };
    fetchCategories();
  }, []);

  // Fetch Random Meal on Mount
  useEffect(() => {
    const fetchRandom = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${MEALDB_API_BASE}random.php`);
        setMeals(response.data.meals || []);
      } catch (err) {
        console.error("Error fetching random meal:", err);
        setError("Could not fetch a meal suggestion. Please try again later.");
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRandom();
  }, []);

  // API Call Logic using useCallback
  const fetchMeals = useCallback(async () => {
    // Don't search if category is selected and search term is empty
    if (selectedCategory && !debouncedSearchTerm) {
      return; // Or fetch by category? Let's stick to explicit actions for now.
    }
    // Don't search if search term is too short (or empty) and no category selected
    if (!selectedCategory && debouncedSearchTerm.length < 3) {
      if (debouncedSearchTerm.length === 0) {
        // Maybe fetch random again or clear results? Fetch random for now.
        try {
          setIsLoading(true);
          setError(null);
          const response = await axios.get(`${MEALDB_API_BASE}random.php`);
          setMeals(response.data.meals || []);
        } catch (err) {
          setError("Could not fetch meals.");
          setMeals([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMeals([]); // Clear results for short terms
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    let url = "";

    if (selectedCategory && !debouncedSearchTerm) {
      // Fetch by category if search is empty
      url = `${MEALDB_API_BASE}filter.php?c=${selectedCategory}`;
    } else {
      // Prioritize search term
      url = `${MEALDB_API_BASE}search.php?s=${debouncedSearchTerm}`;
    }

    try {
      const response = await axios.get(url);
      // The filter endpoint returns a different structure
      if (url.includes("filter.php")) {
        if (response.data && response.data.meals) {
          // Filter endpoint only gives name, thumb, id. Need to fetch details maybe?
          // For now, just display what we have.
          setMeals(response.data.meals);
        } else {
          setMeals([]);
          setError(`No meals found for category: ${selectedCategory}`);
        }
      } else {
        // search.php or random.php
        setMeals(response.data.meals || []);
        if (!response.data.meals) {
          setError(`No meals found for "${debouncedSearchTerm}".`);
        }
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("An error occurred while fetching meals. Please try again.");
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, selectedCategory]);

  // Effect for Search Term / Category Change
  useEffect(() => {
    // Trigger fetch when debounced term or category changes
    // Avoid initial fetch if search is empty and no category selected
    if (debouncedSearchTerm || selectedCategory) {
        fetchMeals();
    } else if (
      !debouncedSearchTerm &&
      !selectedCategory &&
      meals.length === 0 // Check if meals array is empty
    ) {
      // If everything is empty and no meals loaded yet, fetch random
      const fetchRandom = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${MEALDB_API_BASE}random.php`);
          setMeals(response.data.meals || []);
        } catch (err) { setError("Could not fetch meals."); setMeals([]); }
        finally { setIsLoading(false); }
      };
      fetchRandom();
    }
    // Added meals.length to dependency array
  }, [debouncedSearchTerm, selectedCategory, fetchMeals, meals.length]); 

  // NEW: useEffect to save loggedMeals to localStorage
  useEffect(() => {
    try {
        localStorage.setItem("loggedMealsData", JSON.stringify(loggedMeals));
    } catch (error) {
        console.error("Error saving logged meals to localStorage:", error);
    }
  }, [loggedMeals]);

  // --- Daily Summary Calculations (using loggedMeals) ---
  const today = new Date().toISOString().split("T")[0];
  const todayLoggedMeals = loggedMeals.filter((meal) => meal.date === today);
  const totalCaloriesToday = todayLoggedMeals.reduce(
    (sum, meal) => sum + parseInt(meal.calories || 0),
    0
  );
  const totalProteinToday = todayLoggedMeals.reduce(
    (sum, meal) => sum + parseInt(meal.protein || 0),
    0
  );
  const totalCarbsToday = todayLoggedMeals.reduce(
    (sum, meal) => sum + parseInt(meal.carbs || 0),
    0
  );
  const totalFatsToday = todayLoggedMeals.reduce(
    (sum, meal) => sum + parseInt(meal.fats || 0),
    0
  );
  const calorieProgress = Math.min(
    dailyCalorieGoal > 0 ? (totalCaloriesToday / dailyCalorieGoal) * 100 : 0,
    100
  );

  const handleCalorieGoalChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      value = 0; // Default to 0 if invalid input
    }
    setDailyCalorieGoal(value);
    localStorage.setItem("dailyCalorieGoal", value.toString());
  };

  // UPDATED: Select Meal Handler
  const handleSelectMeal = (meal) => {
    console.log("Selected Meal for Modal:", meal);
    setSelectedMealForModal(meal);
    setIsModalOpen(true);
  };

  // NEW: Log Meal Handler (passed to modal)
  const handleLogMeal = (loggedData) => {
    console.log("Logging Meal Data:", loggedData);
    setLoggedMeals(prevLoggedMeals => [...prevLoggedMeals, loggedData]);
    setIsModalOpen(false);
    setSelectedMealForModal(null);
    // Optionally: Show a success message/toast
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMealForModal(null);
  }

  return (
    <MealsContainer>
      <Header>
        <Title>Meal Discovery</Title>
        <Subtitle>Find delicious recipes and track your nutrition</Subtitle>
      </Header>

      <SummaryAndSearch>
        {/* Daily Summary */}
        <DailySummaryCard>
          <SummaryTitle>Today's Nutrition</SummaryTitle>
          <GoalInputContainer>
            <label htmlFor="calorieGoal">Goal:</label>
            <input
              id="calorieGoal"
              type="number"
              value={dailyCalorieGoal}
              onChange={handleCalorieGoalChange}
              min="0"
              step="50"
            />
            <span>kcal</span>
          </GoalInputContainer>
          <ProgressBarContainer>
            <ProgressBarFill
              initial={{ width: 0 }}
              animate={{ width: `${calorieProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressBarContainer>
          <CalorieText>
            {totalCaloriesToday} / {dailyCalorieGoal} kcal consumed
          </CalorieText>
          <NutritionBreakdown>
            <NutritionItem>
              <span>{totalProteinToday}g</span>Protein
            </NutritionItem>
            <NutritionItem>
              <span>{totalCarbsToday}g</span>Carbs
            </NutritionItem>
            <NutritionItem>
              <span>{totalFatsToday}g</span>Fats
            </NutritionItem>
          </NutritionBreakdown>
        </DailySummaryCard>

        {/* Search and Filters */}
        <SearchSection>
          <SearchBarContainer>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search recipes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBarContainer>
          <FilterContainer>
            <label htmlFor="categoryFilter">
              <FaTags /> Category:
            </label>
            <SelectDropdown
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                // Optionally clear search term when category changes?
                // setSearchTerm("");
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </SelectDropdown>
            {/* Add more filters here (e.g., Area/Origin) */}
          </FilterContainer>
        </SearchSection>
      </SummaryAndSearch>

      {/* Recipe Display */}
      <ResultsContainer>
        {isLoading ? (
          <LoadingSpinner>
            <FaSpinner />
          </LoadingSpinner>
        ) : error ? (
          <ErrorMessage>
            <FaExclamationTriangle />
            {error}
          </ErrorMessage>
        ) : meals.length > 0 ? (
          <RecipeGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {meals.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => handleSelectMeal(meal)}
              >
                <RecipeImage src={meal.strMealThumb} alt={meal.strMeal} />
                <RecipeInfo>
                  <RecipeTitle>{meal.strMeal}</RecipeTitle>
                  {/* Display tags if available from search.php, not filter.php */}
                  {meal.strCategory && meal.strArea && (
                    <RecipeTags>
                      <span>
                        <FaUtensils /> {meal.strCategory}
                      </span>
                      <span>
                        <FaCalendarAlt /> {meal.strArea}
                      </span>
                    </RecipeTags>
                  )}
                </RecipeInfo>
              </RecipeCard>
            ))}
          </RecipeGrid>
        ) : (
          <ErrorMessage>
            <FaUtensils /> No meals found. Try adjusting your search or filters.
          </ErrorMessage>
        )}
      </ResultsContainer>

      {/* Render Modal Conditionally */}
      {isModalOpen && selectedMealForModal && (
          <LogMealModal
            meal={selectedMealForModal}
            onClose={handleCloseModal}
            onLogMeal={handleLogMeal}
          />
      )}
    </MealsContainer>
  );
};

export default Meals;
