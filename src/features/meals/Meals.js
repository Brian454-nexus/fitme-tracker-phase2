import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { keyframes, ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUtensils,
  FaTags,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaAppleAlt,
  FaCarrot,
} from "react-icons/fa";
import LogMealModal from "./LogMealModal"; // Import the modal
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import StylishHeader from "../../components/ui/StylishHeader";
import { lightTheme, darkTheme } from "../../theme";
import { fetchMeals } from "../../services/apiService";

// Debounce Hook with faster response time
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

// API calls are now handled through the apiService

// #region Styled Components
// Screen reader only class
const SROnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const MealsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  color: ${(props) => props.theme.text};
`;

// Removed unused styled component: Header;

// Removed unused styled component: Title;

// Removed unused styled component: Subtitle;

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
  position: relative;
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

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.danger ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  color: ${props => props.danger ? '#dc3545' : '#0d6efd'};
  border: 1px solid ${props => props.danger ? 'rgba(220, 53, 69, 0.2)' : 'rgba(0, 123, 255, 0.2)'};
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.danger ? 'rgba(220, 53, 69, 0.2)' : 'rgba(0, 123, 255, 0.2)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
    outline: 2px solid ${(props) => props.theme.accent};
    outline-offset: 2px;
    border-color: ${(props) => props.theme.accent};
  }
  &:hover {
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
  background: ${(props) => 
    props.theme.isDark 
      ? 'rgba(30, 30, 35, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)'
  };
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid ${(props) => 
    props.theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease, filter 0.6s ease;
  position: relative;
  z-index: 0;
  
  ${RecipeCard}:hover & {
    transform: scale(1.05);
    filter: brightness(1.1) contrast(1.1);
  }
`;

const RecipeInfo = styled.div`
  padding: 1.2rem;
  position: relative;
  z-index: 2;
  background: ${props => 
    props.theme.isDark 
      ? 'linear-gradient(to top, rgba(20, 20, 25, 0.9), rgba(20, 20, 25, 0.7))' 
      : 'linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))'
  };
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-top: 1px solid ${props => 
    props.theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  transform: translateY(0);
  transition: transform 0.3s ease;
  
  ${RecipeCard}:hover & {
    transform: translateY(-5px);
  }
`;

const RecipeTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.accent};
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${props => props.theme.accent};
    transition: width 0.3s ease;
  }
  
  ${RecipeCard}:hover &::after {
    width: 60px;
  }
