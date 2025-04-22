import React from "react";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import WorkoutGenerator from "./components/workout/WorkoutGenerator";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";

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

const theme = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    cardBackground: "#F8F9FA",
    accent: "#FF4500",
    border: "#FF4500",
  },
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    cardBackground: "#1E1E1E",
    accent: "#FF4500",
    border: "#FF4500",
  },
};

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <Header>
            <Title>FitMe</Title>
            <Subtitle>Your Personal Fitness & Wellness Tracker</Subtitle>
          </Header>
          <WorkoutGenerator />
        </AppContainer>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
