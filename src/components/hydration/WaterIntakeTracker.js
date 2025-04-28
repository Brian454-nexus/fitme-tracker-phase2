import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  FaPlus,
  FaTrashAlt,
  FaHistory,
  FaCalendarAlt,
  FaBullseye,
  FaGlassWhiskey,
  FaHashtag,
} from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../theme";

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  background: ${(props) =>
    props.variant === "danger"
      ? "#ff4444"
      : props.variant === "secondary"
      ? props.theme.cardBackground
      : props.theme.accent};
  color: ${(props) =>
    props.variant === "secondary" ? props.theme.text : "white"};
  padding: 1rem 2rem;
  border: ${(props) =>
    props.variant === "secondary" ? `2px solid ${props.theme.border}` : "none"};
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.9)};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-1px)")};
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

const CounterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.background};
  border-radius: 1rem;
`;

const CounterItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CounterValue = styled(motion.span)`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${(props) => props.theme.accent};
  margin-bottom: 0.25rem;
`;

const CounterLabel = styled.span`
  font-size: 0.9rem;
  color: ${(props) => props.theme.text};
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const HistoryDisplaySection = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
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
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem; /* For scrollbar */
`;

const HistoryItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${(props) => props.theme.background};
  border-radius: 0.8rem;
`;

const HistoryDate = styled.span`
  color: ${(props) => props.theme.text};
  font-size: 0.9rem;
`;

const HistoryAmount = styled.span`
  color: ${(props) => props.theme.accent};
  font-weight: 600;
  font-size: 0.9rem;
`;

const EmptyHistoryText = styled.p`
  color: ${(props) => props.theme.text};
  opacity: 0.6;
  text-align: center;
  padding: 1rem;
`;

const CircularProgressBar = ({ percentage, size = 200, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Ensure offset calculation doesn't result in NaN or negative values
  const validPercentage = Math.max(
    0,
    Math.min(100, isNaN(percentage) ? 0 : percentage)
  );
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <SvgCircularProgress
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
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
        // Apply offset directly, ensure transition handles the change
        style={{ strokeDashoffset: offset }}
      />
    </SvgCircularProgress>
  );
};

const WaterIntakeTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  // Store entries as objects: { id: timestamp, timestamp: Date object, volume: number }
  const [entries, setEntries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [intakeHistory, setIntakeHistory] = useState({});
  const { isDarkMode, toggleTheme } = useTheme();

  // Load data from localStorage for selected date
  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("waterIntake")) || {};
      setIntakeHistory(storedData);
      // Convert stored timestamps back to Date objects, handle potential invalid dates/volume
      const todaysEntries = (storedData[selectedDate] || [])
        .map((entry) => {
          const timestamp = new Date(entry.timestamp);
          const volume = Number(entry.volume) || 0; // Ensure volume is a number
          return {
            ...entry,
            volume,
            timestamp: !isNaN(timestamp.getTime()) ? timestamp : new Date(),
          };
        })
        .filter((entry) => entry.volume > 0); // Filter out entries with 0 volume if necessary
      setEntries(todaysEntries);
    } catch (error) {
      console.error(
        "Error loading water intake data from localStorage:",
        error
      );
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
    if (
      JSON.stringify(currentHistoryForDate) !== JSON.stringify(entriesToSave)
    ) {
      const updatedHistory = {
        ...intakeHistory,
        [selectedDate]: entriesToSave,
      };
      try {
        setIntakeHistory(updatedHistory);
        localStorage.setItem("waterIntake", JSON.stringify(updatedHistory));
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

  // Ensure volume is treated as number, default to 0 if invalid
  const totalIntake = entries.reduce(
    (sum, entry) => sum + (Number(entry.volume) || 0),
    0
  );
  const numberOfCups = entries.length;
  // Ensure dailyGoal is a number before calculating percentage
  const currentDailyGoal = Number(dailyGoal) || 0;
  const progressPercent =
    currentDailyGoal > 0
      ? Math.min((totalIntake / currentDailyGoal) * 100, 100)
      : 0;
  const remainingIntake = Math.max(0, currentDailyGoal - totalIntake);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Header>
          <Title>Current Hydration</Title>
          <Subtitle>Track your daily water intake</Subtitle>
        </Header>

      <MainContent>
        <CircularProgressSection>
          <CircularProgressBar
            percentage={isNaN(progressPercent) ? 0 : progressPercent}
          />
          <ProgressTextContainer>
            <ProgressPercentText>
              {isNaN(progressPercent) ? 0 : progressPercent.toFixed(0)}%
            </ProgressPercentText>
            <ProgressAmountText>
              {isNaN(totalIntake) ? 0 : totalIntake}ml
            </ProgressAmountText>
            <ProgressRemainingText>
              {remainingIntake > 0
                ? `-${remainingIntake}ml remaining`
                : "Goal achieved!"}
            </ProgressRemainingText>
          </ProgressTextContainer>
          <GoalText>Daily Goal: {currentDailyGoal}ml</GoalText>
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
            style={{ marginBottom: "1.5rem", width: "100%" }} /* Add spacing */
          >
            <FaPlus /> Add Cup ({CUP_VOLUME}ml)
          </Button>

          {/* NEW: Counters */}
          <CounterContainer>
            <CounterItem>
              <CounterValue
                key={`cups-${numberOfCups}`} // Add key for animation
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {numberOfCups}
              </CounterValue>
              <CounterLabel>
                <FaHashtag /> Cups Today
              </CounterLabel>
            </CounterItem>
            <CounterItem>
              <CounterValue
                key={`ml-${totalIntake}`} // Add key for animation
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isNaN(totalIntake) ? 0 : totalIntake}
              </CounterValue>
              <CounterLabel>
                <FaGlassWhiskey /> ml Today
              </CounterLabel>
            </CounterItem>
          </CounterContainer>
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
          <FaTrashAlt /> Remove Last Cup
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
          <Input type="date" value={selectedDate} onChange={handleDateChange} />
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
        style={{ marginTop: "2rem", display: "flex", margin: "2rem auto 0" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHistory />{" "}
        {showHistory ? "Hide Daily History" : "Show Daily History"}
      </Button>

      <AnimatePresence>
        {showHistory && (
          <HistoryDisplaySection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HistoryHeader>
              <HistoryTitle>Daily Intake History</HistoryTitle>
            </HistoryHeader>
            <HistoryList style={{ maxHeight: "400px" }}>
              {Object.entries(intakeHistory)
                .filter(([, dateEntries]) => dateEntries.length > 0)
                .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                .map(([date, dateEntries]) => {
                  const dailyTotal = (dateEntries || []).reduce(
                    (sum, entry) => sum + (entry.volume || 0),
                    0
                  );
                  const isValidDate = !isNaN(new Date(date).getTime());
                  return (
                    <HistoryItem key={date} layout>
                      <HistoryDate>
                        {isValidDate
                          ? format(new Date(date), "MMMM dd, yyyy")
                          : "Invalid Date"}
                      </HistoryDate>
                      <HistoryAmount>{dailyTotal}ml</HistoryAmount>
                    </HistoryItem>
                  );
                })}
              {Object.keys(intakeHistory).filter(
                (key) => intakeHistory[key]?.length > 0
              ).length === 0 && (
                <EmptyHistoryText>No historical data found.</EmptyHistoryText>
              )}
            </HistoryList>
          </HistoryDisplaySection>
        )}
      </AnimatePresence>
    </Container>
    </ThemeProvider>
  );
};

export default WaterIntakeTracker;
