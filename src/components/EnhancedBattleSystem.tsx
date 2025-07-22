import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { GameEngine, GameState } from '../engine/GameEngine';
import { CardSystem, Faction } from '../engine/CardSystem';
import { Zap, Shield, Sword, Heart, Star } from 'lucide-react';

interface EnhancedBattleSystemProps {
  onBattleEnd: (victory: boolean) => void;
  playerDeck: any[];
  opponentDeck: any[];
}

export const EnhancedBattleSystem: React.FC<EnhancedBattleSystemProps> = ({
  onBattleEnd,
  playerDeck,
  opponentDeck
}) => {
  const [gameEngine] = useState(() => new GameEngine({
    currentPlayer: 'player',
    actionToken: 'player',
    turnPhase: 'action',
    roundNumber: 1,
    playerMana: 1,
    playerSpellMana: 0,
    opponentMana: 1,
    opponentSpellMana: 0,
    maxMana: 1,
    playerHand: ['flame_mage_champion', 'shadow_assassin_champion'],
    opponentHand: ['tree_guardian_champion'],
    playerBoard: [],
    opponentBoard: [],
    stack: [],
    playerChampions: [],
    opponentChampions: []
  }));

  const [cardSystem] = useState(() => new CardSystem());
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = gameEngine.subscribe(setGameState);
    return unsubscribe;
  }, [gameEngine]);

  const handleCardPlay = useCallback((cardId: string) => {
    const card = cardSystem.getCard(cardId);
    if (!card) return;

    const canPlay = cardSystem.canPlayCard(
      card, 
      gameState.playerMana, 
      gameState.playerSpellMana
    );

    if (canPlay) {
      gameEngine.playCard(cardId);
      setSelectedCard(null);
    }
  }, [cardSystem, gameState, gameEngine]);

  const handleEndTurn = useCallback(() => {
    gameEngine.startTurn();
  }, [gameEngine]);

  const handlePassPriority = useCallback(() => {
    gameEngine.passPriority();
  }, [gameEngine]);

  const getManaDisplay = () => {
    const { playerMana, playerSpellMana, maxMana } = gameState;
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-semibold">{playerMana}/{maxMana}</span>
        </div>
        {playerSpellMana > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="font-semibold text-purple-500">{playerSpellMana}</span>
          </div>
        )}
      </div>
    );
  };

  const renderCard = (cardId: string, isOpponent: boolean = false) => {
    const card = cardSystem.getCard(cardId);
    if (!card) return null;

    const canPlay = !isOpponent && cardSystem.canPlayCard(
      card, 
      gameState.playerMana, 
      gameState.playerSpellMana
    );

    return (
      <Card 
        key={cardId}
        className={`
          relative w-24 h-32 p-2 cursor-pointer transition-all duration-200
          ${selectedCard === cardId ? 'ring-2 ring-primary scale-105' : ''}
          ${canPlay ? 'hover:scale-105 hover:shadow-lg' : 'opacity-60'}
          ${isOpponent ? 'rotate-180' : ''}
        `}
        onClick={() => !isOpponent && setSelectedCard(cardId)}
        draggable={!isOpponent}
        onDragStart={(e: React.DragEvent) => {
          e.dataTransfer.setData("text/plain", cardId);
          setDraggedCard(cardId);
        }}
        onDragEnd={() => setDraggedCard(null)}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Cost */}
          <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
            {card.cost}
          </div>
          
          {/* Card Name */}
          <div className="text-xs font-semibold text-center mb-1 line-clamp-2">
            {card.name}
          </div>
          
          {/* Faction Badge */}
          <Badge variant="secondary" className="text-xs mb-1">
            {card.faction}
          </Badge>
          
          {/* Keywords */}
          {card.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.keywords.map(keyword => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Stats for units */}
          {card.attack !== undefined && card.health !== undefined && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Sword className="w-3 h-3" />
                <span className="text-xs font-bold">{card.attack}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span className="text-xs font-bold">{card.health}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderChampion = (champion: any, isOpponent: boolean = false) => {
    return (
      <Card className={`p-3 ${isOpponent ? 'rotate-180' : ''}`}>
        <div className="text-sm font-semibold mb-2">{champion.name}</div>
        <div className="text-xs mb-2">Level {champion.level}</div>
        <Progress 
          value={(champion.levelUpProgress / champion.levelUpTarget) * 100} 
          className="h-2 mb-2"
        />
        <div className="text-xs text-muted-foreground">
          {champion.levelUpCondition}
        </div>
      </Card>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 via-purple-900 to-blue-900">
      {/* Opponent Area */}
      <div className="flex-1 p-4 border-b border-white/20">
        {/* Opponent Hand */}
        <div className="flex justify-center gap-2 mb-4">
          {gameState.opponentHand.map((cardId, index) => (
            <Card key={index} className="w-16 h-24 bg-gradient-to-b from-red-900 to-red-700 rotate-180" />
          ))}
        </div>
        
        {/* Opponent Board */}
        <div className="flex justify-center gap-2 mb-4 min-h-[100px]">
          {gameState.opponentBoard.map(boardCard => renderCard(boardCard.cardId, true))}
        </div>
        
        {/* Opponent Champions */}
        <div className="flex justify-center gap-2">
          {gameState.opponentChampions.map(champion => renderChampion(champion, true))}
        </div>
      </div>

      {/* Center Area - Game State Display */}
      <div className="py-4 px-6 bg-black/30 border-y border-white/20">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <div className="text-sm opacity-80">Round {gameState.roundNumber}</div>
            <div className="text-lg font-semibold">
              {gameState.actionToken === 'player' ? 'Your Turn' : 'Opponent\'s Turn'}
            </div>
            <div className="text-sm opacity-80">Phase: {gameState.turnPhase}</div>
          </div>
          
          {getManaDisplay()}
          
          <div className="flex gap-2">
            {gameState.stack.length > 0 && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handlePassPriority}
              >
                Pass Priority ({gameState.stack.length})
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEndTurn}
              disabled={gameState.actionToken !== 'player'}
            >
              End Turn
            </Button>
          </div>
        </div>
        
        {/* Stack Display */}
        {gameState.stack.length > 0 && (
          <div className="mt-2 p-2 bg-white/10 rounded">
            <div className="text-xs text-white/80 mb-1">Actions on Stack:</div>
            <div className="flex gap-1">
              {gameState.stack.map((action, index) => (
                <Badge key={action.id} variant="secondary" className="text-xs">
                  {action.type} #{index + 1}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Player Area */}
      <div className="flex-1 p-4">
        {/* Player Champions */}
        <div className="flex justify-center gap-2 mb-4">
          {gameState.playerChampions.map(champion => renderChampion(champion))}
        </div>
        
        {/* Player Board */}
        <div 
          className="flex justify-center gap-2 mb-4 min-h-[100px] border-2 border-dashed border-white/30 rounded-lg p-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedCard) {
              handleCardPlay(draggedCard);
            }
          }}
        >
          {gameState.playerBoard.map(boardCard => renderCard(boardCard.cardId))}
          {gameState.playerBoard.length === 0 && (
            <div className="flex items-center justify-center text-white/50 text-sm">
              Drag cards here to play them
            </div>
          )}
        </div>
        
        {/* Player Hand */}
        <div className="flex justify-center gap-2">
          {gameState.playerHand.map(cardId => renderCard(cardId))}
        </div>
      </div>

      {/* Selected Card Actions */}
      {selectedCard && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur p-3 rounded-lg border border-white/20">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleCardPlay(selectedCard)}
              disabled={!cardSystem.canPlayCard(
                cardSystem.getCard(selectedCard)!, 
                gameState.playerMana, 
                gameState.playerSpellMana
              )}
            >
              Play Card
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSelectedCard(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};