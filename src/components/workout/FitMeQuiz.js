import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

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
  align-items: center;
  justify-content: space-between;
  min-width: ${(props) => (props.size === "large" ? "300px" : "200px")};
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

const HeightWeightContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const HeightWeightSection = styled.div`
  width: 100%;
`;

const HeightWeightTitle = styled.h3`
  color: ${theme.text};
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
`;

const HeightWeightInput = styled.input`
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
      { text: "Slim", image: "/images/body/slim.png" },
      { text: "Average", image: "/images/body/average.png" },
      { text: "Heavy", image: "/images/body/heavy.png" },
    ],
    layout: "vertical",
    size: "medium",
  },
  {
    id: 6,
    question: "What is your fitness goal?",
    options: [
      { text: "Lose Weight", image: "/images/goals/weight-loss.png" },
      { text: "Gain Muscle Mass", image: "/images/goals/muscle-gain.png" },
      { text: "Get Shredded", image: "/images/goals/shredded.png" },
    ],
    layout: "vertical",
    size: "medium",
  },
  {
    id: 7,
    question: "What is your current fitness level?",
    options: [
      "Beginner (new to exercise)",
      "Intermediate (some experience)",
      "Advanced (regular exerciser)",
      "Expert (competitive athlete)",
    ],
  },
  {
    id: 8,
    question: "How many days per week can you commit to working out?",
    options: ["1-2 days", "3-4 days", "5-6 days", "7 days"],
  },
  {
    id: 9,
    question: "What type of workouts do you prefer?",
    options: [
      "Strength training with weights",
      "Bodyweight exercises",
      "Cardio and endurance",
      "Flexibility and mobility",
    ],
  },
  {
    id: 10,
    question: "Do you have any specific health concerns or limitations?",
    options: [
      "No limitations",
      "Joint issues",
      "Back problems",
      "Other health concerns",
    ],
  },
  {
    id: 11,
    question: "How would you describe your current diet?",
    options: [
      "Balanced and healthy",
      "Average, could be better",
      "Poor, needs improvement",
      "Following a specific diet plan",
    ],
  },
  {
    id: 12,
    question: "What time of day do you prefer to workout?",
    options: [
      "Morning (6am-12pm)",
      "Afternoon (12pm-5pm)",
      "Evening (5pm-10pm)",
      "Flexible schedule",
    ],
  },
  {
    id: 13,
    question: "What equipment do you have access to?",
    options: [
      "Full gym access",
      "Basic home equipment",
      "No equipment",
      "Limited equipment",
    ],
  },
  {
    id: 14,
    question: "How long can you dedicate to each workout session?",
    options: [
      "30 minutes or less",
      "30-45 minutes",
      "45-60 minutes",
      "60+ minutes",
    ],
  },
];

const generateWorkoutPlan = (answers) => {
  const plan = {
    focus: [],
    frequency: "",
    duration: "",
    intensity: "",
    recommendations: [],
  };

  // Determine primary focus based on goals and preferences
  if (answers[0].includes("Build muscle")) {
    plan.focus.push("Strength Training");
  }
  if (answers[0].includes("Lose weight")) {
    plan.focus.push("Cardio");
  }
  if (answers[0].includes("Improve overall")) {
    plan.focus.push("Full Body");
  }
  if (answers[0].includes("flexibility")) {
    plan.focus.push("Flexibility");
  }

  // Set workout frequency
  plan.frequency = answers[2];

  // Set workout duration
  plan.duration = answers[9];

  // Set intensity based on fitness level
  const fitnessLevel = answers[1];
  plan.intensity = fitnessLevel.includes("Beginner")
    ? "Low"
    : fitnessLevel.includes("Intermediate")
    ? "Moderate"
    : fitnessLevel.includes("Advanced")
    ? "High"
    : "Very High";

  // Add specific recommendations
  if (answers[3].includes("weights")) {
    plan.recommendations.push("Focus on compound movements");
  }
  if (answers[3].includes("bodyweight")) {
    plan.recommendations.push("Include bodyweight progressions");
  }
  if (answers[3].includes("Cardio")) {
    plan.recommendations.push("Incorporate HIIT training");
  }

  // Add health considerations
  if (answers[4].includes("Joint issues")) {
    plan.recommendations.push("Low-impact exercises recommended");
  }
  if (answers[4].includes("Back problems")) {
    plan.recommendations.push("Focus on core strengthening");
  }

  return plan;
};

const ResultsContainer = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const PlanSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border-left: 4px solid ${theme.primary};
  background: #f8f9fa;
`;

