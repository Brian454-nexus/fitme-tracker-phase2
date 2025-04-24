import React, { useState } from "react";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiZap,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi"; // Import icons

const theme = {
  primary: "#FF4500",
  secondary: "#000000",
  accent: "#FF4500",
  background: "#121212",
  text: "#FFFFFF",
  cardBackground: "#1E1E1E",
  border: "#333333",
};

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: ${theme.cardBackground};
  border-radius: 12px;
  border: 2px solid ${theme.border};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${theme.accent};
  border-radius: 4px;
  margin-bottom: 2rem;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  color: ${theme.text};
  text-align: right;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const QuestionContainer = styled(motion.div)`
  margin-bottom: 2rem;
  position: relative;
`;

const Question = styled.h3`
  color: ${theme.text};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: ${(props) =>
    props.layout === "vertical" ? "column" : "row"};
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Option = styled(motion.button)`
  padding: 1.5rem;
  border: 2px solid ${theme.accent};
  border-radius: 12px;
  background: ${theme.cardBackground};
  color: ${theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: ${(props) => (props.size === "large" ? "300px" : "200px")};
  min-height: 100px;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${theme.accent};
    transform: translateY(-2px);
  }

  &.selected {
    background: ${theme.primary};
    border-color: ${theme.primary};
  }
`;

const OptionText = styled.span`
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const OptionImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 1rem;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: transparent;
  border: none;
  color: ${theme.text};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const BMIDisplay = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  background: ${theme.cardBackground};
  border-radius: 8px;
  text-align: center;
  border: 1px solid ${theme.border};
`;

const BMIText = styled.p`
  color: ${theme.text};
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const BMICategory = styled.span`
  color: ${(props) => {
    switch (props.category) {
      case "Underweight":
        return "#FFA500";
      case "Normal weight":
        return "#4CAF50";
      case "Overweight":
        return "#FFC107";
      case "Obese":
        return "#F44336";
      default:
        return theme.text;
    }
  }};
  font-weight: bold;
`;

const NextButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: ${theme.accent};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${theme.accent};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 2rem;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const MeasurementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const MeasurementInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  background: ${theme.cardBackground};
  color: ${theme.text};
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${theme.accent};
  }
`;

const UnitSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.border};
  border-radius: 8px;
  font-size: 1.1rem;
  background: ${theme.cardBackground};
  color: ${theme.text};
  text-align: center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.accent};
  }
`;

