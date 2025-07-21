import { useState, useEffect, useCallback } from 'react';
import { HeroCard, PlayerDeck, GameStats, Rarity, Settings } from '@/types/game';
import { HERO_DATABASE } from '@/data/heroes';
import { cloudSaveService, CloudSaveData } from '@/services/cloudSave';
import { achievementsService } from '@/services/achievements';
import { LeaderboardCategory } from '@/types/achievements';
import { auth } from '@/config/firebase'; // Ensure 'auth' is correctly imported and initialized Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';
import { analyticsService } from '@/services/analytics';
import { crashReportingService } from '@/services/crashReporting';
import { pushNotificationService } from '@/services/pushNotifications';

const STORAGE_KEYS = {
  COLLECTION: 'card-clash-collection',
  DECK: 'card-clash-deck',
  STATS: 'card-clash-stats'
};

const DEFAULT_SETTINGS: Settings = {
  musicVolume: 0.7,
  soundVolume: 0.7,
  haptics: true,
  language: 'en',
  accountProvider: 'none',
  isMusicMuted: false,
  isSoundMuted: false,
};

export function useGameState() {
  const [collection, setCollection] = useState<HeroCard[]>([]);
  const [currentDeck, setCurrentDeck] = useState<PlayerDeck>({ cards: [], maxSize: 3 });
  const [gameStats, setGameStats] = useState<GameStats>({
    totalCards: 0,
    totalBattles: 0,
    campaignProgress: 1,
    pvpWins: 0,
    pvpLosses: 0,
    coins: 1000,
    gems: 50
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate max deck size based on campaign progress
  const getMaxDeckSize = (campaignLevel: number): number => {
    return Math.min(3 + Math.floor((campaignLevel - 1) / 5), 8);
  };

  // Load local data initially
  const loadLocalData = useCallback(() => {
    try {
      const savedCollection = localStorage.getItem(STORAGE_KEYS.COLLECTION);
      const savedDeck = localStorage.getItem(STORAGE_KEYS.DECK);
      const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);

      if (savedCollection) {
        const parsedCollection = JSON.parse(savedCollection);
        setCollection(parsedCollection);
      } else {
        // Initialize with starter cards
        const starterCards = HERO_DATABASE
          .filter(hero => hero.unlocked)
          .map(hero => ({ ...hero, id: `${hero.id}-${Date.now()}` }));
        setCollection(starterCards);
      }

      if (savedDeck) {
        const parsedDeck = JSON.parse(savedDeck);
        setCurrentDeck(parsedDeck);
      }

      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        setGameStats(parsedStats);
      }
    } catch (error) {
      console.error('Error loading game state from localStorage:', error);
      // Reset to initial state if localStorage is corrupted
      const starterCards = HERO_DATABASE
        .filter(hero => hero.unlocked)
        .map(hero => ({ ...hero, id: `${hero.id}-${Date.now()}` }));
      setCollection(starterCards);
    }
  }, []);

  // Sync with cloud save when user authenticates
  const syncWithCloud = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsSyncing(true);
    try {
      const cloudData = await cloudSaveService.loadFromCloud();

      if (cloudData) {
        // Merge local and cloud data
        const localData = { collection, currentDeck, gameStats };
        const mergedData = cloudSaveService.mergeLocalAndCloudData(localData, cloudData);

        setCollection(mergedData.collection);
        setCurrentDeck(mergedData.currentDeck);
        setGameStats(mergedData.gameStats);

        // Save merged data back to cloud
        await cloudSaveService.saveToCloud({
          collection: mergedData.collection,
          currentDeck: mergedData.currentDeck,
          gameStats: mergedData.gameStats
        });
      } else {
        // No cloud data exists, save current local data to cloud
        await cloudSaveService.saveToCloud({ collection, currentDeck, gameStats });
      }
    } catch (error) {
      console.error('Error syncing with cloud:', error);
      crashReportingService.logError(error as Error, 'CloudSyncError');
    } finally { // <--- Added finally block here
      setIsSyncing(false);
    }
  }, [collection, currentDeck, gameStats, isAuthenticated]); // Added dependencies to useCallback

  // Handle Firebase authentication state changes
  useEffect(() => {
    if (!auth) {
      // Firebase not initialized, set demo mode
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);

      if (user) {
        // Set up analytics and crash reporting
        analyticsService.setUserId(user.uid);
        analyticsService.setUserProperties({
          level: gameStats.campaignProgress,
          total_cards: gameStats.totalCards,
          vip_status: gameStats.gems > 1000 // Example property
        });
        crashReportingService.setUserId(user.uid);

        // Set up push notifications
        try {
          await pushNotificationService.subscribe(user.uid);
        } catch (error) {
          console.error('Error subscribing to push notifications:', error);
          crashReportingService.logError(error as Error, 'PushNotificationSubscribeError');
        }
      }

      setIsLoading(false); // Set loading to false once auth state is determined
    });

    return () => {
      unsubscribe();
      // Optionally clean up analytics/crash reporting user ID on unmount if needed
      // analyticsService.setUserId(null); 
      // crashReportingService.setUserId(null);
    };
  }, [gameStats]); // gameStats is a dependency because analyticsService.setUserProperties uses it

  // Load local data on mount
  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  // Sync with cloud when isAuthenticated becomes true and not already syncing/loading
  useEffect(() => {
    if (isAuthenticated && !isLoading) { // isLoading check prevents sync before auth state is known
      syncWithCloud();
    }
  }, [isAuthenticated, isLoading, syncWithCloud]); // Added isLoading as dependency

  // Update deck max size when campaign progress changes
  useEffect(() => {
    const newMaxSize = getMaxDeckSize(gameStats.campaignProgress);
    if (newMaxSize !== currentDeck.maxSize) {
      setCurrentDeck(prev => ({ ...prev, maxSize: newMaxSize }));
    }
  }, [gameStats.campaignProgress]);

  // Save to localStorage when state changes (for offline support)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DECK, JSON.stringify(currentDeck));
  }, [currentDeck]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(gameStats));
  }, [gameStats]);

  // Save to cloud when authenticated and state changes
  useEffect(() => {
    if (isAuthenticated && !isSyncing && !isLoading) {
      const timeoutId = setTimeout(async () => {
        try {
          await cloudSaveService.saveToCloud({ collection, currentDeck, gameStats });
        } catch (error) {
          console.error('Error saving to cloud:', error);
          crashReportingService.logError(error as Error, 'CloudSaveError');
        }
      }, 1000); // Debounce cloud saves

      return () => clearTimeout(timeoutId);
    }
  }, [collection, currentDeck, gameStats, isAuthenticated, isSyncing, isLoading]);

  const addCardToCollection = async (card: HeroCard) => {
    const newCard = { ...card, id: `${card.id}-${Date.now()}-${Math.random()}` };
    setCollection(prev => [...prev, newCard]);
    setGameStats(prev => ({ ...prev, totalCards: prev.totalCards + 1 }));

    // Track analytics
    analyticsService.trackCardPurchase(card.rarity, 0, 'earned');

    // Check for achievements
    await checkAchievements();
  };

  const addCardToDeck = (card: HeroCard): boolean => {
    if (currentDeck.cards.length >= currentDeck.maxSize) return false;
    // Check if card with the same unique ID is already in the deck
    if (currentDeck.cards.find(c => c.id === card.id)) return false;

    setCurrentDeck(prev => ({
      ...prev,
      cards: [...prev.cards, card]
    }));
    return true;
  };

  const removeCardFromDeck = (cardId: string) => {
    setCurrentDeck(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== cardId)
    }));
  };

  const levelUpCard = (cardId: string) => {
    setCollection(prev => prev.map(card => {
      if (card.id === cardId && card.experience >= card.experienceToNext) {
        const newLevel = card.level + 1;
        return {
          ...card,
          level: newLevel,
          experience: card.experience - card.experienceToNext,
          experienceToNext: Math.floor(card.experienceToNext * 1.5) // Example progression
        };
      }
      return card;
    }));
  };

  const gainExperience = (cardId: string, exp: number) => {
    setCollection(prev => prev.map(card => {
      if (card.id === cardId) {
        const newExp = card.experience + exp;
        return { ...card, experience: newExp };
      }
      return card;
    }));
  };

  const addCoins = (amount: number) => {
    setGameStats(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const spendCoins = (amount: number): boolean => {
    if (gameStats.coins < amount) return false;
    setGameStats(prev => ({ ...prev, coins: prev.coins - amount }));
    return true;
  };

  const addGems = (amount: number) => {
    setGameStats(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const spendGems = (amount: number): boolean => {
    if (gameStats.gems < amount) return false;
    setGameStats(prev => ({ ...prev, gems: prev.gems - amount }));
    return true;
  };

  const purchaseGems = (amount: number) => {
    setGameStats(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const updateCampaignProgress = async (level: number) => {
    setGameStats(prev => ({ ...prev, campaignProgress: Math.max(prev.campaignProgress, level) }));
    await updateLeaderboards();
    await checkAchievements();
  };

  const openCardPack = (): HeroCard[] => {
    try {
      const packCards: HeroCard[] = [];
      const numCards = 2; // 2 cards per pack

      for (let i = 0; i < numCards; i++) {
        const randomRarity = getRandomRarity();
        const availableCards = HERO_DATABASE.filter(card => card.rarity === randomRarity);

        if (availableCards.length === 0) {
          console.warn(`No cards available for rarity: ${randomRarity}`);
          continue;
        }

        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

        if (randomCard) {
          const newCard = {
            ...randomCard,
            id: `${randomCard.id}-${Date.now()}-${i}`,
            unlocked: true
          };
          packCards.push(newCard);
          addCardToCollection(newCard); // Add to collection immediately
        }
      }

      return packCards;
    } catch (error) {
      console.error('Error opening card pack:', error);
      crashReportingService.logError(error as Error, 'OpenCardPackError');
      return [];
    }
  };

  const openWelcomePack = (): HeroCard[] => {
    try {
      const packCards: HeroCard[] = [];

      // Welcome pack: 1 guaranteed rare + 1 random common/uncommon
      const rarities = [Rarity.RARE, Rarity.COMMON]; // Adjusted for a common or uncommon for the second card

      for (let i = 0; i < 2; i++) {
        let targetRarity = rarities[i];
        if (i === 1) { // For the second card, make it truly random common/uncommon
            const rand = Math.random();
            targetRarity = rand < 0.5 ? Rarity.COMMON : Rarity.UNCOMMON;
        }

        const availableCards = HERO_DATABASE.filter(card => card.rarity === targetRarity);

        if (availableCards.length === 0) {
          console.warn(`No cards available for rarity: ${targetRarity}`);
          continue;
        }

        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

        if (randomCard) {
          const newCard = {
            ...randomCard,
            id: `${randomCard.id}-${Date.now()}-welcome-${i}`,
            unlocked: true
          };
          packCards.push(newCard);
          addCardToCollection(newCard); // Add to collection immediately
        }
      }

      return packCards;
    } catch (error) {
      console.error('Error opening welcome pack:', error);
      crashReportingService.logError(error as Error, 'OpenWelcomePackError');
      return [];
    }
  };


  const getRandomRarity = (): Rarity => {
    const rand = Math.random();
    if (rand < 0.5) return Rarity.COMMON;
    if (rand < 0.8) return Rarity.UNCOMMON;
    if (rand < 0.9) return Rarity.RARE;
    if (rand < 0.97) return Rarity.EPIC;
    if (rand < 0.99) return Rarity.LEGEND;
    return Rarity.ULTRA_LEGEND;
  };

  const checkAchievements = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const newlyUnlocked = await achievementsService.checkAchievements(gameStats, collection);
      if (newlyUnlocked.length > 0) {
        setNewAchievements(prev => [...prev, ...newlyUnlocked]);
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      crashReportingService.logError(error as Error, 'AchievementCheckError');
    }
  }, [gameStats, collection, isAuthenticated]); // Added dependencies

  const updateLeaderboards = useCallback(async () => {
    if (!isAuthenticated || !auth.currentUser) return; // Added check for auth.currentUser

    try {
      const username = auth.currentUser.displayName || 'Anonymous';

      await Promise.all([
        achievementsService.updateLeaderboard(LeaderboardCategory.PVP_WINS, gameStats.pvpWins, username),
        achievementsService.updateLeaderboard(LeaderboardCategory.CAMPAIGN_PROGRESS, gameStats.campaignProgress, username),
        achievementsService.updateLeaderboard(LeaderboardCategory.COLLECTION_SIZE, collection.length, username),
        achievementsService.updateLeaderboard(LeaderboardCategory.TOTAL_BATTLES, gameStats.totalBattles, username),
        achievementsService.updateLeaderboard(LeaderboardCategory.GEMS_EARNED, gameStats.gems, username)
      ]);
    } catch (error) {
      console.error('Error updating leaderboards:', error);
      crashReportingService.logError(error as Error, 'LeaderboardUpdateError');
    }
  }, [gameStats, collection, isAuthenticated]); // Added dependencies

  const dismissAchievement = (achievementId: string) => {
    setNewAchievements(prev => prev.filter(id => id !== achievementId));
  };

  return {
    collection,
    currentDeck,
    gameStats,
    isAuthenticated,
    isLoading,
    isSyncing,
    newAchievements,
    addCardToCollection,
    addCardToDeck,
    removeCardFromDeck,
    levelUpCard,
    gainExperience,
    addCoins,
    spendCoins,
    addGems,
    spendGems,
    openCardPack,
    openWelcomePack,
    purchaseGems,
    updateCampaignProgress,
    getMaxDeckSize,
    syncWithCloud,
    dismissAchievement,
    settings,
    updateSettings,
  };
}