`;

const RecipeTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.8rem;
  margin-top: 0.8rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  
  ${RecipeCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  span {
    background: ${props => 
      props.theme.isDark 
        ? 'rgba(80, 80, 100, 0.3)' 
        : 'rgba(240, 240, 250, 0.7)'
    };
    padding: 0.3rem 0.7rem;
    border-radius: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid ${props => 
      props.theme.isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)'
    };
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    svg {
      color: ${props => props.theme.accent};
    }
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
  const { isDarkMode, toggleTheme } = useTheme();

  // State for manually logged meals
  const [loggedMeals, setLoggedMeals] = useState(() => {
    const savedMeals = localStorage.getItem("loggedMealsData");
    return savedMeals ? JSON.parse(savedMeals) : [];
  });

  // NEW: Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealForModal, setSelectedMealForModal] = useState(null);

  // Debounced search term with faster response time
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch Categories
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchMeals({ type: "categories" });
        if (data && data.meals) {
          setCategories(data.meals.map((cat) => cat.strCategory));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Handle error silently or show a small indicator
      }
    };
    fetchCategoriesData();
  }, []);

  // Fetch Random Meal on Mount
  useEffect(() => {
    const fetchRandomMeal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMeals({ type: "random" });
        setMeals(data.meals || []);
      } catch (err) {
        console.error("Error fetching random meal:", err);
        setError("Could not fetch a meal suggestion. Please try again later.");
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRandomMeal();
  }, []);

  // Optimized API Call Logic using useCallback
  const fetchMealsData = useCallback(async () => {
    // Set loading state immediately for better UX
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      
      // Case 1: Category selected
      if (selectedCategory) {
        data = await fetchMeals({
          type: "category",
          query: selectedCategory,
        });
      } 
      // Case 2: Search term provided (at least 2 chars)
      else if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
        data = await fetchMeals({
          type: "search",
          query: debouncedSearchTerm,
        });
      } 
      // Case 3: No search or category - fetch random
      else {
        data = await fetchMeals({ type: "random" });
      }

      // Process results
      if (data && data.meals && data.meals.length > 0) {
        setMeals(data.meals);
        setError(null);
      } else {
        setMeals([]);
        if (selectedCategory) {
          setError(`No meals found for category: ${selectedCategory}`);
        } else if (debouncedSearchTerm) {
          setError(`No meals found for "${debouncedSearchTerm}".`);
        } else {
          setError("Could not fetch meal suggestions. Please try again.");
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

  // Optimized Effect for Search Term / Category Change
  useEffect(() => {
    // Always fetch data when search term or category changes
    // The fetchMealsData function handles all the logic
    fetchMealsData();
    
    // No need for additional conditions - the fetchMealsData function
    // will handle empty states and fetch random meals when needed
  }, [debouncedSearchTerm, selectedCategory, fetchMealsData]);

  // Use memoization to optimize performance
  const memoizedMeals = useMemo(() => {
    // This prevents unnecessary re-renders when other state changes
    return meals;
  }, [meals]);

  // Calculate daily nutrition totals with memoization
  const dailyNutritionTotals = useMemo(() => {
    // Only recalculate when loggedMeals changes
    const today = new Date().toISOString().split("T")[0];
    const todayMeals = loggedMeals.filter((meal) => meal.date === today);

    return {
      calories: todayMeals.reduce(
        (sum, meal) => sum + parseInt(meal.calories || 0),
        0
      ),
      protein: todayMeals.reduce(
        (sum, meal) => sum + parseInt(meal.protein || 0),
        0
      ),
      carbs: todayMeals.reduce(
        (sum, meal) => sum + parseInt(meal.carbs || 0),
        0
      ),
      fats: todayMeals.reduce((sum, meal) => sum + parseInt(meal.fats || 0), 0),
    };
  }, [loggedMeals]);

  // NEW: useEffect to save loggedMeals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("loggedMealsData", JSON.stringify(loggedMeals));
    } catch (error) {
      console.error("Error saving logged meals to localStorage:", error);
    }
  }, [loggedMeals]);

  // --- Daily Summary Calculations (using memoized values) ---
  // We're using the memoized nutrition totals instead of calculating them here

  // Use the memoized nutrition totals
  const totalCaloriesToday = dailyNutritionTotals.calories;
  const totalProteinToday = dailyNutritionTotals.protein;
  const totalCarbsToday = dailyNutritionTotals.carbs;
  const totalFatsToday = dailyNutritionTotals.fats;
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
    setLoggedMeals((prevLoggedMeals) => [...prevLoggedMeals, loggedData]);
    setIsModalOpen(false);
    setSelectedMealForModal(null);
    // Optionally: Show a success message/toast
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMealForModal(null);
  };
  
  // Function to clear all meals logged today
  const handleClearTodaysMeals = () => {
    const today = new Date().toISOString().split("T")[0];
    const updatedMeals = loggedMeals.filter(meal => meal.date !== today);
    setLoggedMeals(updatedMeals);
  };
  
  // Function to delete the last meal logged
  const handleDeleteLastMeal = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayMeals = loggedMeals.filter(meal => meal.date === today);
    
    if (todayMeals.length === 0) return;
    
    // Find the most recent meal by timestamp
    const mostRecentMeal = todayMeals.reduce((latest, current) => 
      (current.logTimestamp > latest.logTimestamp) ? current : latest, todayMeals[0]);
    
    // Remove this meal from the logged meals
    const updatedMeals = loggedMeals.filter(meal => meal.logTimestamp !== mostRecentMeal.logTimestamp);
    setLoggedMeals(updatedMeals);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <MealsContainer>
        <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <StylishHeader 
          title="*Meal* Discovery" 
          subtitle="Find delicious recipes and track your nutrition goals"
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '15px' }}>
            <FaAppleAlt style={{ color: '#48bb78', fontSize: '1.5rem' }} />
            <FaCarrot style={{ color: '#ed8936', fontSize: '1.5rem' }} />
            <FaUtensils style={{ color: '#4299e1', fontSize: '1.5rem' }} />
          </div>
        </StylishHeader>

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
            
            {/* Action buttons for managing logged meals */}
            <ActionButtonsContainer>
              <ActionButton
                onClick={handleDeleteLastMeal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={dailyNutritionTotals.calories === 0}
              >
                Delete Last Meal
              </ActionButton>
              <ActionButton
                danger
                onClick={handleClearTodaysMeals}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={dailyNutritionTotals.calories === 0}
              >
                Clear Today's Log
              </ActionButton>
            </ActionButtonsContainer>
          </DailySummaryCard>

          {/* Search and Filters */}
          <SearchSection>
            <SearchBarContainer>
              <FaSearch aria-hidden="true" />
              <SearchInput
                type="text"
                placeholder="Search recipes by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search recipes"
                id="recipe-search"
                autoComplete="off"
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
            <LoadingSpinner role="status" aria-live="polite">
              <FaSpinner aria-hidden="true" />
              <SROnly>Loading meals, please wait...</SROnly>
            </LoadingSpinner>
          ) : error ? (
            <ErrorMessage role="alert" aria-live="assertive">
              <FaExclamationTriangle aria-hidden="true" />
              {error}
            </ErrorMessage>
          ) : memoizedMeals.length > 0 ? (
            <RecipeGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }} // Faster transition
            >
              {memoizedMeals.map((meal) => (
                <RecipeCard
                  key={meal.idMeal}
                  whileHover={{ y: -8, scale: 1.02 }} // Use whileHover instead of CSS for better performance
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }} // Faster transition
                  onClick={() => handleSelectMeal(meal)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${meal.strMeal}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectMeal(meal);
                    }
                  }}
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
              <FaUtensils /> No meals found. Try adjusting your search or
              filters.
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
    </ThemeProvider>
  );
};

export default Meals;
