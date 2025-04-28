import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Styled components
const HeaderContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
  width: 100%;
`;

const MainTitle = styled.h1`
  font-size: ${props => props.size || '3rem'};
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  background: linear-gradient(
    90deg, 
    ${props => props.theme.accent}80 0%, 
    ${props => props.theme.accent} 25%, 
    ${props => props.theme.isDark ? '#90caf9' : '#1976d2'} 50%,
    ${props => props.theme.accent} 75%, 
    ${props => props.theme.accent}80 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${shimmer} 6s linear infinite;
  text-shadow: 0 2px 10px ${props => `${props.theme.accent}40`};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 4px;
    background: linear-gradient(
      to right,
      transparent,
      ${props => props.theme.accent},
      transparent
    );
    border-radius: 2px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  opacity: 0.8;
  margin-top: 1.2rem;
  font-weight: 500;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const Accent = styled.span`
  position: relative;
  display: inline-block;
  color: ${props => props.theme.accent};
  font-weight: 700;
  animation: ${float} 3s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background-color: ${props => `${props.theme.accent}20`};
    z-index: -1;
    border-radius: 4px;
  }
`;

const StylishHeader = ({ title, subtitle, size, children, className }) => {
  // Split the title to find words to accent (words with * around them)
  const processTitle = (title) => {
    if (!title.includes('*')) return <>{title}</>;
    
    const parts = title.split(/\*([^*]+)\*/);
    return parts.map((part, index) => {
      // Every odd index is a part that was between * *
      return index % 2 === 1 ? <Accent key={index}>{part}</Accent> : part;
    });
  };

  return (
    <HeaderContainer 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <MainTitle size={size}>
        {processTitle(title)}
      </MainTitle>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </HeaderContainer>
  );
};

export default StylishHeader;