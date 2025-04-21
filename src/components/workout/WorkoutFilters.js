import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const FiltersContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const FilterButton = styled(motion.button)`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #2980b9;
  }
`;

const WorkoutFilters = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onApplyFilters,
}) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <FiltersContainer>
      <FilterGroup>
        <FilterLabel>Difficulty</FilterLabel>
        <FilterSelect
          name="difficulty"
          value={filters.difficulty}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Equipment</FilterLabel>
        <FilterSelect
          name="equipment"
          value={filters.equipment}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="body only">Body Only</option>
          <option value="dumbbell">Dumbbell</option>
          <option value="barbell">Barbell</option>
          <option value="machine">Machine</option>
          <option value="cable">Cable</option>
          <option value="kettlebell">Kettlebell</option>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Type</FilterLabel>
        <FilterSelect
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="stretching">Stretching</option>
          <option value="plyometrics">Plyometrics</option>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Sort By</FilterLabel>
        <FilterSelect value={sortBy} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="difficulty">Difficulty</option>
          <option value="equipment">Equipment</option>
        </FilterSelect>
      </FilterGroup>

      <FilterButton
        onClick={onApplyFilters}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Apply Filters
      </FilterButton>
    </FiltersContainer>
  );
};

export default WorkoutFilters;
