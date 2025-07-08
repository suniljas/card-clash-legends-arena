import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameHeader } from './GameHeader';
import { MainMenu } from './MainMenu';
import { Collection } from './Collection';
import { DeckBuilder } from './DeckBuilder';
import { CardPackShop } from './CardPackShop';
import { Campaign } from './Campaign';
import { PvPArena } from './PvPArena';

type GamePage = 
  | 'menu' 
  | 'collection' 
  | 'deck' 
  | 'shop' 
  | 'campaign' 
  | 'pvp' 
  | 'tournament' 
  | 'settings';

export function Game() {
  const [currentPage, setCurrentPage] = useState<GamePage>('menu');
  const gameState = useGameState();

  const renderCurrentPage = () => {
    switch (currentPage) {
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
            onBattleComplete={(result) => {
              // Handle battle completion
              result.cardsEarned.forEach(card => gameState.addCardToCollection(card));
              gameState.addCoins(result.coinsEarned);
              // Add experience to surviving cards
              result.survivingCards.forEach(card => {
                gameState.gainExperience(card.id, result.experienceGained);
              });
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
      
      default:
        return <MainMenu onNavigate={(page) => setCurrentPage(page as GamePage)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader stats={gameState.gameStats} />
      {renderCurrentPage()}
    </div>
  );
}