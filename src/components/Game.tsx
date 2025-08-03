import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { GemPurchase } from './GemPurchase';
import { FirebaseAuth } from './FirebaseAuth';
import { FirebaseGemPurchase } from './FirebaseGemPurchase';
import { NewGameHeader } from './NewGameHeader';
import { MainMenu } from './OptimizedMainMenu';
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
    setCurrentPage('battle');
  };

  const handleLogin = (userData: { email: string; name: string; provider: string; uid: string }) => {
    setUser(userData);
    
    // Check if user needs onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasCompletedOnboarding) {
      setCurrentPage('onboarding');
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
    
    setCurrentPage('menu');
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
    <div className="min-h-screen bg-background">
      <NewGameHeader />
      {renderCurrentPage()}
      
      
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
    </div>
  );
}