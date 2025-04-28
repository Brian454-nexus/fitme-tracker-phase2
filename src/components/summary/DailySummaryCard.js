import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaWater, FaAppleAlt, FaDumbbell, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Animation keyframes
const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const CardContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: ${props => 
    props.theme.isDark 
      ? 'rgba(30, 30, 40, 0.85)' 
      : 'rgba(255, 255, 255, 0.85)'
  };
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => 
    props.theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  overflow: hidden;
  z-index: 1000;
  animation: ${slideIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  
  &.minimized {
    height: 60px;
    cursor: pointer;
  }
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: ${props => props.theme.accent};
  color: white;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .controls {
    display: flex;
    gap: 10px;
    
    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      border-radius: 50%;
      transition: background 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
`;

const CardContent = styled.div`
  padding: 15px 20px;
  max-height: ${props => props.isMinimized ? '0' : '300px'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const ProgressItem = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: ${props => props.theme.text};
      
      svg {
        color: ${props => props.theme.accent};
      }
    }
    
    .value {
      font-weight: 600;
      color: ${props => props.theme.accent};
    }
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${props => 
    props.theme.isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  border-radius: 4px;
  overflow: hidden;
  
  .fill {
    height: 100%;
    background: ${props => props.color || props.theme.accent};
    width: ${props => props.progress}%;
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

const PulseButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${pulse} 2s infinite;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const DailySummaryCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [summaryData, setSummaryData] = useState({
    water: { current: 0, goal: 2000 },
    meals: { current: 0, goal: 3 },
    workouts: { current: 0, goal: 1 }
  });
  
  // Fetch real data from localStorage
  useEffect(() => {
    const fetchData = () => {
      // Get water intake data
      let waterIntake = { current: 0, goal: 2000 };
      try {
        const storedWaterData = localStorage.getItem('waterIntake');
        if (storedWaterData) {
          const parsedData = JSON.parse(storedWaterData);
          const today = new Date().toISOString().split('T')[0];
          
          // Get today's entries
          const todayEntries = parsedData[today]?.entries || [];
          const totalIntake = todayEntries.reduce(
            (sum, entry) => sum + (Number(entry.volume) || 0), 
            0
          );
          
          waterIntake = { 
            current: totalIntake, 
            goal: parsedData.dailyGoal || 2000 
          };
        }
      } catch (error) {
        console.error('Error fetching water intake data:', error);
      }
      
      // Get meals data
      let loggedMeals = 0;
      try {
        const storedMealsData = localStorage.getItem('loggedMealsData');
        if (storedMealsData) {
          const parsedMeals = JSON.parse(storedMealsData);
          const today = new Date().toISOString().split('T')[0];
          loggedMeals = parsedMeals.filter(meal => meal.date === today).length;
        }
      } catch (error) {
        console.error('Error fetching meals data:', error);
      }
      
      // Get workout data
      let workouts = 0;
      try {
        const storedWorkouts = localStorage.getItem('completedWorkouts');
        if (storedWorkouts) {
          const parsedWorkouts = JSON.parse(storedWorkouts);
          const today = new Date().toDateString();
          workouts = parsedWorkouts.filter(
            workout => new Date(workout.date).toDateString() === today
          ).length;
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
      
      setSummaryData({
        water: waterIntake,
        meals: { current: loggedMeals, goal: 3 },
        workouts: { current: workouts, goal: 1 }
      });
    };
    
    // Initial fetch
    fetchData();
    
    // Set up interval to refresh data every 30 seconds
    const dataRefreshInterval = setInterval(fetchData, 30000);
    
    // Show card after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    // Clean up intervals and timers
    return () => {
      clearTimeout(timer);
      clearInterval(dataRefreshInterval);
    };
  }, []);
  
  // Auto-hide after 10 seconds if not interacted with
  useEffect(() => {
    let timer;
    if (isVisible && !isMinimized) {
      timer = setTimeout(() => {
        setIsMinimized(true);
      }, 10000);
    }
    
    return () => clearTimeout(timer);
  }, [isVisible, isMinimized]);
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const closeCard = () => {
    setIsVisible(false);
  };
  
  const showCard = () => {
    setIsVisible(true);
    setIsMinimized(false);
  };
  
  if (!isVisible) {
    return <PulseButton onClick={showCard}><FaChevronUp /></PulseButton>;
  }
  
  return (
    <CardContainer 
      className={isMinimized ? 'minimized' : ''}
      onClick={isMinimized ? toggleMinimize : undefined}
    >
      <CardHeader>
        <h3>
          {isMinimized ? 'Daily Progress Summary' : 'Today\'s Progress'}
        </h3>
        <div className="controls">
          <button onClick={toggleMinimize}>
            {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button onClick={closeCard}>
            <FaTimes />
          </button>
        </div>
      </CardHeader>
      
      <CardContent isMinimized={isMinimized}>
        <ProgressItem>
          <div className="header">
            <div className="title">
              <FaWater /> Water Intake
            </div>
            <div className="value">
              {summaryData.water.current}ml / {summaryData.water.goal}ml
            </div>
          </div>
          <ProgressBar 
            progress={(summaryData.water.current / summaryData.water.goal) * 100}
            color="#4299e1"
          >
            <div className="fill"></div>
          </ProgressBar>
        </ProgressItem>
        
        <ProgressItem>
          <div className="header">
            <div className="title">
              <FaAppleAlt /> Meals Logged
            </div>
            <div className="value">
              {summaryData.meals.current} / {summaryData.meals.goal}
            </div>
          </div>
          <ProgressBar 
            progress={(summaryData.meals.current / summaryData.meals.goal) * 100}
            color="#48bb78"
          >
            <div className="fill"></div>
          </ProgressBar>
        </ProgressItem>
        
        <ProgressItem>
          <div className="header">
            <div className="title">
              <FaDumbbell /> Workouts Completed
            </div>
            <div className="value">
              {summaryData.workouts.current} / {summaryData.workouts.goal}
            </div>
          </div>
          <ProgressBar 
            progress={(summaryData.workouts.current / summaryData.workouts.goal) * 100}
            color="#ed8936"
          >
            <div className="fill"></div>
          </ProgressBar>
        </ProgressItem>
      </CardContent>
    </CardContainer>
  );
};

export default DailySummaryCard;