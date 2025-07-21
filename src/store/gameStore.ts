import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeroCard } from '@/types/game';

// Core game state interfaces
export interface GameStats {
  wins: number;
  losses: number;
  totalGames: number;
  winStreak: number;
  bestWinStreak: number;
  rankedWins: number;
  rankedLosses: number;
  currentRank: string;
  rankPoints: number;
}

export interface PlayerDeck {
  id: string;
  name: string;
  cards: string[];
  championId?: string;
  isValid: boolean;
  lastModified: Date;
}

export interface FactionProgress {
  [faction: string]: {
    level: number;
    experience: number;
    unlockedCards: string[];
    rewards: string[];
  };
}

export interface WeeklyVault {
  level: number;
  experience: number;
  maxLevel: number;
  rewards: string[];
  lastOpened: Date | null;
  isReady: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
  expiresAt: Date;
}

export interface CompetitiveSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  rewards: {
    rank: string;
    reward: string;
  }[];
}

export interface CloudSaveData {
  collection: HeroCard[];
  decks: PlayerDeck[];
  gameStats: GameStats;
  factionProgress: FactionProgress;
  weeklyVault: WeeklyVault;
  dailyQuests: DailyQuest[];
  cosmeticInventory: {
    cardSkins: string[];
    boards: string[];
    emotes: string[];
    titles: string[];
  };
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    language: string;
    autoEndTurn: boolean;
    fastAnimations: boolean;
  };
  achievements: string[];
  currentSeason: CompetitiveSeason | null;
  lastSaved: Date;
  version: number;
}

// Game store interface
interface GameStore {
  // Core game data
  collection: HeroCard[];
  decks: PlayerDeck[];
  gameStats: GameStats;
  factionProgress: FactionProgress;
  weeklyVault: WeeklyVault;
  dailyQuests: DailyQuest[];
  currentSeason: CompetitiveSeason | null;
  
  // UI state
  currentView: string;
  isLoading: boolean;
  error: string | null;
  
  // Game settings
  settings: CloudSaveData['settings'];
  cosmeticInventory: CloudSaveData['cosmeticInventory'];
  achievements: string[];
  
  // Actions
  addToCollection: (card: HeroCard) => void;
  updateDeck: (deck: PlayerDeck) => void;
  deleteDeck: (deckId: string) => void;
  updateGameStats: (stats: Partial<GameStats>) => void;
  updateFactionProgress: (faction: string, experience: number) => void;
  updateWeeklyVault: (experience: number) => void;
  completeQuest: (questId: string) => void;
  generateDailyQuests: () => void;
  claimWeeklyVault: () => void;
  setCurrentView: (view: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateSettings: (settings: Partial<CloudSaveData['settings']>) => void;
  unlockAchievement: (achievementId: string) => void;
  exportSaveData: () => CloudSaveData;
  importSaveData: (data: CloudSaveData) => void;
  resetProgress: () => void;
}

// Default values
const defaultGameStats: GameStats = {
  wins: 0,
  losses: 0,
  totalGames: 0,
  winStreak: 0,
  bestWinStreak: 0,
  rankedWins: 0,
  rankedLosses: 0,
  currentRank: 'Bronze',
  rankPoints: 0,
};

const defaultWeeklyVault: WeeklyVault = {
  level: 1,
  experience: 0,
  maxLevel: 25,
  rewards: [],
  lastOpened: null,
  isReady: false,
};

const defaultSettings: CloudSaveData['settings'] = {
  soundEnabled: true,
  musicEnabled: true,
  language: 'en',
  autoEndTurn: false,
  fastAnimations: false,
};

const defaultCosmeticInventory: CloudSaveData['cosmeticInventory'] = {
  cardSkins: [],
  boards: ['default'],
  emotes: ['hello', 'well-played', 'oops'],
  titles: [],
};

// Create the store
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      collection: [],
      decks: [],
      gameStats: defaultGameStats,
      factionProgress: {},
      weeklyVault: defaultWeeklyVault,
      dailyQuests: [],
      currentSeason: null,
      currentView: 'main-menu',
      isLoading: false,
      error: null,
      settings: defaultSettings,
      cosmeticInventory: defaultCosmeticInventory,
      achievements: [],

      // Actions
      addToCollection: (card) => {
        set((state) => ({
          collection: [...state.collection, card],
        }));
      },

