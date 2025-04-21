import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import WorkoutFilters from "./WorkoutFilters";
import { filterWorkouts, sortWorkouts } from "../../utils/workoutUtils";
import WorkoutStats from "./WorkoutStats";
import FavoriteWorkouts from "./FavoriteWorkouts";
import ExerciseCard from "./ExerciseCard";
import PlaceholderModel from "./PlaceholderModel";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const MuscleGroupSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MuscleCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
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
      rgba(52, 152, 219, 0.1),
      rgba(46, 204, 113, 0.1)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const MuscleTitle = styled(motion.h3)`
  color: #2c3e50;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModelContainer = styled(motion.div)`
  height: 200px;
  position: relative;
  z-index: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
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

const ModelViewer = ({ muscle }) => {
  return <PlaceholderModel muscleGroup={muscle} />;
};

const WorkoutGenerator = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: "",
    equipment: "",
    type: "",
  });
  const [sortBy, setSortBy] = useState("name");

  const muscleGroups = [
    { name: "Chest", muscle: "chest" },
    { name: "Back", muscle: "back" },
    { name: "Legs", muscle: "legs" },
    { name: "Arms", muscle: "arms" },
    { name: "Shoulders", muscle: "shoulders" },
    { name: "Core", muscle: "core" },
  ];

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
    <Container>
      <Title>Generate Your Workout</Title>
      <FavoriteWorkouts />
      <MuscleGroupSelector>
        {muscleGroups.map((muscle, index) => (
          <MuscleCard
            key={muscle.name}
            onClick={() => handleMuscleSelect(muscle.name)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MuscleTitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {muscle.name}
            </MuscleTitle>
            <ModelContainer
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <ModelViewer muscle={muscle.muscle} />
            </ModelContainer>
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
  );
};

export default WorkoutGenerator;
