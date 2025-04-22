import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FitMe Tracker heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/FitMe Tracker/i);
  expect(headingElement).toBeInTheDocument();
});
