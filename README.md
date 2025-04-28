# FitMe Tracker - Comprehensive Fitness & Wellness Platform

<div align="center">
  <img src="public/logo192.png" alt="FitMe Tracker Logo" width="120" />
  <h3>Your All-in-One Fitness Companion</h3>
</div>

## 🌟 Overview

FitMe Tracker is a modern, feature-rich fitness and wellness application designed to help users achieve their health goals through personalized workout plans, nutrition tracking, hydration monitoring, and motivational support. Built with React and styled-components, FitMe Tracker offers a seamless, intuitive user experience with responsive design and interactive features.

### 🔗 Live Demo

[Visit FitMe Tracker](https://fitme-tracker.netlify.app) - Experience the application live!

## ✨ Key Features

### 🏋️ Workout Generator

- **Interactive Fitness Quiz** - Personalized workout recommendations based on your goals, fitness level, and preferences
- **3D Muscle Group Selection** - Visual muscle targeting with interactive 3D models
- **Comprehensive Exercise Library** - Detailed instructions, difficulty levels, and equipment requirements
- **Offline Support** - Fallback exercise data ensures functionality even without internet connection

### 🥗 Nutrition Tracker

- **Meal Discovery** - Search and explore thousands of recipes from around the world
- **Meal Logging** - Track daily calorie intake and nutritional breakdown
- **Customizable Goals** - Set personalized calorie targets
- **Daily Log Management** - Easily delete individual meals or clear the entire day's log

### 💧 Hydration Tracker

- **Daily Water Intake Monitoring** - Visual representation of your hydration progress
- **Customizable Goals** - Set personal water intake targets
- **Intake History** - Track your hydration patterns over time
- **Quick-Add Functionality** - Log water intake with a single click

### 🎵 Ambient Sound

- **Gym Atmosphere** - Immersive workout experience with ambient gym sounds
- **Volume Control** - Adjustable audio levels for personalized experience
- **Background Playback** - Continues playing while you navigate the app

### 💪 Motivational Features

- **Daily Quotes** - Inspirational fitness and wellness quotes to keep you motivated
- **Progress Visualization** - See your achievements and improvements over time
- **Daily Summary** - Overview of your fitness activities, nutrition, and hydration

## 🛠️ Technology Stack

- **Frontend Framework**: React.js with Hooks
- **Styling**: Styled-components with ThemeProvider for dark/light mode
- **Animations**: Framer Motion for fluid UI transitions
- **3D Rendering**: Three.js for interactive muscle models
- **State Management**: React Context API and local state
- **API Integration**:
  - API Ninjas Exercise API for workout data
  - TheMealDB API for nutrition information
- **Storage**: LocalStorage for persistent user data
- **Routing**: React Router for seamless navigation

## 📱 Responsive Design

FitMe Tracker is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile devices

The UI automatically adapts to provide the best experience on any screen size.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/fitme-tracker.git
cd fitme-tracker
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your API keys:

```
REACT_APP_API_NINJAS_KEY=your_api_ninjas_key_here
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🏗️ Project Structure

```
fitme-tracker/
├── public/
│   ├── audio/                # Ambient sound files
│   ├── models/               # 3D muscle group models
│   └── images/               # Static images and icons
├── src/
│   ├── components/
│   │   ├── audio/            # Audio player components
│   │   ├── hydration/        # Water tracking components
│   │   ├── quotes/           # Motivational quotes components
│   │   ├── summary/          # Daily summary components
│   │   ├── ui/               # Reusable UI components
│   │   └── workout/          # Workout generation components
│   ├── context/              # React context providers
│   ├── data/                 # Static data and fallback data
│   ├── features/
│   │   └── meals/            # Nutrition tracking feature
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API service layer
│   ├── theme/                # Theme definitions
│   └── utils/                # Utility functions
└── package.json
```

## 🔄 API Integration

### Exercise API

The workout feature uses the API Ninjas Exercise API with fallback data for offline functionality:

1. Sign up for an API key at [API Ninjas](https://api-ninjas.com/)
2. Add your API key to the `.env` file

### Meal API

The nutrition tracker uses TheMealDB API:

- Free public API with no key required for basic functionality
- Includes fallback meal data for reliable performance

## 🌙 Dark Mode / Light Mode

FitMe Tracker includes a complete theme system with:

- Light mode for daytime use
- Dark mode to reduce eye strain in low-light environments
- Persistent theme preference saved to localStorage

## 🤝 Contributing

We welcome contributions to FitMe Tracker! Here's how you can help:

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [API Ninjas](https://api-ninjas.com/) for exercise data
- [TheMealDB](https://www.themealdb.com/) for nutrition data
- [React Icons](https://react-icons.github.io/react-icons/) for the icon set
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Styled Components](https://styled-components.com/) for styling
- [Three.js](https://threejs.org/) for 3D rendering

---

<div align="center">
  <p>Built with ❤️ by the FitMe Team</p>
  <p>© 2023 FitMe Tracker. All rights reserved.</p>
</div>
