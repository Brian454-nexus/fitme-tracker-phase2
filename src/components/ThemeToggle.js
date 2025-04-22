import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ToggleContainer = styled(motion.div)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: ${(props) => props.theme.cardBackground};
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Icon = styled(motion.div)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
`;

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <ToggleContainer
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon>{isDarkMode ? "🌞" : "🌙"}</Icon>
    </ToggleContainer>
  );
};

export default ThemeToggle;
