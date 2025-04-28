import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaVolumeUp, FaMusic } from "react-icons/fa";

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled components
const ButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SoundButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) =>
    props.isPlaying
      ? props.theme.accent
      : props.theme.isDark
      ? "rgba(30, 30, 40, 0.8)"
      : "rgba(255, 255, 255, 0.8)"};
  color: ${(props) => (props.isPlaying ? "white" : props.theme.text)};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid
    ${(props) =>
      props.theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  animation: ${(props) => (props.isPlaying ? pulse : "none")} 2s infinite;

  svg {
    font-size: 1.2rem;
    animation: ${(props) => (props.isPlaying ? rotate : "none")} 8s linear
      infinite;
  }
`;

const VolumeControl = styled.input`
  width: 100px;
  margin-top: 10px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.isVisible ? "translateY(0)" : "translateY(10px)"};
  transition: all 0.3s ease;
  pointer-events: ${(props) => (props.isVisible ? "auto" : "none")};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${(props) => props.theme.accent};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${(props) => props.theme.accent};
    cursor: pointer;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) =>
    props.theme.isDark ? "rgba(30, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.9)"};
  color: ${(props) => props.theme.text};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid
    ${(props) =>
      props.theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${(props) =>
      props.theme.isDark
        ? "rgba(30, 30, 40, 0.9) transparent transparent transparent"
        : "rgba(255, 255, 255, 0.9) transparent transparent transparent"};
  }
`;

const AmbientSoundButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/audio/gym-ambient.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Add error handling for audio loading
    audioRef.current.onerror = (error) => {
      console.error("Error loading audio file:", error);
      alert(
        "Could not load the ambient sound file. Please check if the file exists."
      );
    };

    // Preload the audio
    audioRef.current.load();

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
    // We only want this effect to run once on mount, and volume is handled in another effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) {
      console.error("Audio element not initialized");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setShowVolumeControl(false);
    } else {
      // Play with better error handling
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
            setShowVolumeControl(true);
          })
          .catch((error) => {
            // Auto-play was prevented or another error occurred
            console.error("Audio playback failed:", error);
            alert(
              "Could not play the ambient sound. This might be due to browser autoplay restrictions. Please try clicking the button again."
            );
            setIsPlaying(false);
            setShowVolumeControl(false);
          });
      }
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <ButtonContainer>
      <Tooltip isVisible={showTooltip}>
        {isPlaying ? "Pause Ambient Music" : "Play Gym Ambient Music"}
      </Tooltip>

      <SoundButton
        isPlaying={isPlaying}
        onClick={togglePlay}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
      >
        {isPlaying ? <FaMusic /> : <FaVolumeUp />}
      </SoundButton>

      <VolumeControl
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        isVisible={showVolumeControl}
        aria-label="Volume control"
      />
    </ButtonContainer>
  );
};

export default AmbientSoundButton;
