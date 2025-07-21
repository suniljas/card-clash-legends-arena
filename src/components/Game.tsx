import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { HeroCard as HeroCardType, BattleResult } from '@/types/game';
import { MainMenu } from './MainMenu';
import { EnhancedCollectionManager } from './EnhancedCollectionManager';
import { DeckBuilder } from './DeckBuilder';
import { Campaign } from './Campaign';
import { PvPArena } from './PvPArena';
import { CardPackShop } from './CardPackShop';
import { GemPurchase } from './GemPurchase';
import { FirebaseGemPurchase } from './FirebaseGemPurchase';
import { EventCenter } from './EventCenter';
import { Marketplace } from './Marketplace';
import { BattleSystem } from './BattleSystem';
import { Tutorial } from './Tutorial';
import { FirebaseAuth } from './FirebaseAuth';
import { AuthLogin } from './AuthLogin';
import { GameHeader } from './GameHeader';
import { EnhancedPerformanceSystem } from './EnhancedPerformanceSystem';
import { EnhancedNotificationSystem, SAMPLE_NOTIFICATIONS } from './EnhancedNotificationSystem';
import { InteractiveTutorial } from './InteractiveTutorial';
import { PerformanceMonitor } from './PerformanceMonitor';
import { ErrorBoundary } from './ErrorBoundary';
import { useToast } from '@/hooks/use-toast';

type GamePage = 
  | 'menu' 
  | 'collection' 
  | 'deck' 
  | 'campaign' 
  | 'pvp' 
  | 'shop' 
  | 'gem-purchase'
  | 'events' 
  | 'marketplace' 
  | 'battle'
  | 'tutorial'
  | 'auth';

interface User {
  email: string;
  name: string;
  provider: string;
  uid?: string;
}