const Recommendation = styled.li`
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

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
      [currentQuestion]: option,
    };
    setAnswers(newAnswers);

    if (currentQuestion === 2) {
      // Height question
      const height = parseFloat(measurementValues.height.value);
      const weight = parseFloat(measurementValues.weight.value);
      if (height && weight) {
        const calculatedBMI = calculateBMI(
          height,
          weight,
          measurementValues.height.unit === "cm" ? "metric" : "imperial"
        );
        setBMI(calculatedBMI);
        setBMICategory(getBMICategory(calculatedBMI));
        setShowBMI(true);
        return;
      }
    } else if (currentQuestion === 3) {
      // Weight question
      const weight = parseFloat(measurementValues.weight.value);
      const height = parseFloat(measurementValues.height.value);
      if (height && weight) {
        const calculatedBMI = calculateBMI(
          height,
          weight,
          measurementValues.height.unit === "cm" ? "metric" : "imperial"
        );
        setBMI(calculatedBMI);
        setBMICategory(getBMICategory(calculatedBMI));
        setShowBMI(true);
        return;
      }
    }

    setDirection(1);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const handleMeasurementChange = (type, value, unit) => {
    setMeasurementValues((prev) => ({
      ...prev,
      [type]: { value, unit },
    }));
  };

  const handleNext = () => {
    setShowBMI(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const workoutPlan = generateWorkoutPlan(Object.values(answers));

    return (
      <ResultsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Your Personalized Workout Plan</h2>

        <PlanSection>
          <h3>Primary Focus</h3>
          <p>{workoutPlan.focus.join(", ")}</p>
        </PlanSection>

        <PlanSection>
          <h3>Workout Schedule</h3>
          <p>Frequency: {workoutPlan.frequency}</p>
          <p>Duration: {workoutPlan.duration}</p>
          <p>Intensity: {workoutPlan.intensity}</p>
        </PlanSection>

        <PlanSection>
          <h3>Recommendations</h3>
          <ul>
            {workoutPlan.recommendations.map((rec, index) => (
              <Recommendation key={index}>{rec}</Recommendation>
            ))}
          </ul>
        </PlanSection>

        <SubmitButton
          onClick={() => setShowResults(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start New Quiz
        </SubmitButton>
      </ResultsContainer>
    );
  }

  return (
    <QuizContainer>
      <ProgressText>
        Question {currentQuestion + 1} of {questions.length}
      </ProgressText>
      <ProgressBar progress={progress} />

      {currentQuestion > 0 && !showBMI && (
        <BackButton
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
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
            exit={{ opacity: 0, y: -20 }}
          >
            <BMIText>Your BMI: {bmi}</BMIText>
            <BMIText>
              Category:{" "}
              <BMICategory color={bmiCategory.color}>
                {bmiCategory.category}
              </BMICategory>
            </BMIText>
            <NextButton
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </NextButton>
          </BMIDisplay>
        ) : (
          <QuestionContainer
            key={currentQuestion}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ duration: 0.5 }}
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
                  min={questions[currentQuestion].id === 3 ? "100" : "30"}
                  max={questions[currentQuestion].id === 3 ? "250" : "200"}
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
              <OptionsContainer layout={questions[currentQuestion].layout}>
                {questions[currentQuestion].options.map((option, index) => (
                  <Option
                    key={index}
                    size={questions[currentQuestion].size}
                    className={
                      answers[currentQuestion] === option ? "selected" : ""
                    }
                    onClick={() => handleAnswer(option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.text}
                    {option.image && (
                      <OptionImage src={option.image} alt={option.text} />
                    )}
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
