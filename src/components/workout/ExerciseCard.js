import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useFavorites from "../../hooks/useFavorites";

// eslint-disable-next-line no-unused-vars
const unusedImports = null; // This is to suppress warnings about unused imports

const Card = styled(motion.div)`
  background: ${(props) =>
    props.theme.isDark ? "rgba(30, 30, 40, 0.7)" : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid
    ${(props) =>
      props.theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExerciseName = styled.h3`
  color: ${(props) => props.theme.accent};
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${(props) => props.theme.accent};
    transition: width 0.3s ease;
  }

  ${Card}:hover &::after {
    width: 60px;
  }
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

const Instructions = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #34495e;
  line-height: 1.6;
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

      {isExpanded && (
        <Instructions>
          <strong>Instructions:</strong>
          <p>{exercise.instructions}</p>
        </Instructions>
      )}
    </Card>
  );
};

export default ExerciseCard;
