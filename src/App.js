import React from 'react';
import styled from 'styled-components';
import WorkoutGenerator from './components/workout/WorkoutGenerator';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>FitMe</Title>
        <Subtitle>Your Personal Fitness & Wellness Tracker</Subtitle>
      </Header>
      <WorkoutGenerator />
    </AppContainer>
  );
}

export default App;
