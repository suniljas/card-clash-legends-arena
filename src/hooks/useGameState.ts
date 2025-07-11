import { useState, useEffect, useCallback } from 'react';
import { HeroCard, PlayerDeck, GameStats, Rarity } from '@/types/game';
import { HERO_DATABASE } from '@/data/heroes';
import { cloudSaveService, CloudSaveData } from '@/services/cloudSave';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const STORAGE_KEYS = {
  COLLECTION: 'card-clash-collection',
  DECK: 'card-clash-deck',
  STATS: 'card-clash-stats'
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

  // Calculate max deck size based on campaign progress
  const getMaxDeckSize = (campaignLevel: number): number => {
    return Math.min(3 + Math.floor((campaignLevel - 1) / 5), 8);
  };

  // Load local data initially, then sync with cloud when auth changes
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
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, collection, currentDeck, gameStats]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load local data on mount
  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  // Sync with cloud when user logs in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      syncWithCloud();
    }
  }, [isAuthenticated, isLoading, syncWithCloud]);

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
        }
      }, 1000); // Debounce cloud saves

      return () => clearTimeout(timeoutId);
    }
  }, [collection, currentDeck, gameStats, isAuthenticated, isSyncing, isLoading]);

  const addCardToCollection = (card: HeroCard) => {
    const newCard = { ...card, id: `${card.id}-${Date.now()}-${Math.random()}` };
    setCollection(prev => [...prev, newCard]);
    setGameStats(prev => ({ ...prev, totalCards: prev.totalCards + 1 }));
  };

  const addCardToDeck = (card: HeroCard): boolean => {
    if (currentDeck.cards.length >= currentDeck.maxSize) return false;
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
          experienceToNext: Math.floor(card.experienceToNext * 1.5)
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

  const updateCampaignProgress = (level: number) => {
    setGameStats(prev => ({ ...prev, campaignProgress: Math.max(prev.campaignProgress, level) }));
  };

  const openCardPack = (): HeroCard[] => {
    try {
      const packCards: HeroCard[] = [];
      const numCards = 5; // 5 cards per pack

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
          addCardToCollection(newCard);
        }
      }

      return packCards;
    } catch (error) {
      console.error('Error opening card pack:', error);
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

  return {
    collection,
    currentDeck,
    gameStats,
    isAuthenticated,
    isLoading,
    isSyncing,
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
    purchaseGems,
    updateCampaignProgress,
    getMaxDeckSize,
    syncWithCloud
  };
}