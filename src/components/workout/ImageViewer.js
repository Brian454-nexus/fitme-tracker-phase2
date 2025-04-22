import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ImageContainer = styled(motion.div)`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MuscleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ErrorText = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
`;

const ImageViewer = ({ imageUrl, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <ImageContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading && <LoadingText>Loading image...</LoadingText>}
      {hasError ? (
        <ErrorText>Failed to load image</ErrorText>
      ) : (
        <MuscleImage
          src={imageUrl}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </ImageContainer>
  );
};

export default ImageViewer;
