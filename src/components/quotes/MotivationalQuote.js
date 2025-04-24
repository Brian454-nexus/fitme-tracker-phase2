import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// --- Config ---
const API_URL = 'https://api.quotable.io/random';
const REFRESH_INTERVAL = 20000; // 20 seconds

// Example background images (replace with your preferred URLs)
const backgrounds = [
  '/images/quotes/sky1.jpg', // Assuming you place images here
  '/images/quotes/sunset1.jpg',
  '/images/quotes/sky2.jpg',
  '/images/quotes/sunset2.jpg',
];

// --- Styled Components ---
const QuoteContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 200px; // Adjust height as needed
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: white; /* Default text color */
`;

const BackgroundImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)); /* Dark overlay for text contrast */
  z-index: 2;
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

const QuoteText = styled.p`
  font-size: 1.4rem; // Adjust size
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1rem;
  max-width: 80%;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const AuthorText = styled.span`
  font-size: 1rem;
  font-style: italic;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingIndicator = styled.div`
  /* Style your loading indicator */
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorIndicator = styled.div`
  /* Style your error indicator */
  color: #ffdddd;
  opacity: 0.9;
  font-size: 1rem;
  svg {
    margin-right: 0.5rem;
  }
`;

// --- Component Logic ---
const MotivationalQuote = () => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const fetchQuote = useCallback(async () => {
    // Don't show loading for background refreshes unless it's the initial load
    if (!quote) setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.content && response.data.author) {
        setQuote({ content: response.data.content, author: response.data.author });
        // Cycle background images
        setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
      } else {
        throw new Error("Invalid quote format received");
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("Couldn't load a quote right now.");
      // Keep the old quote if available, otherwise clear it
      if (!quote) setQuote(null);
    } finally {
      // Only set loading to false after the first successful load
      if (isLoading && quote) setIsLoading(false);
       else if(isLoading && !quote) setIsLoading(false); // Also stop loading on initial error

    }
  }, [isLoading, quote]); // Dependencies for useCallback

  // Initial fetch
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  // Auto-refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchQuote, REFRESH_INTERVAL);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchQuote]);

  const currentBackground = backgrounds[currentBgIndex];

  return (
    <QuoteContainer layout>
      <AnimatePresence>
        <BackgroundImage
            key={currentBackground} // Animate when background changes
            src={currentBackground}
            alt="Motivational background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }} // Slow fade for background
        />
      </AnimatePresence>
      <Overlay />
      <QuoteWrapper
        key={quote ? quote.content : 'loading'} // Animate when quote content changes
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading && !quote ? (
          <LoadingIndicator><FaSpinner /></LoadingIndicator>
        ) : error ? (
          <ErrorIndicator><FaExclamationTriangle /> {error}</ErrorIndicator>
        ) : quote ? (
          <>
            <QuoteText>"{quote.content}"</QuoteText>
            <AuthorText>- {quote.author}</AuthorText>
          </>
        ) : (
           <ErrorIndicator>Could not load quote.</ErrorIndicator> // Fallback if no quote and no error string
        )}
      </QuoteWrapper>
    </QuoteContainer>
  );
};

export default MotivationalQuote; 