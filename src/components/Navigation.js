import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaDumbbell, FaTint, FaUtensils } from "react-icons/fa";

const Nav = styled.nav`
  background: ${(props) => props.theme.cardBackground};
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.accent};
    color: white;
  }

  &.active {
    background: ${(props) => props.theme.accent};
    color: white;
  }
`;

const Navigation = () => {
  return (
    <Nav>
      <NavContainer>
        <NavItem to="/">
          <FaDumbbell /> Workout Generator
        </NavItem>
        <NavItem to="/hydration">
          <FaTint /> Water Tracker
        </NavItem>
        <NavItem to="/meals">
          <FaUtensils /> Meal Tracker
        </NavItem>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;
