/**
 * Light theme configuration
 * @typedef {Object} Theme
 * @property {string} background - Main background color
 * @property {string} text - Primary text color
 * @property {string} cardBackground - Background color for cards and containers
 * @property {string} accent - Accent color for highlights and buttons
 * @property {string} border - Border color
 * @property {string} primary - Primary brand color
 * @property {string} secondary - Secondary color for UI elements
 * @property {string} error - Color for error states
 * @property {string} success - Color for success states
 * @property {string} warning - Color for warning states
 * @property {string} info - Color for informational states
 */
export const lightTheme = {
  background: "#FFFFFF",
  text: "#000000",
  cardBackground: "#F8F9FA",
  accent: "#FF4500",
  border: "#E0E0E0",
  primary: "#FF4500",
  secondary: "#000000",
  error: "#FF4444",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",
  // High contrast for accessibility
  highContrast: {
    text: "#000000",
    background: "#FFFFFF",
    accent: "#D03000"
  }
};

/**
 * Dark theme configuration
 * @type {Theme}
 */
export const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  cardBackground: "#1E1E1E",
  accent: "#FF4500",
  border: "#333333",
  primary: "#FF4500",
  secondary: "#FFFFFF",
  error: "#FF6B6B",
  success: "#66BB6A",
  warning: "#FFCA28",
  info: "#42A5F5",
  // High contrast for accessibility
  highContrast: {
    text: "#FFFFFF",
    background: "#121212",
    accent: "#FF6E40"
  }
};
