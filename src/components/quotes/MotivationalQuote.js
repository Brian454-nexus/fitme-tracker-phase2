import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

// --- Config ---
const API_URL = "https://api.quotable.io/random";
const REFRESH_INTERVAL = 20000; // 20 seconds

// Video background path (adjust if needed)
const videoSrc = "/images/quotes/quote_background.mp4";

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

// Changed from img to video
const BackgroundVideo = styled.video`
  position: absolute;
  top: 50%; /* Center video */
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 1;
  transform: translate(-50%, -50%); /* Center video */
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.7)
  ); /* Adjusted overlay */
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
  font-size: 1.5rem;
  color: white;
  opacity: 0.8;
  svg {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorIndicator = styled.div`
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

  const fetchQuote = useCallback(async () => {
    // Show loading only on initial load or if there's an error
    if (!quote || error) setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.content && response.data.author) {
        setQuote({
          content: response.data.content,
          author: response.data.author,
        });
      } else {
        throw new Error("Invalid quote format received");
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("Couldn't load a quote right now.");
      // Don't clear the old quote if a refresh fails
      // setQuote(null); // Keep previous quote on error
    } finally {
      setIsLoading(false); // Always set loading to false after attempt
    }
    // Removed dependencies: isLoading, quote. Only fetch based on interval or mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]); // Re-fetch if there was an error maybe? Or just rely on interval.

  // Initial fetch
  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only once on mount

  // Auto-refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchQuote, REFRESH_INTERVAL);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchQuote]);

  return (
    <QuoteContainer layout>
      {/* Video Background */}
      <BackgroundVideo
        key={videoSrc} // Use key to potentially help React manage the element
        autoPlay
        loop
        muted // Muted is required for autoplay in most browsers
        playsInline // Important for mobile playback
        src={videoSrc}
      />
      <Overlay />
      <QuoteWrapper
        key={quote ? quote.content : "loading"} // Animate when quote content changes
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <LoadingIndicator>
            <FaSpinner />
          </LoadingIndicator>
        ) : error && !quote ? ( // Show error only if there's no quote to display
          <ErrorIndicator>
            <FaExclamationTriangle /> {error}
          </ErrorIndicator>
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
