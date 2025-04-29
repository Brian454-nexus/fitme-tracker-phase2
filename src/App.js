import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkoutGenerator from "./components/workout/WorkoutGenerator";
import WaterIntakeTracker from "./components/hydration/WaterIntakeTracker";
import Meals from "./features/meals/Meals";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { lightTheme } from "./theme";
import Navigation from "./components/Navigation";
import DailySummaryCard from "./components/summary/DailySummaryCard";
import AmbientSoundButton from "./components/audio/AmbientSoundButton";
import AuthModal from "./components/auth/AuthModal";
import "./App.css";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show auth modal after a short delay when the app loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuthModal(true);
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <CustomThemeProvider>
      <AuthProvider>
        <ThemeProvider theme={lightTheme}>
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<WorkoutGenerator />} />
              <Route path="/hydration" element={<WaterIntakeTracker />} />
              <Route path="/meals" element={<Meals />} />
            </Routes>
            <DailySummaryCard />
            <AmbientSoundButton />

            {/* Auth Modal */}
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
            />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
