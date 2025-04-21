import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const MuscleGroupSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const WorkoutDisplay = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const ExerciseCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
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
`;

const ModelViewer = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={0.5} />;
};

const WorkoutGenerator = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const muscleGroups = [
    { name: 'Chest', model: '/models/chest.glb' },
    { name: 'Back', model: '/models/back.glb' },
    { name: 'Legs', model: '/models/legs.glb' },
    { name: 'Arms', model: '/models/arms.glb' },
    { name: 'Shoulders', model: '/models/shoulders.glb' },
    { name: 'Core', model: '/models/core.glb' }
  ];

  const fetchWorkouts = async (muscle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle.toLowerCase()}`, {
        headers: {
          'X-Api-Key': process.env.REACT_APP_API_NINJAS_KEY
        }
      });
      setWorkouts(response.data);
    } catch (error) {
      setError('Failed to fetch workouts. Please try again later.');
      console.error('Error fetching workouts:', error);
    }
    setLoading(false);
  };

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
    fetchWorkouts(muscle);
  };

  return (
    <Container>
      <Title>Generate Your Workout</Title>
      <MuscleGroupSelector>
        {muscleGroups.map((muscle) => (
          <MuscleCard
            key={muscle.name}
            onClick={() => handleMuscleSelect(muscle.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3>{muscle.name}</h3>
            <div style={{ height: '200px' }}>
              <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <ModelViewer modelPath={muscle.model} />
                <OrbitControls />
              </Canvas>
            </div>
          </MuscleCard>
        ))}
      </MuscleGroupSelector>

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