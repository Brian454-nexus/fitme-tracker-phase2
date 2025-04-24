# FitMe - Fitness & Wellness Tracker

FitMe is a personal fitness and wellness web app that helps users stay fit, healthy, and motivated. This project is part of a group class project, focusing on the workout generation feature.

## Features

### Workout Generator
- Interactive 3D muscle group selection
- Real-time workout generation based on selected muscle group
- Detailed exercise instructions and demonstrations
- Difficulty level filtering
- Beautiful, modern UI with smooth animations

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/fitme-tracker-phase2.git
cd fitme-tracker-phase2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API key:
```
REACT_APP_API_NINJAS_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

## API Integration

The workout feature uses the API Ninjas Exercise API. You'll need to:
1. Sign up for an API key at [API Ninjas](https://api-ninjas.com/)
2. Add your API key to the `.env` file

## 3D Models

The project uses 3D models for muscle group visualization. Models should be placed in the `public/models` directory with the following naming convention:
- chest.glb
- back.glb
- legs.glb
- arms.glb
- shoulders.glb
- core.glb

## Project Structure

```
src/
├── components/
│   └── workout/
│       ├── WorkoutGenerator.js
│       └── ExerciseCard.js
├── hooks/
│   └── useWorkouts.js
├── utils/
│   └── modelUtils.js
└── App.js
```

## Contributing

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "Description of your changes"
```

3. Push your changes:
```bash
git push origin feature/your-feature-name
```

4. Create a pull request for review.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

