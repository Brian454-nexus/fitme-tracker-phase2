import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaPlus, FaTint, FaTrashAlt, FaHistory, FaCalendarAlt, FaBullseye } from 'react-icons/fa';

const CUP_VOLUME = 250;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.text};
  opacity: 0.7;
  font-size: 1.1rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProgressSection = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProgressTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 1.5rem;
  background: ${props => props.theme.border};
  border-radius: 1rem;
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.accent}, #ff6b6b);
  border-radius: 1rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const ProgressValue = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
`;

const ProgressGoal = styled.span`
  color: ${props => props.theme.text};
  opacity: 0.7;
`;

const CupSection = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const Cup = styled(motion.div)`
  background: ${props => props.isFilled ? 'linear-gradient(135deg, #4dabf7, #339af0)' : props.theme.cardBackground};
  color: ${props => props.isFilled ? 'white' : props.theme.text};
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    opacity: ${props => props.isFilled ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CupIcon = styled(FaTint)`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const CupText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
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
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const SettingsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 0.8rem;
  font-size: 1rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  margin-top: 0.5rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.1);
  }
`;

const HistorySection = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const HistoryTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const HistoryList = styled.div`
  display: grid;
  gap: 1rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const HistoryDate = styled.span`
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const HistoryAmount = styled.span`
  color: ${props => props.theme.accent};
  font-weight: 600;
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
  }, [cups, selectedDate, intakeHistory]);

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
      <Header>
        <Title>Water Intake Tracker</Title>
        <Subtitle>Stay hydrated, stay healthy</Subtitle>
      </Header>

      <MainContent>
        <ProgressSection>
          <ProgressHeader>
            <ProgressTitle>Today's Progress</ProgressTitle>
            <ProgressValue>{totalIntake}ml</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressBar>
          <ProgressText>
            <ProgressValue>{progressPercent}% Complete</ProgressValue>
            <ProgressGoal>Goal: {dailyGoal}ml</ProgressGoal>
          </ProgressText>
        </ProgressSection>

        <CupSection>
          <ProgressHeader>
            <ProgressTitle>Add Water</ProgressTitle>
          </ProgressHeader>
          <CupGrid>
            {cups.map((id) => (
              <Cup
                key={id}
                isFilled
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CupIcon />
                <CupText>{CUP_VOLUME}ml</CupText>
              </Cup>
            ))}
            <Cup
              onClick={handleAddCup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus size={24} />
              <CupText>Add Cup</CupText>
            </Cup>
          </CupGrid>
        </CupSection>
      </MainContent>

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

      <SettingsSection>
        <Card>
          <CardHeader>
            <FaCalendarAlt />
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Card>

        <Card>
          <CardHeader>
            <FaBullseye />
            <CardTitle>Daily Goal</CardTitle>
          </CardHeader>
          <Input
            type="number"
            value={dailyGoal}
            onChange={handleGoalChange}
            min="500"
            max="5000"
            step="100"
            placeholder="Enter daily goal in ml"
          />
        </Card>
      </SettingsSection>

      <Button
        onClick={() => setShowHistory(!showHistory)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHistory /> {showHistory ? 'Hide History' : 'Show History'}
      </Button>

      <AnimatePresence>
        {showHistory && (
          <HistorySection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <HistoryHeader>
              <HistoryTitle>Water Intake History</HistoryTitle>
            </HistoryHeader>
            <HistoryList>
              {Object.entries(intakeHistory)
                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                .map(([date, cups]) => (
                  <HistoryItem key={date}>
                    <HistoryDate>{format(new Date(date), 'MMMM dd, yyyy')}</HistoryDate>
                    <HistoryAmount>{cups.length * CUP_VOLUME}ml</HistoryAmount>
                  </HistoryItem>
                ))}
            </HistoryList>
          </HistorySection>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default WaterIntakeTracker; 