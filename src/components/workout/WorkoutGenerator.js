import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import WorkoutFilters from "./WorkoutFilters";
import { filterWorkouts, sortWorkouts } from "../../utils/workoutUtils";
import WorkoutStats from "./WorkoutStats";
import FavoriteWorkouts from "./FavoriteWorkouts";
import ExerciseCard from "./ExerciseCard";
import ImageViewer from "./ImageViewer";
import FitMeQuiz from "./FitMeQuiz";
import ThemeToggle from "../ThemeToggle";

const lightTheme = {
  primary: "#FF0000",
  secondary: "#000000",
  accent: "#000080",
  background: "#FFFFFF",
  text: "#333333",
  cardBackground: "#F8F9FA",
};

const darkTheme = {
  primary: "#FF0000",
  secondary: "#FFFFFF",
  accent: "#000080",
  background: "#121212",
  text: "#FFFFFF",
  cardBackground: "#1E1E1E",
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
  color: ${theme.secondary};
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const MuscleGroupSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MuscleTitle = styled(motion.h3)`
  color: ${theme.secondary};
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
`;

const MuscleCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid ${theme.accent};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: ${theme.primary};

    &::before {
      opacity: 1;
    }

    ${MuscleTitle} {
      color: ${theme.primary};
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(255, 0, 0, 0.1),
      rgba(0, 0, 128, 0.1)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const Description = styled(motion.p)`
  color: ${theme.text};
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  position: relative;
  z-index: 1;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  height: 200px;
  margin: 1rem 0;
  border-radius: 10px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.3)
    );
  }
`;

const WorkoutDisplay = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  border: 1px solid #eee;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
  border: 1px solid #ef9a9a;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const QuizButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;

  &:hover {
    background: ${theme.accent};
  }
`;

const muscleGroups = [
  {
    name: "Chest",
    imageUrl: "/images/muscles/chest.png",
    description: "Build a powerful chest with targeted exercises",
  },
  {
    name: "Back",
    imageUrl: "/images/muscles/back.jpeg",
    description: "Strengthen your back muscles for better posture",
  },
  {
    name: "Legs",
    imageUrl: "/images/muscles/legs.png",
    description: "Develop strong and defined leg muscles",
  },
  {
    name: "Arms",
    imageUrl: "/images/muscles/arms.jpeg",
    description: "Sculpt your arms with focused workouts",
  },
  {
    name: "Core",
    imageUrl: "/images/muscles/core.png",
    description: "Strengthen your core for better stability",
  },
];

const WorkoutGenerator = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "",
    equipment: "",
    type: "",
  });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const fetchWorkouts = async (muscle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/exercises?muscle=${muscle.toLowerCase()}`,
        {
          headers: {
            "X-Api-Key": process.env.REACT_APP_API_NINJAS_KEY,
          },
        }
      );
      setWorkouts(response.data);
    } catch (error) {
      setError("Failed to fetch workouts. Please try again later.");
      console.error("Error fetching workouts:", error);
    }
    setLoading(false);
  };

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
    fetchWorkouts(muscle);
  };

  const handleApplyFilters = () => {
    // Filter and sort the workouts
    const filteredWorkouts = filterWorkouts(workouts, filters);
    const sortedWorkouts = sortWorkouts(filteredWorkouts, sortBy);
    setWorkouts(sortedWorkouts);
  };

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
          <FitMeQuiz />
        ) : (
          <>
            <FavoriteWorkouts />
            <MuscleGroupSelector>
              {muscleGroups.map((group, index) => (
                <MuscleCard
                  key={group.name}
                  onClick={() => handleMuscleSelect(group.name)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MuscleTitle
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {group.name}
                  </MuscleTitle>
                  <ImageContainer
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <ImageViewer
                      imageUrl={group.imageUrl}
                      alt={`${group.name} muscle group`}
                    />
                  </ImageContainer>
                  <Description
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    {group.description}
                  </Description>
                </MuscleCard>
              ))}
            </MuscleGroupSelector>

            {selectedMuscle && (
              <>
                <WorkoutFilters
                  filters={filters}
                  setFilters={setFilters}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onApplyFilters={handleApplyFilters}
                />
                <WorkoutStats workouts={workouts} />
              </>
            )}
          </>
        )}

        {loading && (
          <LoadingSpinner>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              🔄
            </motion.div>
          </LoadingSpinner>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {workouts.length > 0 && (
          <WorkoutDisplay>
            <h2>{selectedMuscle} Workouts</h2>
            {workouts.map((workout, index) => (
              <ExerciseCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3>{workout.name}</h3>
                <p>Difficulty: {workout.difficulty}</p>
                <p>Equipment: {workout.equipment}</p>
                <p>Instructions: {workout.instructions}</p>
              </ExerciseCard>
            ))}
          </WorkoutDisplay>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WorkoutGenerator;
