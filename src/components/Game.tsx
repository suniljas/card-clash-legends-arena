import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { GemPurchase } from './GemPurchase';
import { FirebaseAuth } from './FirebaseAuth';
import { FirebaseGemPurchase } from './FirebaseGemPurchase';
import { GameHeader } from './GameHeader';
import { MainMenu } from './MainMenu';
import { Collection } from './Collection';
import { DeckBuilder } from './DeckBuilder';
import { CardPackShop } from './CardPackShop';
import { Campaign } from './Campaign';
import { PvPArena } from './PvPArena';
import { Tutorial } from './Tutorial';
import { BattleSystem } from './BattleSystem';
import { Marketplace } from './Marketplace';
import { EventCenter } from './EventCenter';
import { Achievements } from './Achievements';
import { Leaderboards } from './Leaderboards';
import { AchievementNotification } from './AchievementNotification';
import { PerformanceMonitor } from './PerformanceMonitor';
import { NetworkStatusIndicator } from './NetworkStatusIndicator';
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
  | 'tournament' 
  | 'marketplace'
  | 'events'
  | 'settings'
  | 'gem-purchase'
  | 'auth'
  | 'achievements'
  | 'leaderboards';

export function Game() {
  const [currentPage, setCurrentPage] = useState<GamePage>('auth');
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorial-completed'));
  const [battleData, setBattleData] = useState<{ playerDeck: any[], enemyDeck: any[] } | null>(null);
  const [user, setUser] = useState<{ email: string; name: string; provider: string; uid: string } | null>(null);
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
      
      case 'marketplace':
        return (
          <Marketplace
            collection={gameState.collection}
            gameStats={gameState.gameStats}
            onBack={() => setCurrentPage('menu')}
            onTradeCard={(cardId, price, currency) => {
              // Handle card trading logic
              console.log('Trading card:', cardId, price, currency);
            }}
            onBuyCard={(listing) => {
              // Handle card purchase logic
              console.log('Buying card:', listing);
            }}
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
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
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
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
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
      
      default:
        return <MainMenu 
          onNavigate={(page) => {
            if (page === 'gem-purchase') {
              setCurrentPage('gem-purchase');
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

  return (
    <div className="min-h-screen bg-background">
      <GameHeader 
        stats={gameState.gameStats} 
        isAuthenticated={gameState.isAuthenticated}
        isSyncing={gameState.isSyncing}
      />
      {renderCurrentPage()}
      <PerformanceMonitor />
      
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