import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  FaPlus,
  FaTint,
  FaTrashAlt,
  FaHistory,
  FaCalendarAlt,
  FaBullseye,
  FaClock,
} from 'react-icons/fa';

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
  color: ${(props) => props.theme.text};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.text};
  opacity: 0.7;
  font-size: 1.1rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CircularProgressSection = styled.div`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const SvgCircularProgress = styled.svg`
  width: 200px;
  height: 200px;
  transform: rotate(-90deg);
`;

const CircleBg = styled.circle`
  fill: none;
  stroke: ${(props) => props.theme.border};
  stroke-width: 10;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: ${(props) => props.theme.accent};
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease-out;
`;

const ProgressTextContainer = styled.div`
  margin-top: -160px; /* Adjust based on SVG size */
  margin-bottom: 50px; /* Adjust based on SVG size */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressPercentText = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};
`;

const ProgressAmountText = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(props) => props.theme.text};
  margin: 0.25rem 0;
`;

const ProgressRemainingText = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.text};
  opacity: 0.6;
`;

const GoalText = styled.p`
  margin-top: 1.5rem;
  color: ${(props) => props.theme.text};
  opacity: 0.8;
`;

const CupSection = styled.div`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const CupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Cup = styled(motion.div)`
  background: ${(props) =>
    props.isFilled
      ? `linear-gradient(135deg, ${props.theme.accent}, #ff6b6b)`
      : props.theme.cardBackground};
  color: ${(props) => (props.isFilled ? 'white' : props.theme.text)};
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
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0)
    );
    opacity: ${(props) => (props.isFilled ? 1 : 0)};
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
  background: ${(props) =>
    props.variant === 'danger'
      ? '#ff4444'
      : props.variant === 'secondary'
      ? props.theme.cardBackground
      : props.theme.accent};
  color: ${(props) =>
    props.variant === 'secondary' ? props.theme.text : 'white'};
  padding: 1rem 2rem;
  border: ${(props) =>
    props.variant === 'secondary' ? `2px solid ${props.theme.border}` : 'none'};
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    opacity: ${props => props.disabled ? 0.5 : 0.9};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
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
  background: ${(props) => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 0.8rem;
  font-size: 1rem;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  margin-top: 0.5rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.accent};
    box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.1);
  }
`;

const LogSection = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 1.5rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const LogTitle = styled.h3`
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const LogList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem; /* For scrollbar */
`;

const LogItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.background};
  border-radius: 0.8rem;
`;

const LogTime = styled.span`
  color: ${(props) => props.theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogAmount = styled.span`
  color: ${(props) => props.theme.accent};
  font-weight: 600;
  font-size: 0.9rem;
`;

const EmptyLogText = styled.p`
  color: ${(props) => props.theme.text};
  opacity: 0.6;
  text-align: center;
  padding: 1rem;
