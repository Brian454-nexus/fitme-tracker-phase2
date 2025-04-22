import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const TestContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem;
`;

const APITest = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "https://api.api-ninjas.com/v1/exercises?muscle=chest",
          {
            headers: {
              "X-Api-Key": process.env.REACT_APP_API_NINJAS_KEY,
            },
          }
        );
        setExercises(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <TestContainer>Loading API test...</TestContainer>;
  if (error) return <TestContainer>Error: {error}</TestContainer>;

  return (
    <TestContainer>
      <h2>API Test Results</h2>
      <p>Successfully connected to API! Found {exercises.length} exercises.</p>
      <div>
        <h3>Sample Exercise:</h3>
        {exercises[0] && (
          <div>
            <p>
              <strong>Name:</strong> {exercises[0].name}
            </p>
            <p>
              <strong>Type:</strong> {exercises[0].type}
            </p>
            <p>
              <strong>Muscle:</strong> {exercises[0].muscle}
            </p>
            <p>
              <strong>Equipment:</strong> {exercises[0].equipment}
            </p>
            <p>
              <strong>Difficulty:</strong> {exercises[0].difficulty}
            </p>
          </div>
        )}
      </div>
    </TestContainer>
  );
};

export default APITest;
