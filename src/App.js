import React from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutGenerator from "./components/workout/WorkoutGenerator";
import WaterIntakeTracker from "./components/hydration/WaterIntakeTracker";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { lightTheme } from './theme';

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
