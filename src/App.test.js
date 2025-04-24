import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Navigation component', () => {
  render(<App />);
  // Check if one of the navigation links is present
  const workoutLinkElement = screen.getByText(/Workout Generator/i);
  expect(workoutLinkElement).toBeInTheDocument();
  const waterLinkElement = screen.getByText(/Water Tracker/i);
  expect(waterLinkElement).toBeInTheDocument();
  // We can also check for the new Meals link if the Navigation component includes it
  // const mealsLinkElement = screen.getByText(/Meals/i); 
  // expect(mealsLinkElement).toBeInTheDocument();
});
