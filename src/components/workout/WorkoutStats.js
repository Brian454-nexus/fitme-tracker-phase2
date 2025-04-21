import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getWorkoutStats } from "../../utils/workoutUtils";

const StatsContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatsTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const DifficultyStats = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const DifficultyBar = styled.div`
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin: 0.5rem 0;
  overflow: hidden;
`;

const DifficultyFill = styled(motion.div)`
  height: 100%;
  background: ${(props) => {
    switch (props.difficulty) {
      case "beginner":
        return "#4CAF50";
      case "intermediate":
        return "#FFC107";
      case "expert":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }};
`;

const WorkoutStats = ({ workouts }) => {
  const stats = getWorkoutStats(workouts);

  return (
    <StatsContainer>
      <StatsTitle>Workout Statistics</StatsTitle>
      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Workouts</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue>{Object.keys(stats.byEquipment).length}</StatValue>
          <StatLabel>Equipment Types</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>{Object.keys(stats.byType).length}</StatValue>
          <StatLabel>Exercise Types</StatLabel>
        </StatCard>
      </StatsGrid>

      <DifficultyStats>
        <h4>Difficulty Distribution</h4>
        {Object.entries(stats.byDifficulty).map(([difficulty, count]) => (
          <div key={difficulty}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{difficulty}</span>
              <span>{count}</span>
            </div>
            <DifficultyBar>
              <DifficultyFill
                difficulty={difficulty}
                initial={{ width: 0 }}
                animate={{ width: `${(count / stats.total) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </DifficultyBar>
          </div>
        ))}
      </DifficultyStats>
    </StatsContainer>
  );
};

export default WorkoutStats;
