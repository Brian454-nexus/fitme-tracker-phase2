import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaSave,
  FaDrumstickBite,
  FaBreadSlice,
  FaOilCan,
} from "react-icons/fa"; // Example icons

// Styled Components for the Modal
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: ${(props) => props.theme.text};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.text};
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MealImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const MealTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.8;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border-radius: 0.5rem;
    border: 1px solid ${(props) => props.theme.border};
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.accent};
    }
  }
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const LogButton = styled(motion.button)`
  background: ${(props) => props.theme.accent};
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const LogMealModal = ({ meal, onClose, onLogMeal }) => {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const loggedData = {
      name: meal.strMeal,
      thumb: meal.strMealThumb,
      idMeal: meal.idMeal,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
      date: new Date().toISOString().split("T")[0], // Logged today
      logTimestamp: Date.now(), // Unique ID for the log entry
    };
    onLogMeal(loggedData);
  };

  if (!meal) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
          <ModalHeader>
            <MealImage src={meal.strMealThumb} alt={meal.strMeal} />
            <MealTitle>{meal.strMeal}</MealTitle>
          </ModalHeader>
          <p
            style={{ opacity: 0.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}
          >
            Enter the estimated nutrition values for your portion.
          </p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="calories">
                <FaUtensils /> Calories (kcal)
              </label>
              <input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g., 450"
                min="0"
                required
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="protein">
                <FaDrumstickBite /> Protein (g)
              </label>
              <input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g., 30"
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="carbs">
                <FaBreadSlice /> Carbs (g)
              </label>
              <input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g., 55"
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="fats">
                <FaOilCan /> Fats (g)
              </label>
              <input
                id="fats"
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="e.g., 15"
                min="0"
              />
            </FormGroup>
            {/* Add Meal Type dropdown later if needed */}
            <ButtonContainer>
              <LogButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSave /> Log This Meal
              </LogButton>
            </ButtonContainer>
          </Form>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default LogMealModal;
