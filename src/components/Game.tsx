import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { GemPurchase } from './GemPurchase';
import { FirebaseAuth } from './FirebaseAuth';
import { FirebaseGemPurchase } from './FirebaseGemPurchase';
import { NewGameHeader } from './NewGameHeader';
import { MainMenu } from './MainMenu';
import { Collection } from './Collection';
import { DeckBuilder } from './DeckBuilder';
import { CardPackShop } from './CardPackShop';
import { Campaign } from './Campaign';
import { PvPArena } from './PvPArena';
import { Tutorial } from './Tutorial';
import { BattleSystem } from './BattleSystem';
import { EnhancedBattleSystem } from './EnhancedBattleSystem';
import { FactionRoadProgress } from './FactionRoadProgress';
import { WeeklyVaultDisplay } from './WeeklyVaultDisplay';
import { DailyQuestsPanel } from './DailyQuestsPanel';
import { ProgressionSystem, Faction } from '../engine/ProgressionSystem';
import { PathOfLegends } from './PathOfLegends';
import { EnhancedPathOfLegends } from './EnhancedPathOfLegends';
import { LegendsLab } from './LegendsLab';
import { Challenges } from './Challenges';
import { WildcardSystem } from './WildcardSystem';
import { PositionalBattleSystem } from './PositionalBattleSystem';
import { EventCenter } from './EventCenter';
import { Achievements } from './Achievements';
import { Leaderboards } from './Leaderboards';
import { AchievementNotification } from './AchievementNotification';
import { LoreCodex } from './LoreCodex';
import { ChampionMasterySystem } from './ChampionMasterySystem';
import { CinematicBattleSystem } from './CinematicBattleSystem';
import { DatabaseMarketplace } from './DatabaseMarketplace';
import { GemStore } from './GemStore';

import { NetworkStatusIndicator } from './NetworkStatusIndicator';
import { OnboardingFlow } from './OnboardingFlow';
import { LiveOpsAdminPanel } from './LiveOpsAdminPanel';
import { PlayerSupportSystem } from './PlayerSupportSystem';
import { ACHIEVEMENTS_DATABASE } from '@/data/achievements';

// Enhanced UI Components
import { BottomNavigation, useBottomNavigation } from './ui/bottom-navigation';
import { EnhancedNavigation } from './ui/enhanced-navigation';
import { ToastProvider } from './ui/toast-provider';
import { LoadingOverlay } from './ui/enhanced-loading';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingBag, 
  Swords, 
  Settings,
  Trophy,
  Star,
  Map,
  Target
} from 'lucide-react';

type GamePage = 
  | 'menu' 
  | 'tutorial'
  | 'collection' 
  | 'deck' 
  | 'shop' 
  | 'campaign' 
  | 'pvp' 
  | 'battle'
  | 'cinematic-battle'
  | 'tournament' 
  | 'wildcards'
  | 'events'
  | 'settings'
  | 'gem-purchase'
  | 'gem-store'
  | 'marketplace'
  | 'auth'
  | 'achievements'
  | 'leaderboards'
  | 'showcase'
  | 'path-of-legends'
  | 'legends-lab'
  | 'challenges'
  | 'onboarding'
  | 'liveops-admin'
  | 'support'
  | 'lore-codex'
  | 'champion-mastery';