`;

const CircularProgressBar = ({ percentage, size = 200, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Ensure offset calculation doesn't result in NaN or negative values
  const validPercentage = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <SvgCircularProgress width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <CircleBg
        strokeWidth={strokeWidth}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <CircleProgress
        strokeWidth={strokeWidth}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </SvgCircularProgress>
  );
};

const WaterIntakeTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  // Store entries as objects: { id: timestamp, timestamp: Date object, volume: number }
  const [entries, setEntries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [intakeHistory, setIntakeHistory] = useState({});

  // Load data from localStorage for selected date
  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem('waterIntake')) || {};
      setIntakeHistory(storedData);
      // Convert stored timestamps back to Date objects, handle potential invalid dates
      const todaysEntries = (storedData[selectedDate] || []).map((entry) => {
        const timestamp = new Date(entry.timestamp);
        return {
          ...entry,
          timestamp: !isNaN(timestamp.getTime()) ? timestamp : new Date(), // Fallback to now if invalid
        };
      });
      setEntries(todaysEntries);
    } catch (error) {
      console.error("Error loading water intake data from localStorage:", error);
      setIntakeHistory({});
      setEntries([]);
    }
  }, [selectedDate]);

  // Save data to localStorage whenever entries for the selected date change
  useEffect(() => {
    // Debounce or throttle this effect if it causes performance issues
    const currentHistoryForDate = intakeHistory[selectedDate] || [];
    const entriesToSave = entries.map((entry) => ({
      ...entry,
      timestamp: entry.timestamp.toISOString(), // Store as ISO string
    }));

    // Only update localStorage if the data has actually changed
    if (JSON.stringify(currentHistoryForDate) !== JSON.stringify(entriesToSave)) {
      const updatedHistory = {
        ...intakeHistory,
        [selectedDate]: entriesToSave,
      };
      try {
          setIntakeHistory(updatedHistory);
          localStorage.setItem('waterIntake', JSON.stringify(updatedHistory));
      } catch (error) {
          console.error("Error saving water intake data to localStorage:", error);
          // Potentially handle storage quota exceeded errors
      }
    }
  }, [entries, selectedDate, intakeHistory]);

  const handleAddCup = () => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date(),
      volume: CUP_VOLUME,
    };
    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  const handleRemoveLastCup = () => {
    setEntries((prevEntries) => prevEntries.slice(0, -1));
  };

  const handleClearDay = () => {
    setEntries([]);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleGoalChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) setDailyGoal(val);
  };

  const totalIntake = entries.reduce((sum, entry) => sum + entry.volume, 0);
  const progressPercent = dailyGoal > 0 ? Math.min((totalIntake / dailyGoal) * 100, 100) : 0;
  const remainingIntake = Math.max(0, dailyGoal - totalIntake);

  return (
    <Container>
      <Header>
        <Title>Current Hydration</Title>
        <Subtitle>Track your daily water intake</Subtitle>
      </Header>

      <MainContent>
        <CircularProgressSection>
          <CircularProgressBar percentage={progressPercent} />
          <ProgressTextContainer>
            <ProgressPercentText>{progressPercent.toFixed(0)}%</ProgressPercentText>
            <ProgressAmountText>{totalIntake}ml</ProgressAmountText>
            <ProgressRemainingText>
              {remainingIntake > 0 ? `-${remainingIntake}ml remaining` : 'Goal achieved!'}
            </ProgressRemainingText>
          </ProgressTextContainer>
          <GoalText>Daily Goal: {dailyGoal}ml</GoalText>
        </CircularProgressSection>

        <CupSection>
          <SectionHeader>
            <SectionTitle>Log Your Intake</SectionTitle>
          </SectionHeader>
          {/* Simplified: Add fixed cup button */}
          <Button
            onClick={handleAddCup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginBottom: '1.5rem' }} /* Add spacing */
          >
            <FaPlus /> Add Cup ({CUP_VOLUME}ml)
          </Button>

          <SectionTitle>Today's Log ({format(new Date(selectedDate), 'MMM dd')})</SectionTitle>
          <LogList>
            <AnimatePresence initial={false}>
              {entries.length > 0 ? (
                entries
                  .sort((a, b) => b.timestamp - a.timestamp) // Show newest first
                  .map((entry) => (
                    <LogItem
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <LogTime>
                        <FaClock />
                        {format(entry.timestamp, 'HH:mm aa')}
                      </LogTime>
                      <LogAmount>+{entry.volume}ml</LogAmount>
                    </LogItem>
                  ))
              ) : (
                <EmptyLogText>No entries for today yet.</EmptyLogText>
              )}
            </AnimatePresence>
          </LogList>
        </CupSection>
      </MainContent>

      <ButtonGroup>
        <Button
          onClick={handleRemoveLastCup}
          variant="secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={entries.length === 0}
        >
          <FaTrashAlt /> Remove Last Entry
        </Button>
        <Button
          variant="danger"
          onClick={handleClearDay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={entries.length === 0}
        >
          <FaTrashAlt /> Clear Today's Log
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
            min="0"
            max="10000"
            step="50"
            placeholder="Enter daily goal in ml"
          />
        </Card>
      </SettingsSection>

      <Button
        onClick={() => setShowHistory(!showHistory)}
        variant="secondary"
        style={{ marginTop: '2rem', display: 'flex', margin: '2rem auto 0' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHistory /> {showHistory ? 'Hide Daily History' : 'Show Daily History'}
      </Button>

      <AnimatePresence>
        {showHistory && (
          <LogSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LogHeader>
              <LogTitle>Daily Intake History</LogTitle>
            </LogHeader>
            <LogList style={{ maxHeight: '400px' }}>
              {Object.entries(intakeHistory)
                .filter(([, dateEntries]) => dateEntries.length > 0) // Only show days with entries
                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                .map(([date, dateEntries]) => {
                  const dailyTotal = (dateEntries || []).reduce(
                    (sum, entry) => sum + (entry.volume || 0),
                    0
                  );
                  // Basic check if date is valid before formatting
                  const isValidDate = !isNaN(new Date(date).getTime());
                  return (
                    <LogItem key={date} layout>
                      <LogTime>{isValidDate ? format(new Date(date), 'MMMM dd, yyyy') : 'Invalid Date'}</LogTime>
                      <LogAmount>{dailyTotal}ml</LogAmount>
                    </LogItem>
                  );
                })}
                {Object.keys(intakeHistory).filter(key => intakeHistory[key].length > 0).length === 0 && (
                    <EmptyLogText>No historical data found.</EmptyLogText>
                )}
            </LogList>
          </LogSection>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default WaterIntakeTracker; 