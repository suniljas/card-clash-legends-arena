/**
 * Backend Architecture Definition
 * 
 * This file defines the authoritative server architecture for Card Clash Legends Arena.
 * The backend is responsible for all game logic validation, real-time multiplayer,
 * and data persistence to ensure fair play and prevent cheating.
 */

export interface BackendArchitecture {
  framework: 'NestJS';
  runtime: 'Node.js';
  gameEngine: 'SharedTypeScriptGameEngine';
  realTimeProtocol: 'WebSockets';
  database: 'PostgreSQL' | 'MongoDB';
  authentication: 'Firebase Auth' | 'JWT';
  hosting: 'Cloud Platform';
}

export interface GameServerConfig {
  // Server validation settings
  validateAllGameActions: boolean;
  enforceCardOwnership: boolean;
  validateDeckComposition: boolean;
  antiCheatEnabled: boolean;
  
  // Performance settings
  maxConcurrentMatches: number;
  tickRate: number; // Server update frequency
  timeoutSettings: {
    turnTimeout: number;
    matchTimeout: number;
    connectionTimeout: number;
  };
  
  // Rate limiting
  actionsPerSecond: number;
  maxDeckChangesPerHour: number;
}

export interface ServerEndpoints {
  // Authentication
  '/auth/login': 'POST';
  '/auth/logout': 'POST';
  '/auth/refresh': 'POST';
  
  // Player data
  '/player/profile': 'GET | PUT';
  '/player/collection': 'GET';
  '/player/decks': 'GET | POST | PUT | DELETE';
  '/player/stats': 'GET';
  
  // Matchmaking
  '/matchmaking/queue': 'POST';
  '/matchmaking/cancel': 'DELETE';
  '/matchmaking/status': 'GET';
  
  // Game sessions
  '/game/create': 'POST';
  '/game/join': 'POST';
  '/game/action': 'POST';
  '/game/state': 'GET';
  '/game/end': 'POST';
  
  // Store and economy
  '/store/packs': 'GET';
  '/store/purchase': 'POST';
  '/store/verify-purchase': 'POST';
  
  // Social features
  '/social/friends': 'GET | POST | DELETE';
  '/social/challenges': 'GET | POST';
  '/social/leaderboards': 'GET';
  
  // Admin and LiveOps
  '/admin/events': 'GET | POST | PUT | DELETE';
  '/admin/players': 'GET | PUT';
  '/admin/economy': 'GET | PUT';
  '/admin/analytics': 'GET';
}

export interface WebSocketEvents {
  // Connection management
  'connect': 'Establish connection';
  'disconnect': 'Close connection';
  'authenticate': 'Verify player identity';
  
  // Matchmaking
  'queue_join': 'Join matchmaking queue';
  'queue_leave': 'Leave matchmaking queue';
  'match_found': 'Opponent found, match starting';
  
  // Game state
  'game_start': 'Match has begun';
  'game_action': 'Player performed an action';
  'game_state_update': 'Server sends updated game state';
  'game_end': 'Match concluded';
  
  // Real-time features
  'player_reconnect': 'Player rejoined match';
  'opponent_disconnect': 'Opponent lost connection';
  'turn_timeout_warning': 'Turn ending soon';
  
  // Social
  'friend_online': 'Friend came online';
  'friend_challenge': 'Friend sent challenge';
  'message_received': 'Chat message received';
}

export interface DataValidation {
  // Card validation
  validateCardExists: (cardId: string) => boolean;
  validateCardInCollection: (playerId: string, cardId: string) => boolean;
  validateDeckLegality: (deck: any[]) => boolean;
  
  // Action validation
  validatePlayerTurn: (gameId: string, playerId: string) => boolean;
  validateActionLegality: (action: any, gameState: any) => boolean;
  validateManaRequirement: (action: any, playerMana: number) => boolean;
  
  // Economy validation
  validatePurchase: (playerId: string, itemId: string, currency: string) => boolean;
  validateTradeRequest: (fromPlayer: string, toPlayer: string, offer: any) => boolean;
}

export interface SecurityMeasures {
  // Input validation
  sanitizeAllInputs: boolean;
  validateRequestOrigin: boolean;
  rateLimitingEnabled: boolean;
  
  // Anti-cheat
  serverSideValidation: boolean;
  actionTimestampValidation: boolean;
  suspiciousActivityDetection: boolean;
  
  // Data protection
  encryptSensitiveData: boolean;
  auditLogAllActions: boolean;
  gdprCompliant: boolean;
}

/**
 * Recommended Backend Architecture
 * 
 * Framework: NestJS - Provides excellent TypeScript support, decorators for validation,
 * and modular architecture that scales well with our game's complexity.
 * 
 * Real-time Communication: WebSockets - Essential for responsive multiplayer gameplay,
 * turn notifications, and live spectating features.
 * 
 * Game Engine: Shared TypeScript codebase between client and server ensures consistency
 * in game logic while preventing client-side manipulation.
 * 
 * Database: PostgreSQL for relational data (players, matches, transactions) with Redis
 * for session management and real-time game state caching.
 * 
 * Authentication: Firebase Auth integration for social login and JWT tokens for API access.
 * 
 * Deployment: Containerized with Docker, deployed on cloud platform (AWS/GCP/Azure)
 * with auto-scaling capabilities to handle peak loads.
 */

export const RECOMMENDED_ARCHITECTURE: BackendArchitecture = {
  framework: 'NestJS',
  runtime: 'Node.js',
  gameEngine: 'SharedTypeScriptGameEngine',
  realTimeProtocol: 'WebSockets',
  database: 'PostgreSQL',
  authentication: 'Firebase Auth',
  hosting: 'Cloud Platform'
};

export const DEFAULT_SERVER_CONFIG: GameServerConfig = {
  validateAllGameActions: true,
  enforceCardOwnership: true,
  validateDeckComposition: true,
  antiCheatEnabled: true,
  maxConcurrentMatches: 10000,
  tickRate: 20, // 20 updates per second
  timeoutSettings: {
    turnTimeout: 60000, // 60 seconds per turn
    matchTimeout: 1800000, // 30 minutes max per match
    connectionTimeout: 30000 // 30 seconds to reconnect
  },
  actionsPerSecond: 10,
  maxDeckChangesPerHour: 20
};