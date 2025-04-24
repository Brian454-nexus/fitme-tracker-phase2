import React from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkoutGenerator from "./components/workout/WorkoutGenerator";
import WaterIntakeTracker from "./components/hydration/WaterIntakeTracker";
import Meals from "./features/meals/Meals";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { lightTheme } from "./theme";
import Navigation from "./components/Navigation";
import "./App.css";

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<WorkoutGenerator />} />
            <Route path="/hydration" element={<WaterIntakeTracker />} />
            <Route path="/meals" element={<Meals />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
