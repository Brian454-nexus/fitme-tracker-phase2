import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import WorkoutFilters from "./WorkoutFilters";
import { filterWorkouts, sortWorkouts } from "../../utils/workoutUtils";
import WorkoutStats from "./WorkoutStats";
import ExerciseCard from "./ExerciseCard";
import ImageViewer from "./ImageViewer";
import FitMeQuiz from "./FitMeQuiz";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

const lightTheme = {
  primary: "#FF4500",
  secondary: "#000000",
  accent: "#FF4500",
  background: "#FFFFFF",
  text: "#333333",
  cardBackground: "#F8F9FA",
  border: "#E0E0E0",
};

const darkTheme = {
  primary: "#FF4500",
  secondary: "#FFFFFF",
  accent: "#FF4500",
  background: "#121212",
  text: "#FFFFFF",
  cardBackground: "#1E1E1E",
  border: "#333333",
};

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
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
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
  { name: "Back", value: "back", image: "/images/muscles/back.png" },
  { name: "Legs", value: "legs", image: "/images/muscles/legs.png" },
  {
    name: "Shoulders",
    value: "shoulders",
    image: "/images/muscles/shoulders.png",
  },
  { name: "Arms", value: "arms", image: "/images/muscles/arms.png" },
  { name: "Abs", value: "abs", image: "/images/muscles/abs.png" },
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

  const fetchWorkouts = async (muscle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
        {
          headers: {
            "X-Api-Key": process.env.REACT_APP_API_NINJAS_KEY,
          },
        }
      );
      setWorkouts(response.data);
      setProgress(100);
    } catch (err) {
      setError("Failed to fetch workouts. Please try again later.");
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
    setProgress(0);
    fetchWorkouts(muscle.value);
  };

  const filteredWorkouts = filterWorkouts(workouts, filters);
  const sortedWorkouts = sortWorkouts(filteredWorkouts, sortBy);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Title>Workout Generator</Title>

        <ButtonContainer>
          <QuizButton
            onClick={() => setShowQuiz(!showQuiz)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                >
                  <MuscleTitle>{muscle.name}</MuscleTitle>
                  <ModelContainer>
                    <ImageViewer muscle={muscle.value} image={muscle.image} />
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
                  <LoadingSpinner>Loading workouts...</LoadingSpinner>
                ) : error ? (
                  <ErrorMessage>{error}</ErrorMessage>
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
