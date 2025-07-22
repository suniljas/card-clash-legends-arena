import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { HeroCard } from '@/types/game';

// Slimmed down interfaces for better memory usage
export interface GameStats {
  wins: number;
  losses: number;
  winStreak: number;
  currentRank: string;
  rankPoints: number;
}

export interface PlayerDeck {
  id: string;
  name: string;
  cards: string[]; // Store only IDs
  isValid: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  language: string;
  fastAnimations: boolean;
  lowMemoryMode: boolean; // New setting for performance
}

// Lightweight store interface
interface OptimizedGameStore {
  // Core data (minimized)
  collection: string[]; // Store only card IDs to reduce memory
  currentDeck: string[];
  gameStats: GameStats;
  settings: GameSettings;
  
  // UI state
  currentView: string;
  isLoading: boolean;
  
  // Cached data (cleared periodically)
  cardCache: Map<string, HeroCard>;
  lastCacheClean: number;
  
  // Actions
  addToCollection: (cardId: string) => void;
  updateCurrentDeck: (cardIds: string[]) => void;
  updateGameStats: (stats: Partial<GameStats>) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setCurrentView: (view: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Cache management
  cacheCard: (card: HeroCard) => void;
  getCachedCard: (cardId: string) => HeroCard | undefined;
  clearOldCache: () => void;
  
  // Memory management
  cleanup: () => void;
}

const defaultGameStats: GameStats = {
  wins: 0,
  losses: 0,
  winStreak: 0,
  currentRank: 'Bronze',
  rankPoints: 0,
};

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  language: 'en',
  fastAnimations: true, // Default to fast animations
  lowMemoryMode: false,
};

// Cache cleanup interval (5 minutes)
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 100; // Limit cached cards

export const useOptimizedGameStore = create<OptimizedGameStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        collection: [],
        currentDeck: [],
        gameStats: defaultGameStats,
        settings: defaultSettings,
        currentView: 'main-menu',
        isLoading: false,
        cardCache: new Map(),
        lastCacheClean: Date.now(),

        // Actions
        addToCollection: (cardId) => {
          set((state) => ({
            collection: state.collection.includes(cardId) 
              ? state.collection 
              : [...state.collection, cardId],
          }));
        },

        updateCurrentDeck: (cardIds) => {
          set({ currentDeck: cardIds.slice(0, 30) }); // Limit deck size
        },

        updateGameStats: (stats) => {
          set((state) => ({
            gameStats: { ...state.gameStats, ...stats },
          }));
        },

        updateSettings: (newSettings) => {
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          }));
        },

        setCurrentView: (view) => set({ currentView: view }),
        setLoading: (loading) => set({ isLoading: loading }),

        // Cache management
        cacheCard: (card) => {
          set((state) => {
            const newCache = new Map(state.cardCache);
            
            // Limit cache size
            if (newCache.size >= MAX_CACHE_SIZE) {
              const firstKey = newCache.keys().next().value;
              newCache.delete(firstKey);
            }
            
            newCache.set(card.id, card);
            return { cardCache: newCache };
          });
        },

        getCachedCard: (cardId) => {
          return get().cardCache.get(cardId);
        },

        clearOldCache: () => {
          const now = Date.now();
          const state = get();
          
          if (now - state.lastCacheClean > CACHE_CLEANUP_INTERVAL) {
            set({
              cardCache: new Map(),
              lastCacheClean: now
            });
          }
        },

        // Memory cleanup
        cleanup: () => {
          set({
            cardCache: new Map(),
            lastCacheClean: Date.now()
          });
          
          // Force garbage collection if available
          if (window.gc) {
            window.gc();
          }
        },
      }),
      {
        name: 'optimized-game-store',
        version: 1,
        // Only persist essential data
        partialize: (state) => ({
          collection: state.collection,
          currentDeck: state.currentDeck,
          gameStats: state.gameStats,
          settings: state.settings,
        }),
      }
    )
  )
);

// Optimized selectors
export const useCollection = () => useOptimizedGameStore((state) => state.collection);
export const useCurrentDeck = () => useOptimizedGameStore((state) => state.currentDeck);
export const useGameStats = () => useOptimizedGameStore((state) => state.gameStats);
export const useGameSettings = () => useOptimizedGameStore((state) => state.settings);
export const useCurrentView = () => useOptimizedGameStore((state) => state.currentView);

// Memory management hook
export const useMemoryManager = () => {
  const cleanup = useOptimizedGameStore((state) => state.cleanup);
  const clearOldCache = useOptimizedGameStore((state) => state.clearOldCache);
  
  return { cleanup, clearOldCache };
};