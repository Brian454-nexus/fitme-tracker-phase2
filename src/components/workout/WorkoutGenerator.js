import React, { useState, useMemo, useCallback } from "react";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { motion } from "framer-motion";
import { filterWorkouts, sortWorkouts } from "../../utils/workoutUtils";
import ExerciseCard from "./ExerciseCard";
import ImageViewer from "./ImageViewer";
import FitMeQuiz from "./FitMeQuiz";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import MotivationalQuote from "../quotes/MotivationalQuote";
import StylishHeader from "../ui/StylishHeader";
import { lightTheme, darkTheme } from "../../theme";
import { fetchExercises } from "../../services/apiService";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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

// Removed unused styled component: Title;

const MuscleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MuscleCard = styled(motion.div)`
  background: ${(props) =>
    props.theme.isDark ? "rgba(30, 30, 40, 0.7)" : "rgba(255, 255, 255, 0.7)"};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid
    ${(props) =>
      props.theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  border-radius: 16px;
  padding: 1.8rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
    border-color: ${(props) => props.theme.accent};

    &::before {
      opacity: 1;
    }
  }

  &.selected {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.accent} 0%,
      ${(props) => `${props.theme.accent}CC`} 100%
    );
    color: white;
    border-color: transparent;
    box-shadow: 0 15px 30px ${(props) => `${props.theme.accent}40`};

    &::before {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      opacity: 1;
    }
  }
`;

const MuscleTitle = styled.h3`
  color: ${(props) => props.theme.text};
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease, color 0.3s ease;

  ${MuscleCard}:hover & {
    transform: translateY(-5px);
    color: ${(props) => props.theme.accent};
  }

  ${MuscleCard}.selected & {
    color: white;
  }
`;

const ModelContainer = styled.div`
  width: 100%;
  height: 200px;
  margin: 1.2rem 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) =>
    props.theme.isDark ? "rgba(20, 20, 30, 0.3)" : "rgba(245, 245, 250, 0.3)"};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  ${MuscleCard}:hover & {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  ${MuscleCard}.selected & {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0)
    );
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${MuscleCard}:hover &::before {
    opacity: 1;
  }
`;

const WorkoutList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: ${fadeIn} 0.8s ease forwards;
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
  const [showQuiz, setShowQuiz] = useState(true); // Show quiz by default
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if quiz is completed
  const [filters] = useState({
    difficulty: "",
    equipment: "",
    type: "",
  });
  const [sortBy] = useState("name");
  const [progress, setProgress] = useState(0);
  const { isDarkMode, toggleTheme } = useTheme();

  const fetchWorkouts = useCallback(async (muscle) => {
    setLoading(true);
    setError(null);
    setProgress(20); // Start progress

    try {
      // Use the API service instead of direct axios call
      const data = await fetchExercises(muscle);
      
      if (data && data.length > 0) {
        setWorkouts(data);
        setProgress(100);
      } else {
        // This should never happen now with our fallback data
        setError("No exercises found for this muscle group.");
        console.warn(`No exercises found for ${muscle}`);
      }
    } catch (err) {
      // This should never happen now with our error handling in fetchExercises
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
  const filteredWorkouts = useMemo(
    () => filterWorkouts(workouts, filters),
    [workouts, filters]
  );

  const sortedWorkouts = useMemo(
    () => sortWorkouts(filteredWorkouts, sortBy),
    [filteredWorkouts, sortBy]
  );

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <StylishHeader
          title="*Workout* Generator"
          subtitle="Select muscle groups and get personalized workout routines to achieve your fitness goals"
        />

        <MotivationalQuote />

        <ButtonContainer>
          {!quizCompleted && (
            <QuizButton
              onClick={() => setShowQuiz(!showQuiz)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={showQuiz ? "Hide fitness quiz" : "Take fitness quiz"}
              aria-expanded={showQuiz}
            >
              {showQuiz ? "Hide Quiz" : "Take FitMe Quiz"}
            </QuizButton>
          )}
          {quizCompleted && (
            <QuizButton
              onClick={() => setShowQuiz(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Retake fitness quiz"
            >
              Retake Quiz
            </QuizButton>
          )}
        </ButtonContainer>

        {showQuiz ? (
          <FitMeQuiz
            onComplete={() => {
              setShowQuiz(false);
              setQuizCompleted(true);
            }}
          />
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
                    if (e.key === "Enter" || e.key === " ") {
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

                {loading ? (
                  <LoadingSpinner role="status" aria-live="polite">
                    <SROnly>Loading workouts, please wait...</SROnly>
                    Loading workouts...
                  </LoadingSpinner>
                ) : error ? (
                  <ErrorMessage role="alert" aria-live="assertive">
                    {error}
                  </ErrorMessage>
                ) : (
                  <WorkoutList>
                    {sortedWorkouts.map((workout) => (
                      <ExerciseCard key={workout.id} exercise={workout} />
                    ))}
                  </WorkoutList>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WorkoutGenerator;
