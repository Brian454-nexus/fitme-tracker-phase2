import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaExpand, FaCompress } from "react-icons/fa";
import useFavorites from "../../hooks/useFavorites";
import PlaceholderModel from "./PlaceholderModel";

const Card = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExerciseName = styled.h3`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const CardContent = styled.div`
  margin-bottom: 1rem;
`;

const ExerciseInfo = styled.div`
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  margin: 0.5rem 0;
  color: #34495e;
`;

const ModelContainer = styled.div`
  height: 200px;
  margin: 1rem 0;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
`;

const Instructions = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #34495e;
  line-height: 1.6;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #7f8c8d;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #2c3e50;
  }
`;

const ExerciseCard = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(exercise);
  };

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader>
        <ExerciseName>{exercise.name}</ExerciseName>
        <FavoriteButton onClick={handleFavoriteClick}>
          {isFavorite(exercise) ? (
            <FaHeart color="#e74c3c" />
          ) : (
            <FaRegHeart color="#95a5a6" />
          )}
        </FavoriteButton>
      </CardHeader>

      <CardContent>
        <ExerciseInfo>
          <InfoItem>
            <strong>Type:</strong> {exercise.type}
          </InfoItem>
          <InfoItem>
            <strong>Equipment:</strong> {exercise.equipment}
          </InfoItem>
          <InfoItem>
            <strong>Difficulty:</strong> {exercise.difficulty}
          </InfoItem>
        </ExerciseInfo>

        <ModelContainer>
          <PlaceholderModel muscleGroup={exercise.muscle} />
        </ModelContainer>

        {isExpanded && (
          <Instructions>
            <strong>Instructions:</strong>
            <p>{exercise.instructions}</p>
          </Instructions>
        )}
      </CardContent>

      <ExpandButton>
        {isExpanded ? <FaCompress /> : <FaExpand />}
      </ExpandButton>
    </Card>
  );
};

export default ExerciseCard;
