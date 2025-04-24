import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

// --- Config ---
const API_URL = "https://zenquotes.io/api/random"; // Changed API URL
const REFRESH_INTERVAL = 20000; // 20 seconds

// Video background path (adjust if needed)
const videoSrc = "/images/quotes/quote_background.mp4";

// --- Styled Components ---
const QuoteContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 250px; // Increased height
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
  const [isLoading, setIsLoading] = useState(true); // Start loading true only on initial mount
  const [error, setError] = useState(null);

  // useCallback with empty dependency array: function definition is stable
  const fetchQuote = useCallback(async () => {
    console.log("Fetching new quote...");
    // Set loading true only if this is the first load (no quote yet)
    // For refreshes, we don't necessarily need to show the spinner
    setQuote((currentQuote) => {
      if (!currentQuote) {
        console.log("Setting loading to true (initial fetch)");
        setIsLoading(true);
      }
      return currentQuote;
    });
    setError(null); // Clear previous error

    try {
      console.log(`Requesting: ${API_URL}`);
      // ZenQuotes sometimes has CORS issues with browser requests.
      // A simple proxy might be needed if direct calls fail.
      // Let's try direct first, then consider a proxy like `https://cors-anywhere.herokuapp.com/` if needed.
      const response = await axios.get(`https://cors-anywhere.herokuapp.com/${API_URL}`); // Proxy example
      //const response = await axios.get(API_URL);
      console.log("API Response Received:", response);

      // ZenQuotes returns an array, usually with one object.
      if (
        response.data &&
        response.data.length > 0 &&
        response.data[0].q &&
        response.data[0].a
      ) {
        const fetchedQuote = response.data[0];
        console.log("Valid quote found:", fetchedQuote.q);
        setQuote({
          content: fetchedQuote.q, // Use 'q' for quote content
          author: fetchedQuote.a, // Use 'a' for author
        });
        setError(null);
      } else {
        console.error("Invalid quote format received:", response.data);
        throw new Error("Invalid quote format received from ZenQuotes");
      }
    } catch (err) {
      const errorMsg = err.response
        ? JSON.stringify(err.response.data)
        : err.message;
      console.error("Error fetching quote:", errorMsg);
      setQuote((currentQuote) => {
        if (!currentQuote) {
          console.log("Setting error state because no current quote exists.");
          setError("Couldn't load quote.");
        } else {
          console.warn(
            "Failed to refresh quote, keeping previous one. Error:",
            errorMsg
          );
        }
        return currentQuote;
      });
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]); // Depends on the stable fetchQuote function

  // Auto-refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchQuote, REFRESH_INTERVAL);
    return () => {
      console.log("Clearing quote refresh interval");
      clearInterval(intervalId);
    };
  }, [fetchQuote]); // Depends on the stable fetchQuote function

  console.log(
    "Render - isLoading:",
    isLoading,
    "quote:",
    quote,
    "error:",
    error
  );

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
        key={quote ? quote.content : "loading"} // Animate when quote content changes
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Render Logic prioritizing loading state */}
        {isLoading ? (
          <LoadingIndicator>
            <FaSpinner />
          </LoadingIndicator>
        ) : quote ? (
          <>
            <QuoteText>"{quote.content}"</QuoteText>
            <AuthorText>- {quote.author}</AuthorText>
          </>
        ) : error ? (
          <ErrorIndicator>
            <FaExclamationTriangle /> {error}
          </ErrorIndicator>
        ) : (
          <ErrorIndicator>Could not load quote.</ErrorIndicator> // Fallback
        )}
      </QuoteWrapper>
    </QuoteContainer>
  );
};

export default MotivationalQuote;
