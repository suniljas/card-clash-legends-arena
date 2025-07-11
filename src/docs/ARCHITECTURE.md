# Card Clash Legends Arena - Architecture Documentation

## Overview
Card Clash Legends Arena is a mobile-first card collection and battle game built with React, TypeScript, and Capacitor for cross-platform deployment.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Mobile**: Capacitor for native Android/iOS deployment
- **State Management**: React hooks with localStorage persistence
- **Routing**: React Router DOM
- **Performance**: React Query for data management

## Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui base components
│   ├── Game.tsx        # Main game container
│   ├── MainMenu.tsx    # Navigation hub
│   ├── BattleSystem.tsx # Turn-based combat
│   ├── Collection.tsx  # Hero card collection
│   ├── DeckBuilder.tsx # Deck building interface
│   ├── Campaign.tsx    # Single-player campaigns
│   ├── PvPArena.tsx    # Multiplayer battles
│   ├── Marketplace.tsx # Card trading system
│   ├── EventCenter.tsx # Limited-time events
│   └── Tutorial.tsx    # User onboarding
├── data/               # Game data and configurations
│   ├── heroes.ts       # Hero card definitions
│   ├── campaigns.ts    # Campaign levels and progression
│   └── events.ts       # Event system data
├── hooks/              # Custom React hooks
│   ├── useGameState.ts # Main game state management
│   ├── useWebSocket.ts # Multiplayer connectivity
│   └── usePerformanceOptimization.ts # Mobile performance
├── types/              # TypeScript type definitions
│   └── game.ts         # Core game interfaces
└── assets/             # Static assets and images
```

## Core Systems

### 1. Game State Management
- **Location**: `src/hooks/useGameState.ts`
- **Features**: 
  - Player collection and deck management
  - Currency system (coins, gems)
  - Campaign progress tracking
  - LocalStorage persistence
  - Card pack opening mechanics

### 2. Battle System
- **Location**: `src/components/BattleSystem.tsx`
- **Features**:
  - Turn-based combat mechanics
  - Real-time battle animations
  - Health and attack calculations
  - Victory/defeat conditions
  - Experience and reward distribution

### 3. Card System
- **Location**: `src/data/heroes.ts`, `src/types/game.ts`
- **Features**:
  - Rarity-based card tiers (Common to Ultra Legend)
  - Level progression and experience
  - Stat calculations and abilities
  - Visual effects and animations

### 4. Campaign System
- **Location**: `src/components/Campaign.tsx`, `src/data/campaigns.ts`
- **Features**:
  - Progressive difficulty scaling
  - Endless campaign generation
  - Reward systems
  - Boss battles and special encounters

### 5. Multiplayer System
- **Location**: `src/components/PvPArena.tsx`, `src/hooks/useWebSocket.ts`
- **Features**:
  - Real-time matchmaking
  - WebSocket communication
  - Fallback AI opponents
  - Network status monitoring

### 6. Marketplace System
- **Location**: `src/components/Marketplace.tsx`
- **Features**:
  - Player-to-player card trading
  - Currency-based transactions
  - Listing management
  - Transaction security

### 7. Event System
- **Location**: `src/components/EventCenter.tsx`, `src/data/events.ts`
- **Features**:
  - Limited-time challenges
  - Tournament mechanics
  - Special reward distributions
  - Dynamic event generation

## Mobile Optimization

### Android-Specific Features
- **Touch Targets**: Minimum 48px for Android accessibility
- **Haptic Feedback**: Using Capacitor Haptics API
- **Performance Monitoring**: FPS and memory tracking
- **Network Optimization**: Offline-first architecture

### Performance Strategies
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Memory Management**: Component cleanup and optimization
- **Battery Efficiency**: Reduced animations and background processing

## Data Flow

### Game State Flow
```
User Action → Component → useGameState Hook → localStorage → UI Update
```

### Battle Flow
```
Battle Start → Turn Management → Action Processing → State Update → Animation → Next Turn
```

### Multiplayer Flow
```
Action → WebSocket → Server → Opponent → State Sync → UI Update
```

## Security Considerations

### Data Protection
- **Client-side encryption** for sensitive game data
- **Input validation** for all user interactions
- **XSS prevention** through React's built-in protections

### Anti-cheat Measures
- **Server-side validation** for critical game actions
- **Checksums** for game state integrity
- **Rate limiting** for API calls and actions

## Deployment

### Development
```bash
npm install
npm run dev
```

### Android Build
```bash
npm run build
npx cap add android
npx cap sync android
npx cap run android
```

### Production
```bash
npm run build
npx cap sync
# Deploy to app stores
```

## Testing Strategy

### Unit Tests
- Component functionality
- Game mechanics
- State management

### Integration Tests
- Battle system workflows
- Multiplayer connectivity
- Data persistence

### Performance Tests
- Mobile device compatibility
- Memory usage optimization
- Network efficiency

## Future Enhancements

### Planned Features
- **Clan System**: Guild-based gameplay
- **Advanced Analytics**: Player behavior tracking
- **Cloud Save**: Cross-device progression
- **Social Features**: Friend lists and chat
- **Competitive Seasons**: Ranked play systems

### Technical Debt
- **Code splitting** optimization
- **Bundle size** reduction
- **Performance** monitoring expansion
- **Accessibility** improvements