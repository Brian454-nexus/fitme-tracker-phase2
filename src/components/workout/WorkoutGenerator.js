import React, { useState, useMemo, useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import WorkoutFilters from "./WorkoutFilters";
import { filterWorkouts, sortWorkouts } from "../../utils/workoutUtils";
import WorkoutStats from "./WorkoutStats";
import ExerciseCard from "./ExerciseCard";
import ImageViewer from "./ImageViewer";
import FitMeQuiz from "./FitMeQuiz";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import MotivationalQuote from "../quotes/MotivationalQuote";
import { lightTheme, darkTheme } from "../../theme";
import { fetchExercises } from "../../services/apiService";

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

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: ${(props) => props.theme.background};
  min-height: 100vh;
  transition: background-color 0.3s ease;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.text};
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const MuscleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MuscleCard = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${(props) => props.theme.accent};
  }

  &.selected {
    background: ${(props) => props.theme.accent};
    color: white;
  }
`;

const MuscleTitle = styled.h3`
  color: ${(props) => props.theme.text};
  margin: 0;
  font-size: 1.2rem;
`;

const ModelContainer = styled.div`
  width: 100%;
  height: 200px;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
`;

const WorkoutList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${(props) => props.theme.text};
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.error};
  text-align: center;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const QuizButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${(props) => props.theme.accent};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background: ${(props) => props.theme.cardBackground};
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: ${(props) => props.theme.accent};
  border-radius: 4px;
`;

const muscleGroups = [
  { name: "Chest", value: "chest", image: "/images/muscles/chest.png" },
  { name: "Back", value: "back", image: "/images/muscles/back.jpeg" },
  { name: "Legs", value: "legs", image: "/images/muscles/legs.png" },
  { name: "Abs", value: "abs", image: "/images/muscles/core.png" },
  { name: "Arms", value: "arms", image: "/images/muscles/arms.jpeg" },
];

const WorkoutGenerator = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "",
    equipment: "",
    type: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [progress, setProgress] = useState(0);
  const { isDarkMode, toggleTheme } = useTheme();

  const fetchWorkouts = useCallback(async (muscle) => {
    setLoading(true);
    setError(null);
    setProgress(20); // Start progress
    
    try {
      // Use the API service instead of direct axios call
      const data = await fetchExercises(muscle);
      setWorkouts(data);
      setProgress(100);
    } catch (err) {
      setError("Failed to fetch workouts. Please try again later.");
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
    setProgress(0);
    fetchWorkouts(muscle.value);
  };

  // Use memoization to avoid unnecessary recalculations
  const filteredWorkouts = useMemo(() => 
    filterWorkouts(workouts, filters), 
    [workouts, filters]
  );
  
  const sortedWorkouts = useMemo(() => 
    sortWorkouts(filteredWorkouts, sortBy), 
    [filteredWorkouts, sortBy]
  );

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Title>Workout Generator</Title>

        <MotivationalQuote />

        <ButtonContainer>
          <QuizButton
            onClick={() => setShowQuiz(!showQuiz)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={showQuiz ? "Hide fitness quiz" : "Take fitness quiz"}
            aria-expanded={showQuiz}
          >
            {showQuiz ? "Hide Quiz" : "Take FitMe Quiz"}
          </QuizButton>
        </ButtonContainer>

        {showQuiz ? (
          <FitMeQuiz onComplete={() => setShowQuiz(false)} />
        ) : (
          <>
            <MuscleGrid>
              {muscleGroups.map((muscle) => (
                <MuscleCard
                  key={muscle.value}
                  onClick={() => handleMuscleSelect(muscle)}
                  className={
                    selectedMuscle?.value === muscle.value ? "selected" : ""
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedMuscle?.value === muscle.value}
                  aria-label={`Select ${muscle.name} muscle group`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMuscleSelect(muscle);
                    }
                  }}
                >
                  <MuscleTitle>{muscle.name}</MuscleTitle>
                  <ModelContainer>
                    <ImageViewer
                      imageUrl={muscle.image}
                      alt={`${muscle.name} muscle group`}
                    />
                  </ModelContainer>
                </MuscleCard>
              ))}
            </MuscleGrid>

            {selectedMuscle && (
              <>
                <ProgressContainer>
                  <ProgressBar
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </ProgressContainer>

                <WorkoutFilters
                  filters={filters}
                  setFilters={setFilters}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                {loading ? (
                  <LoadingSpinner role="status" aria-live="polite">
                    <SROnly>Loading workouts, please wait...</SROnly>
                    Loading workouts...
                  </LoadingSpinner>
                ) : error ? (
                  <ErrorMessage role="alert" aria-live="assertive">{error}</ErrorMessage>
                ) : (
                  <WorkoutList>
                    {sortedWorkouts.map((workout) => (
                      <ExerciseCard key={workout.id} exercise={workout} />
                    ))}
                  </WorkoutList>
                )}

                <WorkoutStats workouts={sortedWorkouts} />
              </>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WorkoutGenerator;
