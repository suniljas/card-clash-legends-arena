import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HeroCard as HeroCardType, BattleResult } from '@/types/game';
import { HeroCard } from './HeroCard';
import { Sword, Shield, Heart, Zap, Timer, ArrowLeft } from 'lucide-react';

interface BattleSystemProps {
  playerDeck: HeroCardType[];
  enemyDeck: HeroCardType[];
  onBattleComplete: (result: BattleResult) => void;
  onBack: () => void;
}

interface BattleState {
  playerCards: (HeroCardType & { currentHP: number })[];
  enemyCards: (HeroCardType & { currentHP: number })[];
  currentTurn: 'player' | 'enemy';
  selectedPlayerCard: number | null;
  selectedEnemyCard: number | null;
  battleLog: string[];
  turnTimer: number;
  phase: 'setup' | 'battle' | 'complete';
}

export function BattleSystem({ playerDeck, enemyDeck, onBattleComplete, onBack }: BattleSystemProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    playerCards: playerDeck.map(card => ({ 
      ...card, 
      currentHP: card.baseHP + (card.level * 15) 
    })),
    enemyCards: enemyDeck.map(card => ({ 
      ...card, 
      currentHP: card.baseHP + (card.level * 15) 
    })),
    currentTurn: 'player',
    selectedPlayerCard: null,
    selectedEnemyCard: null,
    battleLog: ['Battle begins!'],
    turnTimer: 30,
    phase: 'setup'
  });

  // Turn timer effect
  useEffect(() => {
    if (battleState.phase !== 'battle') return;
    
    const timer = setInterval(() => {
      setBattleState(prev => {
        if (prev.turnTimer <= 1) {
          // Auto-play turn
          if (prev.currentTurn === 'player') {
            autoPlayPlayerTurn(prev);
          } else {
            autoPlayEnemyTurn(prev);
          }
          return { ...prev, turnTimer: 30 };
        }
        return { ...prev, turnTimer: prev.turnTimer - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleState.phase, battleState.currentTurn]);

  const autoPlayPlayerTurn = (state: BattleState) => {
    const alivePlayerCards = state.playerCards.filter(card => card.currentHP > 0);
    const aliveEnemyCards = state.enemyCards.filter(card => card.currentHP > 0);
    
    if (alivePlayerCards.length > 0 && aliveEnemyCards.length > 0) {
      const randomPlayer = Math.floor(Math.random() * alivePlayerCards.length);
      const randomEnemy = Math.floor(Math.random() * aliveEnemyCards.length);
      
      const playerCardIndex = state.playerCards.findIndex(card => card.id === alivePlayerCards[randomPlayer].id);
      const enemyCardIndex = state.enemyCards.findIndex(card => card.id === aliveEnemyCards[randomEnemy].id);
      
      executeAttack(playerCardIndex, enemyCardIndex);
    }
  };

  const autoPlayEnemyTurn = (state: BattleState) => {
    const aliveEnemyCards = state.enemyCards.filter(card => card.currentHP > 0);
    const alivePlayerCards = state.playerCards.filter(card => card.currentHP > 0);
    
    if (aliveEnemyCards.length > 0 && alivePlayerCards.length > 0) {
      const randomEnemy = Math.floor(Math.random() * aliveEnemyCards.length);
      const randomPlayer = Math.floor(Math.random() * alivePlayerCards.length);
      
      const enemyCardIndex = state.enemyCards.findIndex(card => card.id === aliveEnemyCards[randomEnemy].id);
      const playerCardIndex = state.playerCards.findIndex(card => card.id === alivePlayerCards[randomPlayer].id);
      
      setTimeout(() => executeEnemyAttack(enemyCardIndex, playerCardIndex), 1500);
    }
  };

  const startBattle = () => {
    setBattleState(prev => ({ 
      ...prev, 
      phase: 'battle',
      battleLog: [...prev.battleLog, 'Battle phase begins! Choose your first attacker.']
    }));
  };

  const executeAttack = (attackerIndex: number, targetIndex: number) => {
    setBattleState(prev => {
      const attacker = prev.playerCards[attackerIndex];
      const target = prev.enemyCards[targetIndex];
      
      if (!attacker || !target || attacker.currentHP <= 0 || target.currentHP <= 0) {
        return prev;
      }

      const damage = attacker.baseAttack + (attacker.level * 10);
      const newEnemyCards = [...prev.enemyCards];
      newEnemyCards[targetIndex] = {
        ...target,
        currentHP: Math.max(0, target.currentHP - damage)
      };

      const logMessage = `${attacker.name} attacks ${target.name} for ${damage} damage!`;
      const newBattleLog = [...prev.battleLog, logMessage];

      // Check for battle end
      const aliveEnemies = newEnemyCards.filter(card => card.currentHP > 0);
      if (aliveEnemies.length === 0) {
        // Victory!
        const result: BattleResult = {
          victory: true,
          experienceGained: 100,
          coinsEarned: 200,
          cardsEarned: [],
          survivingCards: prev.playerCards.filter(card => card.currentHP > 0)
        };
        onBattleComplete(result);
        return { ...prev, phase: 'complete' };
      }

      return {
        ...prev,
        enemyCards: newEnemyCards,
        currentTurn: 'enemy' as const,
        selectedPlayerCard: null,
        selectedEnemyCard: null,
        battleLog: newBattleLog,
        turnTimer: 30
      };
    });
  };

  const executeEnemyAttack = (attackerIndex: number, targetIndex: number) => {
    setBattleState(prev => {
      const attacker = prev.enemyCards[attackerIndex];
      const target = prev.playerCards[targetIndex];
      
      if (!attacker || !target || attacker.currentHP <= 0 || target.currentHP <= 0) {
        return prev;
      }

      const damage = attacker.baseAttack + (attacker.level * 10);
      const newPlayerCards = [...prev.playerCards];
      newPlayerCards[targetIndex] = {
        ...target,
        currentHP: Math.max(0, target.currentHP - damage)
      };

      const logMessage = `${attacker.name} attacks ${target.name} for ${damage} damage!`;
      const newBattleLog = [...prev.battleLog, logMessage];

      // Check for battle end
      const alivePlayers = newPlayerCards.filter(card => card.currentHP > 0);
      if (alivePlayers.length === 0) {
        // Defeat!
        const result: BattleResult = {
          victory: false,
          experienceGained: 30,
          coinsEarned: 50,
          cardsEarned: [],
          survivingCards: []
        };
        onBattleComplete(result);
        return { ...prev, phase: 'complete' };
      }

      return {
        ...prev,
        playerCards: newPlayerCards,
        currentTurn: 'player' as const,
        selectedPlayerCard: null,
        selectedEnemyCard: null,
        battleLog: newBattleLog,
        turnTimer: 30
      };
    });
  };

  const selectPlayerCard = (index: number) => {
    if (battleState.currentTurn !== 'player' || battleState.playerCards[index].currentHP <= 0) return;
    
    setBattleState(prev => ({ 
      ...prev, 
      selectedPlayerCard: index,
      selectedEnemyCard: null 
    }));
  };

  const selectEnemyCard = (index: number) => {
    if (battleState.currentTurn !== 'player' || 
        battleState.selectedPlayerCard === null || 
        battleState.enemyCards[index].currentHP <= 0) return;
    
    executeAttack(battleState.selectedPlayerCard, index);
  };

  if (battleState.phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={onBack} className="touch-target">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Battle Arena</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Player Team */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/80">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Your Team
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {battleState.playerCards.map((card, index) => (
                  <div key={card.id} className="relative">
                    <HeroCard hero={card} size="small" />
                    <Badge className="absolute -top-2 -right-2 bg-game-health text-white">
                      {card.currentHP} HP
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Enemy Team */}
            <Card className="p-6 bg-gradient-to-br from-destructive/10 to-card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sword className="w-5 h-5 text-destructive" />
                Enemy Team
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {battleState.enemyCards.map((card, index) => (
                  <div key={card.id} className="relative">
                    <HeroCard hero={card} size="small" />
                    <Badge className="absolute -top-2 -right-2 bg-game-health text-white">
                      {card.currentHP} HP
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={startBattle} 
              size="lg" 
              className="touch-target bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Battle!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Battle Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="touch-target">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Battle in Progress</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={battleState.currentTurn === 'player' ? 'default' : 'secondary'}>
              {battleState.currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
            </Badge>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg">{battleState.turnTimer}s</span>
            </div>
          </div>
        </div>

        {/* Turn Timer */}
        <Progress 
          value={(battleState.turnTimer / 30) * 100} 
          className="mb-6 h-2"
        />

        {/* Battle Field */}
        <div className="grid gap-6 mb-6">
          {/* Enemy Cards */}
          <Card className="p-4 bg-gradient-to-br from-destructive/10 to-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sword className="w-4 h-4 text-destructive" />
              Enemy Team
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {battleState.enemyCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className={`relative cursor-pointer transition-all duration-200 touch-target ${
                    card.currentHP <= 0 ? 'opacity-50 grayscale' : 
                    battleState.selectedEnemyCard === index ? 'ring-2 ring-destructive scale-105' :
                    battleState.currentTurn === 'player' && battleState.selectedPlayerCard !== null ? 'hover:scale-105 hover:ring-2 hover:ring-destructive/50' : ''
                  }`}
                  onClick={() => selectEnemyCard(index)}
                >
                  <HeroCard hero={card} size="small" />
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    <Badge className="bg-game-health text-white text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      {card.currentHP}
                    </Badge>
                  </div>
                  {card.currentHP <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="text-white font-bold">KO</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Player Cards */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Your Team
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {battleState.playerCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className={`relative cursor-pointer transition-all duration-200 touch-target ${
                    card.currentHP <= 0 ? 'opacity-50 grayscale' : 
                    battleState.selectedPlayerCard === index ? 'ring-2 ring-primary scale-105' :
                    battleState.currentTurn === 'player' ? 'hover:scale-105 hover:ring-2 hover:ring-primary/50' : ''
                  }`}
                  onClick={() => selectPlayerCard(index)}
                >
                  <HeroCard hero={card} size="small" />
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    <Badge className="bg-game-health text-white text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      {card.currentHP}
                    </Badge>
                    <Badge className="bg-game-attack text-white text-xs">
                      <Sword className="w-3 h-3 mr-1" />
                      {card.baseAttack + (card.level * 10)}
                    </Badge>
                  </div>
                  {card.currentHP <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="text-white font-bold">KO</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Battle Log */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Battle Log</h3>
          <div className="h-32 overflow-y-auto bg-muted/30 rounded p-3">
            {battleState.battleLog.map((log, index) => (
              <div key={index} className="text-sm mb-1 last:mb-0">
                {log}
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        {battleState.currentTurn === 'player' && (
          <Card className="mt-4 p-4 bg-primary/10">
            <p className="text-center font-medium">
              {battleState.selectedPlayerCard === null 
                ? "Select one of your heroes to attack with" 
                : "Now select an enemy to attack"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}