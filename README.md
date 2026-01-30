# Gesture Particles

A gesture-controlled 3D particle system web application featuring real-time hand tracking and interactive particle effects.

## Features

- **3D Particle System**: ~2000 glowing particles rendered with Three.js
- **Hand Gesture Control**: Real-time hand detection using MediaPipe
  - Pinch gesture: Contract particles toward center
  - Open hand: Explode particles outward
  - Hand movement: Repel/push nearby particles
- **Shape Morphing**: Smooth transitions between 8 shapes (Sphere, Cube, Heart, Spiral, Galaxy, Firework, Bubble, Saturn)
- **UI Controls**: Color picker, particle size, glow strength sliders

## Requirements

**Node.js 18+ is required** to run this project.

Check your Node.js version:
```bash
node -v
```

If you need to upgrade Node.js, visit: https://nodejs.org/

Or use nvm (Node Version Manager):
```bash
# Install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

## Installation

```bash
cd gesture-particles
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

1. Allow camera access when prompted
2. Position your hand in front of the camera
3. Use gestures to control particles:
   - **Pinch** (thumb + index finger close): Particles contract
   - **Open hand** (spread fingers): Particles explode outward
   - **Move hand**: Particles are pushed away

## Tech Stack

- React 18 + TypeScript
- Three.js / @react-three/fiber
- MediaPipe Tasks Vision
- Tailwind CSS
- Zustand
- Vite

## Project Structure

```
gesture-particles/
├── src/
│   ├── components/
│   │   ├── ParticleSystem.tsx    # 3D particle rendering
│   │   ├── Starfield.tsx         # Background stars
│   │   └── ControlPanel.tsx      # UI controls
│   ├── hooks/
│   │   └── useHandTracking.ts    # MediaPipe hand detection
│   ├── store/
│   │   └── useStore.ts           # Zustand state management
│   ├── utils/
│   │   └── shapes.ts             # Shape generation functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```
