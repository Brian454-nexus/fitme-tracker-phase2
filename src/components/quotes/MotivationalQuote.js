import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import motivationalQuotes from "../../data/motivationalQuotes";

// --- Config ---
const REFRESH_INTERVAL = 15000; // 15 seconds - show a new quote every 15 seconds

// Video background path
const videoSrc = "/images/quotes/quote_background.mp4";

// --- Styled Components ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const QuoteContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 1.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

// Enhanced video background
const BackgroundVideo = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 1;
  transform: translate(-50%, -50%);
  object-fit: cover;
  transition: filter 0.5s ease;

  ${QuoteContainer}:hover & {
    filter: brightness(1.1) saturate(1.1);
  }
`;

// Glassmorphism overlay
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
  z-index: 2;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
`;

const QuoteWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  z-index: 3;
`;

// Enhanced quote text with animation
const QuoteText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 85%;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.8s ease forwards;
  letter-spacing: 0.5px;

  &::before,
  &::after {
    content: '"';
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.8);
    position: relative;
  }
`;

// Enhanced author text with animation
const AuthorText = styled.span`
  font-size: 1.1rem;
  font-style: italic;
  font-weight: 500;
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.8s ease forwards 0.3s;
  animation-fill-mode: both;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingIndicator = styled.div`
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

// --- Component Logic ---
const MotivationalQuote = () => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get a random quote from our collection
  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  }, []);

  // Function to update the quote with animation
  const updateQuote = useCallback(() => {
    setIsLoading(true);

    // Short timeout to allow for fade-out animation
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsLoading(false);
    }, 500);
  }, [getRandomQuote]);

  // Initial quote on component mount
  useEffect(() => {
    updateQuote();
  }, [updateQuote]);

  // Auto-refresh interval for quotes
  useEffect(() => {
    const intervalId = setInterval(updateQuote, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [updateQuote]);

  return (
    <QuoteContainer layout>
      {/* Video Background */}
      <BackgroundVideo
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        src={videoSrc}
      />
      <Overlay />
      <QuoteWrapper
        key={quote ? quote.content : "loading"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
          staggerChildren: 0.2,
        }}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingIndicator>
              <FaQuoteLeft style={{ opacity: 0.7, fontSize: "1.5rem" }} />
            </LoadingIndicator>
          </motion.div>
        ) : quote ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FaQuoteLeft
              style={{
                alignSelf: "flex-start",
                marginLeft: "10%",
                marginBottom: "0.5rem",
                opacity: 0.7,
                fontSize: "1.5rem",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            />
            <QuoteText>{quote.content}</QuoteText>
            <FaQuoteRight
              style={{
                alignSelf: "flex-end",
                marginRight: "10%",
                marginTop: "0.5rem",
                opacity: 0.7,
                fontSize: "1.5rem",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            />
            <AuthorText>- {quote.author}</AuthorText>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuoteText>
              The only bad workout is the one that didn't happen.
            </QuoteText>
            <AuthorText>- Unknown</AuthorText>
          </motion.div>
        )}
      </QuoteWrapper>
    </QuoteContainer>
  );
};

export default MotivationalQuote;
