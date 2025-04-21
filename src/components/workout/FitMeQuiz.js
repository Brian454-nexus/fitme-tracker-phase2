import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const theme = {
  primary: "#FF0000",
  secondary: "#000000",
  accent: "#000080",
  background: "#121212",
  text: "#FFFFFF",
  cardBackground: "#1E1E1E",
};

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${theme.cardBackground};
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
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

const questions = [
  {
    id: 1,
    question: "What is your gender?",
    options: [
      { text: "Male", image: "/images/gender/male.png" },
      { text: "Female", image: "/images/gender/female.png" },
    ],
    layout: "vertical",
    size: "large",
  },
  {
    id: 2,
    question: "What is your age group?",
    options: [
      { text: "18-29", image: "/images/age/young.png" },
      { text: "30-39", image: "/images/age/adult.png" },
      { text: "40-49", image: "/images/age/middle.png" },
      { text: "50+", image: "/images/age/senior.png" },
    ],
    layout: "grid",
    size: "medium",
  },
  {
    id: 3,
    question: "What is your height?",
    type: "measurement",
    unit: ["cm", "ft"],
    options: Array.from({ length: 100 }, (_, i) => ({
      text: `${i + 140} cm`,
      value: i + 140,
    })),
    layout: "scroll",
  },
  {
    id: 4,
    question: "What is your weight?",
    type: "measurement",
    unit: ["kg", "lbs"],
    options: Array.from({ length: 100 }, (_, i) => ({
      text: `${i + 40} kg`,
      value: i + 40,
    })),
    layout: "scroll",
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

const FitMeQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option,
    });
    setDirection(1);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setTimeout(() => setCurrentQuestion(currentQuestion - 1), 500);
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

      {currentQuestion > 0 && (
        <BackButton
          onClick={handleBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </BackButton>
      )}

      <AnimatePresence mode="wait">
        <QuestionContainer
          key={currentQuestion}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 100 }}
          transition={{ duration: 0.5 }}
        >
          <Question>{questions[currentQuestion].question}</Question>
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
        </QuestionContainer>
      </AnimatePresence>
    </QuizContainer>
  );
};

export default FitMeQuiz;