      updateDeck: (deck) => {
        set((state) => ({
          decks: state.decks.map((d) => (d.id === deck.id ? deck : d)),
        }));
      },

      deleteDeck: (deckId) => {
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== deckId),
        }));
      },

      updateGameStats: (stats) => {
        set((state) => ({
          gameStats: { ...state.gameStats, ...stats },
        }));
      },

      updateFactionProgress: (faction, experience) => {
        set((state) => {
          const currentProgress = state.factionProgress[faction] || {
            level: 1,
            experience: 0,
            unlockedCards: [],
            rewards: [],
          };

          const newExperience = currentProgress.experience + experience;
          const newLevel = Math.floor(newExperience / 1000) + 1;
          
          return {
            factionProgress: {
              ...state.factionProgress,
              [faction]: {
                ...currentProgress,
                experience: newExperience,
                level: newLevel,
              },
            },
          };
        });
      },

      updateWeeklyVault: (experience) => {
        set((state) => {
          const newExperience = state.weeklyVault.experience + experience;
          const newLevel = Math.min(state.weeklyVault.maxLevel, Math.floor(newExperience / 500) + 1);
          
          return {
            weeklyVault: {
              ...state.weeklyVault,
              experience: newExperience,
              level: newLevel,
              isReady: newLevel >= state.weeklyVault.maxLevel,
            },
          };
        });
      },

      completeQuest: (questId) => {
        set((state) => ({
          dailyQuests: state.dailyQuests.map((quest) =>
            quest.id === questId ? { ...quest, completed: true } : quest
          ),
        }));
      },

      generateDailyQuests: () => {
        const questTemplates = [
          { title: 'Win 3 Games', description: 'Win 3 matches in any mode', target: 3, reward: 'XP: 100' },
          { title: 'Play 10 Fire Cards', description: 'Play 10 cards from the Fire faction', target: 10, reward: 'Fire XP: 50' },
          { title: 'Deal 50 Damage', description: 'Deal 50 total damage to enemies', target: 50, reward: 'Gems: 25' },
        ];

        const newQuests: DailyQuest[] = questTemplates.map((template, index) => ({
          id: `quest-${Date.now()}-${index}`,
          title: template.title,
          description: template.description,
          progress: 0,
          target: template.target,
          reward: template.reward,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        }));

        set({ dailyQuests: newQuests });
      },

      claimWeeklyVault: () => {
        set((state) => ({
          weeklyVault: {
            ...defaultWeeklyVault,
            lastOpened: new Date(),
          },
        }));
      },

      setCurrentView: (view) => set({ currentView: view }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: [...state.achievements, achievementId],
        }));
      },

      exportSaveData: () => {
        const state = get();
        return {
          collection: state.collection,
          decks: state.decks,
          gameStats: state.gameStats,
          factionProgress: state.factionProgress,
          weeklyVault: state.weeklyVault,
          dailyQuests: state.dailyQuests,
          cosmeticInventory: state.cosmeticInventory,
          settings: state.settings,
          achievements: state.achievements,
          currentSeason: state.currentSeason,
          lastSaved: new Date(),
          version: 1,
        };
      },

      importSaveData: (data) => {
        set({
          collection: data.collection,
          decks: data.decks,
          gameStats: data.gameStats,
          factionProgress: data.factionProgress,
          weeklyVault: data.weeklyVault,
          dailyQuests: data.dailyQuests,
          cosmeticInventory: data.cosmeticInventory,
          settings: data.settings,
          achievements: data.achievements,
          currentSeason: data.currentSeason,
        });
      },

      resetProgress: () => {
        set({
          collection: [],
          decks: [],
          gameStats: defaultGameStats,
          factionProgress: {},
          weeklyVault: defaultWeeklyVault,
          dailyQuests: [],
          achievements: [],
          currentSeason: null,
        });
      },
    }),
    {
      name: 'card-clash-game-store',
      version: 1,
    }
  )
);

// Selector hooks for performance
export const useCollection = () => useGameStore((state) => state.collection);
export const useDecks = () => useGameStore((state) => state.decks);
export const useGameStats = () => useGameStore((state) => state.gameStats);
export const useFactionProgress = () => useGameStore((state) => state.factionProgress);
export const useWeeklyVault = () => useGameStore((state) => state.weeklyVault);
export const useDailyQuests = () => useGameStore((state) => state.dailyQuests);
export const useSettings = () => useGameStore((state) => state.settings);
export const useAchievements = () => useGameStore((state) => state.achievements);