import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaPlus, FaTint, FaTrashAlt, FaHistory, FaWater } from 'react-icons/fa';

const CUP_VOLUME = 250;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`;

const ProgressContainer = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 1rem;
  background: ${props => props.theme.border};
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.accent};
  border-radius: 0.5rem;
`;

const ProgressText = styled.p`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  text-align: center;
  margin: 0.5rem 0;
`;

const CupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const Cup = styled(motion.div)`
  background: ${props => props.isFilled ? props.theme.accent : props.theme.cardBackground};
  color: ${props => props.isFilled ? 'white' : props.theme.text};
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'danger' ? '#ff4444' : props.theme.accent};
  color: white;
  padding: 1rem 2rem;
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

const Card = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const HistoryList = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const WaterIntakeTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [cups, setCups] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [intakeHistory, setIntakeHistory] = useState({});

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('waterIntake')) || {};
    setIntakeHistory(storedData);
    setCups(storedData[selectedDate] || []);
  }, [selectedDate]);

  useEffect(() => {
    const updatedHistory = { ...intakeHistory, [selectedDate]: cups };
    setIntakeHistory(updatedHistory);
    localStorage.setItem('waterIntake', JSON.stringify(updatedHistory));
  }, [cups, selectedDate]);

  const handleAddCup = () => {
    setCups([...cups, Date.now()]);
  };

  const handleRemoveLastCup = () => {
    if (cups.length > 0) {
      setCups(cups.slice(0, -1));
    }
  };

  const handleClearDay = () => {
    setCups([]);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleGoalChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setDailyGoal(val);
  };

  const totalIntake = cups.length * CUP_VOLUME;
  const progressPercent = Math.min((totalIntake / dailyGoal) * 100, 100);

  return (
    <Container>
      <Title>Water Intake Tracker</Title>

      <ProgressContainer>
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBar>
        <ProgressText>
          {totalIntake}ml / {dailyGoal}ml
        </ProgressText>
      </ProgressContainer>

      <CupGrid>
        {cups.map((id) => (
          <Cup
            key={id}
            isFilled
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <FaTint size={24} />
            <span>{CUP_VOLUME}ml</span>
          </Cup>
        ))}
        <Cup
          onClick={handleAddCup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus size={24} />
          <span>Add Cup</span>
        </Cup>
      </CupGrid>

      <ButtonGroup>
        <Button
          onClick={handleAddCup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add Cup
        </Button>
        <Button
          onClick={handleRemoveLastCup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrashAlt /> Remove Last
        </Button>
        <Button
          variant="danger"
          onClick={handleClearDay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrashAlt /> Clear Day
        </Button>
      </ButtonGroup>

      <Card>
        <label>Select Date:</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </Card>

      <Card>
        <label>Daily Goal (ml):</label>
        <Input
          type="number"
          value={dailyGoal}
          onChange={handleGoalChange}
          min="500"
          max="5000"
          step="100"
        />
      </Card>

      <Button
        onClick={() => setShowHistory(!showHistory)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHistory /> {showHistory ? 'Hide History' : 'Show History'}
      </Button>

      <AnimatePresence>
        {showHistory && (
          <HistoryList
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>Water Intake History</h3>
            {Object.entries(intakeHistory)
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
              .map(([date, cups]) => (
                <HistoryItem key={date}>
                  <span>{format(new Date(date), 'MMMM dd, yyyy')}</span>
                  <span>{cups.length * CUP_VOLUME}ml</span>
                </HistoryItem>
              ))}
          </HistoryList>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default WaterIntakeTracker; 