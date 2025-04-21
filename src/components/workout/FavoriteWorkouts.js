import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useFavorites } from "../../hooks/useFavorites";
import ExerciseCard from "./ExerciseCard";

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const FavoriteWorkouts = () => {
  const { favorites } = useFavorites();

  return (
    <Container>
      <Title>
        <span>❤️</span> Favorite Workouts
      </Title>
      {favorites.length === 0 ? (
        <EmptyState>
          <p>
            No favorite workouts yet. Click the heart icon on any exercise to
            add it to your favorites!
          </p>
        </EmptyState>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {favorites.map((workout, index) => (
            <ExerciseCard
              key={workout.name}
              exercise={workout}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </motion.div>
      )}
    </Container>
  );
};

export default FavoriteWorkouts;
