import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { getModelConfig } from '../../utils/modelUtils';

const Card = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
`;

const DifficultyBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => {
    switch (props.difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FFC107';
      case 'expert':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
  font-weight: bold;
`;

const ModelContainer = styled.div`
  height: 300px;
  margin: 1rem 0;
  border-radius: 10px;
  overflow: hidden;
`;

const Instructions = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const ExerciseCard = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const modelConfig = getModelConfig(exercise.muscle);

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <ExerciseHeader>
        <ExerciseTitle>{exercise.name}</ExerciseTitle>
        <DifficultyBadge difficulty={exercise.difficulty}>
          {exercise.difficulty}
        </DifficultyBadge>
      </ExerciseHeader>

      <ModelContainer>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <primitive
            object={useGLTF(modelConfig.path).scene}
            scale={modelConfig.scale}
            position={modelConfig.position}
            rotation={modelConfig.rotation}
          />
          <OrbitControls />
        </Canvas>
      </ModelContainer>

      {isExpanded && (
        <Instructions>
          <h4>Instructions:</h4>
          <p>{exercise.instructions}</p>
          <p><strong>Equipment:</strong> {exercise.equipment}</p>
          <p><strong>Muscle Group:</strong> {exercise.muscle}</p>
        </Instructions>
      )}
    </Card>
  );
};

export default ExerciseCard; 