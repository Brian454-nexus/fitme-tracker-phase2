import React from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutGenerator from "./components/workout/WorkoutGenerator";
import WaterIntakeTracker from "./components/hydration/WaterIntakeTracker";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { lightTheme, darkTheme } from './theme';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.background};
  padding: 2rem;
  transition: background-color 0.3s ease;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
  opacity: 0.8;
`;

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={lightTheme}>
        <Router>
          <Routes>
            <Route path="/" element={<WorkoutGenerator />} />
            <Route path="/hydration" element={<WaterIntakeTracker />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