const questions = [
  {
    id: 1,
    question: "What is your gender?",
    options: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" },
      { text: "Other", value: "other" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 2,
    question: "What is your age group?",
    options: [
      { text: "18-25", value: "18-25" },
      { text: "26-35", value: "26-35" },
      { text: "36-45", value: "36-45" },
      { text: "46-55", value: "46-55" },
      { text: "56+", value: "56+" },
    ],
    layout: "grid",
    size: "medium",
  },
  {
    id: 3,
    question: "What is your height?",
    type: "measurement",
    unit: ["cm", "ft"],
  },
  {
    id: 4,
    question: "What is your weight?",
    type: "measurement",
    unit: ["kg", "lbs"],
  },
  {
    id: 5,
    question: "What is your body type?",
    options: [
      { text: "Slim", image: "/images/body/slim.png", value: "slim" },
      { text: "Average", image: "/images/body/average.png", value: "average" },
      { text: "Heavy", image: "/images/body/heavy.png", value: "heavy" },
    ],
    layout: "vertical",
    size: "medium",
  },
  {
    id: 6,
    question: "What is your fitness goal?",
    options: [
      {
        text: "Lose Weight",
        image: "/images/goals/weight-loss.png",
        value: "lose_weight",
      },
      {
        text: "Gain Muscle Mass",
        image: "/images/goals/muscle-gain.png",
        value: "gain_muscle",
      },
      {
        text: "Get Shredded",
        image: "/images/goals/shredded.png",
        value: "get_shredded",
      },
    ],
    layout: "vertical",
    size: "medium",
  },
  {
    id: 7,
    question: "What is your current fitness level?",
    options: [
      { text: "Beginner (new to exercise)", value: "beginner" },
      { text: "Intermediate (some experience)", value: "intermediate" },
      { text: "Advanced (regular exerciser)", value: "advanced" },
      { text: "Expert (competitive athlete)", value: "expert" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 8,
    question: "How many days per week can you commit to working out?",
    options: [
      { text: "1-2 days", value: "1-2" },
      { text: "3-4 days", value: "3-4" },
      { text: "5-6 days", value: "5-6" },
      { text: "7 days", value: "7" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 9,
    question: "What type of workouts do you prefer?",
    options: [
      { text: "Strength training with weights", value: "strength" },
      { text: "Bodyweight exercises", value: "bodyweight" },
      { text: "Cardio and endurance", value: "cardio" },
      { text: "Flexibility and mobility", value: "flexibility" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 10,
    question: "Do you have any specific health concerns or limitations?",
    options: [
      { text: "No limitations", value: "none" },
      { text: "Joint issues", value: "joint" },
      { text: "Back problems", value: "back" },
      { text: "Other health concerns", value: "other_health" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 11,
    question: "How would you describe your current diet?",
    options: [
      { text: "Balanced and healthy", value: "balanced" },
      { text: "Average, could be better", value: "average_diet" },
      { text: "Poor, needs improvement", value: "poor_diet" },
      { text: "Following a specific diet plan", value: "specific_diet" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 12,
    question: "What time of day do you prefer to workout?",
    options: [
      { text: "Morning (6am-12pm)", value: "morning" },
      { text: "Afternoon (12pm-5pm)", value: "afternoon" },
      { text: "Evening (5pm-10pm)", value: "evening" },
      { text: "Flexible schedule", value: "flexible" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 13,
    question: "What equipment do you have access to?",
    options: [
      { text: "Full gym access", value: "full_gym" },
      { text: "Basic home equipment", value: "home_basic" },
      { text: "No equipment", value: "none" },
      { text: "Limited equipment", value: "limited" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 14,
    question: "How long can you dedicate to each workout session?",
    options: [
      { text: "30 minutes or less", value: "under_30" },
      { text: "30-45 minutes", value: "30-45" },
      { text: "45-60 minutes", value: "45-60" },
      { text: "60+ minutes", value: "over_60" },
    ],
    layout: "vertical",
    size: "large",
  },
];

const calculateBMI = (height, weight, unit) => {
  if (!height || !weight) return null;

  let heightInMeters = unit === "metric" ? height / 100 : height * 0.3048;
  let weightInKg = unit === "metric" ? weight : weight * 0.453592;

  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

const getBMICategory = (bmi) => {
  if (!bmi) return null;

  if (bmi < 18.5) return { category: "Underweight", color: "#FFA500" };
  if (bmi < 25) return { category: "Normal weight", color: "#4CAF50" };
  if (bmi < 30) return { category: "Overweight", color: "#FFC107" };
  return { category: "Obese", color: "#F44336" };
};

const SummaryContainer = styled(motion.div)`
  padding: 2rem;
  background: ${theme.background};
  color: ${theme.text};
  border-radius: 12px;
`;

const SummaryTitle = styled.h2`
  color: ${theme.text};
  text-align: center;
  margin-bottom: 2rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: ${theme.cardBackground};
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${theme.border};
`;

const SummaryIcon = styled.div`
  color: ${theme.accent};
  font-size: 1.8rem;
`;

const SummaryDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: #aaa;
`;

const SummaryValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

const GoalsSection = styled.div`
  margin-bottom: 2rem;
`;

const GoalsTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${theme.text};
`;

const GoalsList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
`;

const GoalItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.text};
`;

const GoalIcon = styled(FiCheckCircle)`
  color: ${theme.accent};
`;

const GetPlanButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${theme.accent};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 2rem auto 0;
  width: fit-content;

  &:hover {
    opacity: 0.9;
  }
`;

const QuizSummary = ({ answers, questions, measurementValues }) => {
  const getAnswer = (questionId) => {
    const questionIndex = questions.findIndex((q) => q.id === questionId);
    if (questionIndex === -1 || !answers[questionIndex]) return "N/A";

    const answer = answers[questionIndex];
    return typeof answer === "object" ? answer.text || answer.value : answer;
  };

  const mockGoals = [
    "Reduce stress",
    "Feel healthier",
    "Self-discipline",
    "Form a physical habit",
    "Improve sleep",
  ];

  return (
    <SummaryContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SummaryTitle>Personalized plan for you is ready!</SummaryTitle>

      <SummaryGrid>
        <SummaryCard>
          <SummaryIcon>
            <FiClock />
          </SummaryIcon>
          <SummaryDetails>
            <SummaryLabel>Workout Duration</SummaryLabel>
            <SummaryValue>{getAnswer(14)}</SummaryValue>
          </SummaryDetails>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon>
            <FiZap />
          </SummaryIcon>
          <SummaryDetails>
            <SummaryLabel>Fitness Level</SummaryLabel>
            <SummaryValue>{getAnswer(7)}</SummaryValue>
          </SummaryDetails>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon>
            <FiMapPin />
          </SummaryIcon>
          <SummaryDetails>
            <SummaryLabel>Place to Workout</SummaryLabel>
            <SummaryValue>{getAnswer(13)}</SummaryValue>
          </SummaryDetails>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon>
            <FiCalendar />
          </SummaryIcon>
          <SummaryDetails>
            <SummaryLabel>Workout Frequency</SummaryLabel>
            <SummaryValue>{getAnswer(8)}</SummaryValue>
          </SummaryDetails>
        </SummaryCard>
      </SummaryGrid>

      <GoalsSection>
        <GoalsTitle>Goals for your program also include:</GoalsTitle>
        <GoalsList>
          {mockGoals.map((goal, index) => (
            <GoalItem key={index}>
              <GoalIcon /> {goal}
            </GoalItem>
          ))}
        </GoalsList>
      </GoalsSection>

      <GetPlanButton
        onClick={() => alert("Plan generation coming soon!")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get my plan <FiArrowRight />
      </GetPlanButton>
    </SummaryContainer>
  );
};

const FitMeQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBMICategory] = useState(null);
  const [showBMI, setShowBMI] = useState(false);
  const [measurementValues, setMeasurementValues] = useState({
    height: { value: "", unit: "cm" },
    weight: { value: "", unit: "kg" },
  });

  const handleAnswer = (option) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]:
        typeof option === "string"
          ? { text: option, value: option.toLowerCase().replace(/ /g, "_") }
          : option,
    };
    setAnswers(newAnswers);

    setDirection(1);
    if (currentQuestion === questions.length - 1) {
      setTimeout(() => setShowResults(true), 300);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleMeasurementChange = (type, value, unit) => {
    setMeasurementValues((prev) => ({
      ...prev,
      [type]: { value, unit },
    }));
  };

  const handleNext = () => {
    if (currentQuestion === 3) {
      const height = parseFloat(measurementValues.height.value);
      const weight = parseFloat(measurementValues.weight.value);
      const heightInCm =
        measurementValues.height.unit === "ft" ? height * 30.48 : height;
      const weightInKg =
        measurementValues.weight.unit === "lbs" ? weight * 0.453592 : weight;

      if (heightInCm && weightInKg) {
        const calculatedBMI = calculateBMI(heightInCm, weightInKg, "metric");
        setBMI(calculatedBMI);
        setBMICategory(getBMICategory(calculatedBMI));
        setShowBMI(true);
        return;
      }
    }
    setShowBMI(false);
    if (currentQuestion === questions.length - 1) {
      setTimeout(() => setShowResults(true), 300);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleContinueFromBMI = () => {
    setShowBMI(false);
    if (currentQuestion === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const progress = showResults
    ? 100
    : ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <QuizSummary
        answers={answers}
        questions={questions}
        measurementValues={measurementValues}
      />
    );
  }

  return (
    <QuizContainer>
      <ProgressText>
        {!showBMI
          ? `Question ${currentQuestion + 1} of ${questions.length}`
          : "BMI Result"}
      </ProgressText>
      <ProgressBar progress={progress} />

      {currentQuestion > 0 && !showBMI && (
        <BackButton
          onClick={() => {
            setShowBMI(false);
            setDirection(-1);
            setCurrentQuestion((prev) => prev - 1);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </BackButton>
      )}

      <AnimatePresence mode="wait">
        {showBMI ? (
          <BMIDisplay
            key="bmi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <BMIText>Your BMI: {bmi}</BMIText>
            <BMIText>
              Category:{" "}
              <BMICategory category={bmiCategory?.category}>
                {bmiCategory?.category || "N/A"}
              </BMICategory>
            </BMIText>
            <ButtonContainer>
              <NextButton
                onClick={handleContinueFromBMI}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </NextButton>
            </ButtonContainer>
          </BMIDisplay>
        ) : (
          <QuestionContainer
            key={currentQuestion}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ duration: 0.3 }}
          >
            <Question>{questions[currentQuestion].question}</Question>

            {questions[currentQuestion].type === "measurement" ? (
              <MeasurementContainer>
                <MeasurementInput
                  type="number"
                  value={
                    measurementValues[
                      questions[currentQuestion].id === 3 ? "height" : "weight"
                    ].value
                  }
                  onChange={(e) =>
                    handleMeasurementChange(
                      questions[currentQuestion].id === 3 ? "height" : "weight",
                      e.target.value,
                      measurementValues[
                        questions[currentQuestion].id === 3
                          ? "height"
                          : "weight"
                      ].unit
                    )
                  }
                  min={
                    questions[currentQuestion].id === 3
                      ? measurementValues.height.unit === "cm"
                        ? 100
                        : 3
                      : measurementValues.weight.unit === "kg"
                      ? 30
                      : 66
                  }
                  max={
                    questions[currentQuestion].id === 3
                      ? measurementValues.height.unit === "cm"
                        ? 250
                        : 8
                      : measurementValues.weight.unit === "kg"
                      ? 200
                      : 440
                  }
                  placeholder={`Enter ${
                    questions[currentQuestion].id === 3 ? "height" : "weight"
                  }`}
                />
                <UnitSelect
                  value={
                    measurementValues[
                      questions[currentQuestion].id === 3 ? "height" : "weight"
                    ].unit
                  }
                  onChange={(e) =>
                    handleMeasurementChange(
                      questions[currentQuestion].id === 3 ? "height" : "weight",
                      measurementValues[
                        questions[currentQuestion].id === 3
                          ? "height"
                          : "weight"
                      ].value,
                      e.target.value
                    )
                  }
                >
                  {questions[currentQuestion].unit.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </UnitSelect>
                <ButtonContainer>
                  <NextButton
                    onClick={handleNext}
                    disabled={
                      !measurementValues[
                        questions[currentQuestion].id === 3
                          ? "height"
                          : "weight"
                      ].value
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </NextButton>
                </ButtonContainer>
              </MeasurementContainer>
            ) : (
              <OptionsContainer
                layout={questions[currentQuestion].layout || "grid"}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <Option
                    key={index}
                    size={questions[currentQuestion].size || "medium"}
                    className={
                      answers[currentQuestion]?.value === option.value
                        ? "selected"
                        : ""
                    }
                    onClick={() => handleAnswer(option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.image && (
                      <OptionImage src={option.image} alt={option.text} />
                    )}
                    <OptionText>{option.text}</OptionText>
                  </Option>
                ))}
              </OptionsContainer>
            )}
          </QuestionContainer>
        )}
      </AnimatePresence>
    </QuizContainer>
  );
};

export default FitMeQuiz;