export function Game() {
  const [currentPage, setCurrentPage] = useState<GamePage>('menu');
  const [user, setUser] = useState<User | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [battleData, setBattleData] = useState<{
    playerDeck: HeroCardType[];
    enemyDeck: HeroCardType[];
  } | null>(null);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const {
    collection,
    currentDeck,
    gameStats,
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
    updateCampaignProgress
  } = useGameState();

  const { reportError } = useErrorHandler();
  const { toast } = useToast();

  // Check if user is new and should see tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('card-clash-tutorial-completed');
    if (!hasSeenTutorial && !user) {
      setShowTutorial(true);
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('menu');
    toast({
      title: "Welcome back!",
      description: `Logged in as ${userData.name}`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('auth');
    toast({
      title: "Logged out",
      description: "See you next time, Champion!",
    });
  };

  const handleBattleComplete = (result: BattleResult) => {
    // Award experience and coins
    addCoins(result.coinsEarned);
    
    // Add any earned cards to collection
    result.cardsEarned.forEach(card => {
      addCardToCollection(card);
    });

    // Award experience to surviving cards
    result.survivingCards.forEach(card => {
      gainExperience(card.id, result.experienceGained);
    });

    // Update campaign progress if it was a campaign battle
    if (currentPage === 'campaign') {
      updateCampaignProgress(gameStats.campaignProgress + 1);
    }

    // Show battle result notification
    const notification = {
      id: `battle-result-${Date.now()}`,
      type: 'reward' as const,
      title: result.victory ? '🏆 Victory!' : '💀 Defeat',
      description: result.victory 
        ? `Excellent work! You earned ${result.coinsEarned} coins and ${result.experienceGained} XP.`
        : `Better luck next time. You still earned ${result.coinsEarned} coins for trying.`,
      rewards: {
        coins: result.coinsEarned,
        cards: result.cardsEarned.length
      },
      icon: result.victory ? '🏆' : '💀',
      priority: 'high' as const,
      timestamp: new Date(),
      autoShow: true
    };

    setNotifications(prev => [notification, ...prev]);
    setBattleData(null);
    setCurrentPage('menu');
  };

  const handleStartBattle = (playerDeck: HeroCardType[], enemyDeck: HeroCardType[]) => {
    setBattleData({ playerDeck, enemyDeck });
    setCurrentPage('battle');
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('card-clash-tutorial-completed', 'true');
    setShowTutorial(false);
    if (!user) {
      setCurrentPage('auth');
    }
  };

  const handleTutorialSkip = () => {
    localStorage.setItem('card-clash-tutorial-completed', 'true');
    setShowTutorial(false);
    if (!user) {
      setCurrentPage('auth');
    }
  };

  const handleClaimReward = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.rewards) {
      if (notification.rewards.coins) {
        addCoins(notification.rewards.coins);
      }
      if (notification.rewards.gems) {
        addGems(notification.rewards.gems);
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, claimed: true } : n)
      );

      toast({
        title: "Reward Claimed!",
        description: "Your rewards have been added to your account.",
      });
    }
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, claimed: true } : n)
    );
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Card Clash Legends!',
      description: 'Let\'s learn the basics of this strategic card battle game.',
      target: '.main-menu',
      position: 'center' as const,
      action: 'view' as const
    },
    {
      id: 'collection',
      title: 'Your Hero Collection',
      description: 'This is where you manage all your collected heroes.',
      target: '[data-menu-item="collection"]',
      position: 'bottom' as const,
      action: 'click' as const
    },
    {
      id: 'deck-builder',
      title: 'Build Your Deck',
      description: 'Create powerful combinations of heroes for battle.',
      target: '[data-menu-item="deck"]',
      position: 'bottom' as const,
      action: 'click' as const
    },
    {
      id: 'battle',
      title: 'Enter Combat',
      description: 'Test your strategies in epic battles!',
      target: '[data-menu-item="campaign"]',
      position: 'bottom' as const,
      action: 'click' as const
    }
  ];

  if (showTutorial) {
    return (
      <ErrorBoundary>
        <Tutorial onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
        <InteractiveTutorial
          steps={tutorialSteps}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
          isActive={showTutorial}
        />
      </ErrorBoundary>
    );
  }

  if (!user && currentPage !== 'auth') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <FirebaseAuth onLogin={handleLogin} onClose={() => setCurrentPage('menu')} />
        </div>
        <PerformanceMonitor />
        <EnhancedPerformanceSystem />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Game Header */}
        {currentPage !== 'auth' && currentPage !== 'tutorial' && (
          <div className="relative">
            <GameHeader stats={gameStats} />
            <div className="absolute top-4 right-4 z-50">
              <EnhancedNotificationSystem
                notifications={notifications}
                onClaimReward={handleClaimReward}
                onDismiss={handleDismissNotification}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="relative">
          {currentPage === 'auth' && (
            <FirebaseAuth onLogin={handleLogin} onClose={() => setCurrentPage('menu')} />
          )}

          {currentPage === 'menu' && (
            <MainMenu 
              onNavigate={setCurrentPage}
              user={user}
              onLogout={handleLogout}
              gameStats={gameStats}
            />
          )}

          {currentPage === 'collection' && (
            <EnhancedCollectionManager
              collection={collection}
              onBack={() => setCurrentPage('menu')}
              mode="collection"
            />
          )}

          {currentPage === 'deck' && (
            <DeckBuilder
              collection={collection}
              currentDeck={currentDeck}
              onBack={() => setCurrentPage('menu')}
              onAddCard={addCardToDeck}
              onRemoveCard={removeCardFromDeck}
            />
          )}

          {currentPage === 'campaign' && (
            <Campaign
              playerDeck={currentDeck}
              gameStats={gameStats}
              onBack={() => setCurrentPage('menu')}
              onBattleComplete={handleBattleComplete}
              onStartBattle={handleStartBattle}
            />
          )}

          {currentPage === 'pvp' && (
            <PvPArena
              playerDeck={currentDeck}
              gameStats={gameStats}
              onBack={() => setCurrentPage('menu')}
              onBattleComplete={handleBattleComplete}
            />
          )}

          {currentPage === 'shop' && (
            <CardPackShop
              gameStats={gameStats}
              onBack={() => setCurrentPage('menu')}
              onOpenPack={openCardPack}
              onSpendCoins={spendCoins}
              onSpendGems={spendGems}
            />
          )}

          {currentPage === 'gem-purchase' && (
            user?.uid ? (
              <FirebaseGemPurchase
                onPurchaseGems={purchaseGems}
                onClose={() => setCurrentPage('menu')}
                userId={user.uid}
              />
            ) : (
              <GemPurchase
                onPurchaseGems={purchaseGems}
                onClose={() => setCurrentPage('menu')}
              />
            )
          )}

          {currentPage === 'events' && (
            <EventCenter
              gameStats={gameStats}
              onBack={() => setCurrentPage('menu')}
              onJoinEvent={(eventId) => {
                toast({
                  title: "Event Joined!",
                  description: "You've successfully joined the event.",
                });
              }}
              onClaimReward={(eventId) => {
                addCoins(500);
                toast({
                  title: "Reward Claimed!",
                  description: "You received 500 coins!",
                });
              }}
            />
          )}

          {currentPage === 'marketplace' && (
            <Marketplace
              collection={collection}
              gameStats={gameStats}
              onBack={() => setCurrentPage('menu')}
              onTradeCard={(cardId, price, currency) => {
                toast({
                  title: "Card Listed!",
                  description: `Your card has been listed for ${price} ${currency}`,
                });
              }}
              onBuyCard={(listing) => {
                if (listing.currency === 'coins') {
                  spendCoins(listing.price);
                } else {
                  spendGems(listing.price);
                }
                addCardToCollection(listing.card);
                toast({
                  title: "Purchase Complete!",
                  description: `You bought ${listing.card.name}!`,
                });
              }}
            />
          )}

          {currentPage === 'battle' && battleData && (
            <BattleSystem
              playerDeck={battleData.playerDeck}
              enemyDeck={battleData.enemyDeck}
              onBattleComplete={handleBattleComplete}
              onBack={() => {
                setBattleData(null);
                setCurrentPage('menu');
              }}
            />
          )}

          {currentPage === 'tutorial' && (
            <Tutorial onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
          )}
        </main>

        {/* Performance Monitoring */}
        <PerformanceMonitor />
        <EnhancedPerformanceSystem />
      </div>
    </ErrorBoundary>
  );
}