export function Game() {
  const [currentPage, setCurrentPage] = useState<GamePage>('auth');
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorial-completed'));
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('onboarding-completed'));
  const [battleData, setBattleData] = useState<{ playerDeck: any[], enemyDeck: any[] } | null>(null);
  const [user, setUser] = useState<{ email: string; name: string; provider: string; uid: string } | null>(null);
  const [unlockedLore, setUnlockedLore] = useState<string[]>(['mystic_origins']); // Start with one unlocked
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [navigationHistory, setNavigationHistory] = useState<GamePage[]>(['menu']);
  
  // Enhanced navigation with bottom nav support
  const { activeTab, setActiveTab } = useBottomNavigation(currentPage);
  
  // Navigation handlers with loading states
  const navigateToPage = async (page: GamePage, withLoading = false, loadingMessage = '') => {
    if (withLoading) {
      setIsLoading(true);
      setLoadingText(loadingMessage);
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setNavigationHistory(prev => [...prev, page]);
    setCurrentPage(page);
    setActiveTab(page);
    
    if (withLoading) {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage);
      setActiveTab(previousPage);
    }
  };

  // Bottom navigation items
  const bottomNavItems = [
    {
      id: 'menu',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      onClick: () => navigateToPage('menu')
    },
    {
      id: 'collection',
      label: 'Cards',
      icon: <Users className="w-5 h-5" />,
      onClick: () => navigateToPage('collection', true, 'Loading collection...')
    },
    {
      id: 'deck',
      label: 'Decks',
      icon: <Package className="w-5 h-5" />,
      onClick: () => navigateToPage('deck', true, 'Loading deck builder...')
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: <ShoppingBag className="w-5 h-5" />,
      onClick: () => navigateToPage('shop')
    },
    {
      id: 'pvp',
      label: 'Battle',
      icon: <Swords className="w-5 h-5" />,
      onClick: () => navigateToPage('pvp', true, 'Finding opponents...'),
      badge: 3 // Example notification count
    }
  ];

  // Generate breadcrumbs based on current page
  const getBreadcrumbs = () => {
    const pageNames: Record<GamePage, string> = {
      'menu': 'Home',
      'collection': 'Collection', 
      'deck': 'Deck Builder',
      'shop': 'Card Packs',
      'pvp': 'PvP Arena',
      'path-of-legends': 'Path of Legends',
      'legends-lab': 'Legends Lab',
      'challenges': 'Challenges',
      'auth': 'Login',
      'tutorial': 'Tutorial',
      'campaign': 'Campaign',
      'battle': 'Battle',
      'cinematic-battle': 'Cinematic Battle',
      'tournament': 'Tournament',
      'wildcards': 'Wildcards',
      'events': 'Events',
      'settings': 'Settings',
      'gem-purchase': 'Gem Purchase',
      'gem-store': 'Gem Store',
      'marketplace': 'Marketplace',
      'achievements': 'Achievements',
      'leaderboards': 'Leaderboards',
      'showcase': 'Showcase',
      'onboarding': 'Onboarding',
      'liveops-admin': 'Admin Panel',
      'support': 'Support',
      'lore-codex': 'Lore Codex',
      'champion-mastery': 'Champion Mastery'
    };
    
    return [{ label: pageNames[currentPage] || 'Unknown' }];
  };
  const [championMasteries, setChampionMasteries] = useState([
    {
      championId: 'flame_mage_champion',
      level: 3,
      experience: 850,
      experienceToNext: 1000,
      gamesPlayed: 25,
      victories: 18,
      damageDealt: 15420,
      unitsKilled: 47,
      specialAchievements: ['flawless_victory'],
      unlockedCosmetics: ['silver_border'],
      title: 'Apprentice'
    },
    {
      championId: 'shadow_assassin_champion',
      level: 5,
      experience: 1200,
      experienceToNext: 1500,
      gamesPlayed: 42,
      victories: 31,
      damageDealt: 22100,
      unitsKilled: 89,
      specialAchievements: ['stealth_master', 'assassin_streak'],
      unlockedCosmetics: ['silver_border', 'victory_emote'],
      title: 'Adept'
    }
  ]);
  const gameState = useGameState();
  
  // Enhanced error handling
  useErrorHandler();

  const handleTutorialComplete = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const startBattle = (playerDeck: any[], enemyDeck: any[]) => {
    setBattleData({ playerDeck, enemyDeck });
    navigateToPage('battle', true, 'Preparing battle...');
  };

  const handleLogin = (userData: { email: string; name: string; provider: string; uid: string }) => {
    setUser(userData);
    
    // Check if user needs onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasCompletedOnboarding) {
      navigateToPage('onboarding');
      return;
    }
    
    // Check if user is new (no previous welcome pack)
    const hasReceivedWelcomePack = localStorage.getItem('welcome-pack-received');
    if (!hasReceivedWelcomePack) {
      // Give welcome pack to new user
      const welcomeCards = gameState.openWelcomePack();
      localStorage.setItem('welcome-pack-received', 'true');
      
      // Show welcome message
      setTimeout(() => {
        alert(`🎉 Welcome to Card Clash! You received ${welcomeCards.length} starter cards!`);
      }, 1000);
    }
    
    navigateToPage('menu', true, 'Loading game...');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'auth':
        return (
          <FirebaseAuth
            onLogin={handleLogin}
            onClose={() => setCurrentPage('menu')}
          />
        );

      case 'gem-purchase':
        return (
          <FirebaseGemPurchase
            onPurchaseGems={gameState.purchaseGems}
            onClose={() => setCurrentPage('menu')}
            userId={user?.uid}
          />
        );

      case 'gem-store':
        return (
          <GemStore
            onBack={() => setCurrentPage('menu')}
            userProfile={user}
            onGemsUpdated={() => {
              // Refresh user profile or gems balance
              console.log('Gems updated');
            }}
          />
        );

      case 'marketplace':
        return (
          <DatabaseMarketplace
            onBack={() => setCurrentPage('menu')}
            userProfile={user}
            collection={gameState.collection}
            gameStats={gameState.gameStats}
            onTradeCard={(cardId, price, currency) => {
              console.log('Trading card:', cardId, price, currency);
            }}
            onBuyCard={(card, price) => {
              console.log('Buying card:', card, price);
            }}
          />
        );

      case 'tutorial':
        return (
          <Tutorial
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        );

      case 'battle':
        return battleData ? (
          <BattleSystem
            playerDeck={battleData.playerDeck}
            enemyDeck={battleData.enemyDeck}
            onBattleComplete={(result) => {
              // Handle battle completion
              result.cardsEarned.forEach(card => gameState.addCardToCollection(card));
              gameState.addCoins(result.coinsEarned);
              result.survivingCards.forEach(card => {
                gameState.gainExperience(card.id, result.experienceGained);
              });
              setCurrentPage('campaign');
            }}
            onBack={() => setCurrentPage('campaign')}
          />
        ) : null;
      
      case 'cinematic-battle':
        return battleData ? (
          <CinematicBattleSystem
            playerDeck={battleData.playerDeck}
            opponentDeck={battleData.enemyDeck}
            onBattleEnd={(victory) => {
              // Enhanced battle completion with cinematic feedback
              if (victory) {
                // Unlock potential lore entries
                const newLoreUnlocks = ['flame_mage_legend']; // Based on victory conditions
                setUnlockedLore(prev => [...prev, ...newLoreUnlocks]);
                
                // Update champion mastery
                setChampionMasteries(prev => prev.map(mastery => ({
                  ...mastery,
                  experience: mastery.experience + 100,
                  victories: mastery.victories + 1,
                  gamesPlayed: mastery.gamesPlayed + 1
                })));
              }
              setCurrentPage('campaign');
            }}
          />
        ) : null;

      case 'collection':
        return (
          <Collection
            collection={gameState.collection}
            onBack={() => setCurrentPage('menu')}
          />
        );
      
      case 'deck':
        return (
          <DeckBuilder
            collection={gameState.collection}
            currentDeck={gameState.currentDeck}
            onBack={() => setCurrentPage('menu')}
            onAddCard={gameState.addCardToDeck}
            onRemoveCard={gameState.removeCardFromDeck}
          />
        );
      
      case 'shop':
        return (
          <CardPackShop
            gameStats={gameState.gameStats}
            onBack={() => setCurrentPage('menu')}
            onOpenPack={gameState.openCardPack}
            onSpendCoins={gameState.spendCoins}
            onSpendGems={gameState.spendGems}
          />
        );
      
      case 'campaign':
        return (
          <Campaign
            playerDeck={gameState.currentDeck}
            gameStats={gameState.gameStats}
            onBack={() => setCurrentPage('menu')}
            onStartBattle={startBattle}
            onBattleComplete={(result) => {
              // Handle battle completion
              result.cardsEarned.forEach(card => gameState.addCardToCollection(card));
              gameState.addCoins(result.coinsEarned);
              // Add experience to surviving cards
              result.survivingCards.forEach(card => {
                gameState.gainExperience(card.id, result.experienceGained);
              });
              // Update campaign progress
              gameState.updateCampaignProgress(gameState.gameStats.campaignProgress + 1);
            }}
          />
        );
      
      case 'pvp':
        return (
          <PvPArena
            playerDeck={gameState.currentDeck}
            gameStats={gameState.gameStats}
            onBack={() => setCurrentPage('menu')}
            onBattleComplete={(result) => {
              if (result.victory) {
                gameState.addCoins(result.coinsEarned);
              }
              result.survivingCards.forEach(card => {
                gameState.gainExperience(card.id, result.experienceGained);
              });
            }}
          />
        );
      
      case 'wildcards':
        return (
          <WildcardSystem
            onBack={() => setCurrentPage('menu')}
          />
        );
      
      case 'events':
        return (
          <EventCenter
            gameStats={gameState.gameStats}
            onBack={() => setCurrentPage('menu')}
            onJoinEvent={(eventId) => {
              console.log('Joining event:', eventId);
            }}
            onClaimReward={(eventId) => {
              console.log('Claiming reward:', eventId);
            }}
          />
        );
      
      case 'tournament':
        return (
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-2xl font-bold mb-4">🏆 Tournaments</h1>
            <p className="text-muted-foreground mb-4">Coming Soon!</p>
            <p className="text-sm text-muted-foreground">
              Compete in epic tournaments for exclusive rewards and glory.
            </p>
            <button 
              className="btn-lor-primary focus-lor"
              onClick={() => setCurrentPage('menu')}
            >
              Back to Menu
            </button>
          </div>
        );
      
      case 'settings':
        return (
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-2xl font-bold mb-4">⚙️ Settings</h1>
            <p className="text-muted-foreground mb-4">Game settings and preferences</p>
            <button 
              className="btn-lor-secondary focus-lor"
              onClick={() => setCurrentPage('menu')}
            >
              Back to Menu
            </button>
          </div>
        );
      
      case 'achievements':
        return (
          <Achievements
            onNavigate={(page: string) => setCurrentPage(page as GamePage)}
          />
        );
      
      case 'leaderboards':
        return (
          <Leaderboards
            onNavigate={(page: string) => setCurrentPage(page as GamePage)}
          />
        );
      
      case 'path-of-legends':
        return (
          <EnhancedPathOfLegends
            onBack={() => setCurrentPage('menu')}
            playerDeck={gameState.currentDeck.cards}
            userProfile={user}
            onStartBattle={(playerDeck, enemyDeck) => {
              setBattleData({ playerDeck: Array.isArray(playerDeck) ? playerDeck : [], enemyDeck });
              setCurrentPage('battle');
            }}
            onRewardClaimed={(reward) => {
              if (reward.type === 'gems') {
                gameState.addGems(reward.amount);
              } else if (reward.type === 'coins') {
                gameState.addCoins(reward.amount);
              }
            }}
          />
        );
      
      case 'legends-lab':
        return <LegendsLab 
          onBack={() => setCurrentPage('menu')} 
          onPlayMode={() => setCurrentPage('battle')} 
        />;
      
      case 'challenges':
        return <Challenges 
          onBack={() => setCurrentPage('menu')} 
          onStartChallenge={() => setCurrentPage('battle')} 
        />;
      
      case 'onboarding':
        return (
          <OnboardingFlow
            onComplete={() => {
              setShowOnboarding(false);
              setCurrentPage('menu');
            }}
          />
        );
      
      case 'liveops-admin':
        return (
          <LiveOpsAdminPanel
            onClose={() => setCurrentPage('menu')}
          />
        );
      
      case 'support':
        return (
          <PlayerSupportSystem
            onClose={() => setCurrentPage('menu')}
          />
        );
      
      case 'lore-codex':
        return (
          <LoreCodex
            onBack={() => setCurrentPage('menu')}
            unlockedLore={unlockedLore}
            onUnlockLore={(loreId) => {
              setUnlockedLore(prev => [...prev, loreId]);
            }}
          />
        );
      
      case 'champion-mastery':
        return (
          <ChampionMasterySystem
            onBack={() => setCurrentPage('menu')}
            playerMasteries={championMasteries}
            onEquipCosmetic={(championId, cosmeticId) => {
              console.log(`Equipped ${cosmeticId} on ${championId}`);
              // Handle cosmetic equipping
            }}
          />
        );
      
      case 'showcase':
        return (
          <div className="text-center p-8">
            <h1>Card Showcase Removed</h1>
            <p>This feature has been removed per requirements</p>
          </div>
        );
      
      default:
        return <MainMenu 
          onNavigate={(page) => {
            if (page === 'gem-purchase' || page === 'gem-store' || page === 'marketplace') {
              setCurrentPage(page as GamePage);
            } else {
              setCurrentPage(page as GamePage);
            }
          }} 
          user={user}
          onLogout={() => {
            setUser(null);
            setCurrentPage('auth');
          }}
        />;
    }
  };

  if (showTutorial) {
    return (
      <Tutorial
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    );
  }

  if (showOnboarding && user) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setShowOnboarding(false);
          setCurrentPage('menu');
        }}
      />
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background relative">
        {/* Enhanced Header with improved design */}
        <NewGameHeader />
        
        {/* Enhanced Navigation for non-menu pages */}
        {currentPage !== 'menu' && currentPage !== 'auth' && (
          <EnhancedNavigation
            onBack={navigationHistory.length > 1 ? goBack : undefined}
            title={getBreadcrumbs()[getBreadcrumbs().length - 1]?.label}
            breadcrumbs={getBreadcrumbs()}
            showBackButton={navigationHistory.length > 1}
          />
        )}
        
        {/* Main Content with Page Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={currentPage !== 'menu' && currentPage !== 'auth' ? 'pb-20 sm:pb-0' : ''}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
        
        {/* Enhanced Bottom Navigation for Mobile */}
        {currentPage !== 'auth' && currentPage !== 'onboarding' && (
          <BottomNavigation items={bottomNavItems} />
        )}
        
        {/* Loading Overlay */}
        <LoadingOverlay
          isLoading={isLoading}
          text={loadingText}
          variant="premium"
        />
        
        {/* Achievement Notifications */}
        {gameState.newAchievements.map((achievementId) => {
          const achievement = ACHIEVEMENTS_DATABASE.find(a => a.id === achievementId);
          return achievement ? (
            <AchievementNotification
              key={achievementId}
              achievement={{ ...achievement, unlocked: true }}
              onDismiss={() => gameState.dismissAchievement(achievementId)}
            />
          ) : null;
        })}
        
        {/* Network Status Indicator */}
        <NetworkStatusIndicator />
      </div>
    </ToastProvider>
  );
}