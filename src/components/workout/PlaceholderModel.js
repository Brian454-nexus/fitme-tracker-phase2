import React from "react";
import styled from "styled-components";

const PlaceholderContainer = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const PlaceholderText = styled.div`
  color: #6b7280;
  font-size: 1.2rem;
  text-align: center;
  padding: 1rem;
  z-index: 1;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const PlaceholderModel = ({ muscleGroup }) => {
  return (
    <PlaceholderContainer>
      <AnimatedBackground />
      <PlaceholderText>
        {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)} Model
        <br />
        (Placeholder - Add 3D model)
      </PlaceholderText>
    </PlaceholderContainer>
  );
};

export default PlaceholderModel;
