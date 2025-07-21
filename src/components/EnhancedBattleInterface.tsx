import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HeroCard as HeroCardType } from '@/types/game';
import { HeroCard } from './HeroCard';
import { ParticleSystem, AnimatedButton } from './PremiumAnimations';
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Timer, 
  ArrowLeft,
  Target,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionStackItem {
  id: string;
  type: 'attack' | 'ability' | 'effect';
  source: string;
  target?: string;
  description: string;
  resolved: boolean;
}

interface EnhancedBattleInterfaceProps {
  playerCards: (HeroCardType & { currentHP: number })[];
  enemyCards: (HeroCardType & { currentHP: number })[];
  currentTurn: 'player' | 'enemy';
  selectedPlayerCard: number | null;
  selectedEnemyCard: number | null;
  turnTimer: number;
  actionStack: ActionStackItem[];
  onSelectPlayerCard: (index: number) => void;
  onSelectEnemyCard: (index: number) => void;
  onBack: () => void;
  battlePhase: 'planning' | 'resolution' | 'complete';
}

export function EnhancedBattleInterface({
  playerCards,
  enemyCards,
  currentTurn,
  selectedPlayerCard,
  selectedEnemyCard,
  turnTimer,
  actionStack,
  onSelectPlayerCard,
  onSelectEnemyCard,
  onBack,
  battlePhase
}: EnhancedBattleInterfaceProps) {
  const [hoveredCard, setHoveredCard] = useState<{ type: 'player' | 'enemy'; index: number } | null>(null);
  const [battleEffects, setBattleEffects] = useState<Array<{ id: string; type: string; position: { x: number; y: number } }>>([]);
  const battlefieldRef = useRef<HTMLDivElement>(null);

  // Simulate battle effects
  useEffect(() => {
    if (battlePhase === 'resolution' && actionStack.length > 0) {
      const unresolvedActions = actionStack.filter(action => !action.resolved);
      if (unresolvedActions.length > 0) {
        const effect = {
          id: `effect-${Date.now()}`,
          type: unresolvedActions[0].type,
          position: { x: Math.random() * 100, y: Math.random() * 100 }
        };
        setBattleEffects(prev => [...prev, effect]);
        
        setTimeout(() => {
          setBattleEffects(prev => prev.filter(e => e.id !== effect.id));
        }, 2000);
      }
    }
  }, [actionStack, battlePhase]);

  const getCardPositionHint = (cardIndex: number, isPlayer: boolean) => {
    if (!hoveredCard || hoveredCard.type !== (isPlayer ? 'player' : 'enemy') || hoveredCard.index !== cardIndex) {
      return null;
    }

    const card = isPlayer ? playerCards[cardIndex] : enemyCards[cardIndex];
    if (!card) return null;

    // Simulate positional effects
    const effects = [];
    if (cardIndex === 0) effects.push('Front Line: +10% damage');
    if (cardIndex === playerCards.length - 1) effects.push('Back Line: +5% defense');
    if (cardIndex > 0 && cardIndex < playerCards.length - 1) effects.push('Formation: Adjacent allies +5% attack');

    return effects;
  };

  const renderLane = (cards: (HeroCardType & { currentHP: number })[], isPlayer: boolean) => {
    return (
      <div className={cn(
        'relative p-4 rounded-lg border-2 transition-all duration-300',
        isPlayer 
          ? 'bg-gradient-to-br from-primary/10 to-card border-primary/30' 
          : 'bg-gradient-to-br from-destructive/10 to-card border-destructive/30'
      )}>
        {/* Lane Background Effects */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <ParticleSystem 
            type={isPlayer ? 'energy' : 'combat'} 
            intensity="low" 
            className="opacity-20" 
          />
        </div>

        {/* Lane Header */}
        <div className="flex items-center gap-2 mb-4 relative z-10">
          {isPlayer ? (
            <>
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Your Forces</span>
            </>
          ) : (
            <>
              <Sword className="w-5 h-5 text-destructive" />
              <span className="font-semibold text-destructive">Enemy Forces</span>
            </>
          )}
          <Badge variant="outline" className="ml-auto">
            {cards.filter(card => card.currentHP > 0).length} Active
          </Badge>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
          {cards.map((card, index) => {
            const isSelected = isPlayer 
              ? selectedPlayerCard === index 
              : selectedEnemyCard === index;
            const isHovered = hoveredCard?.type === (isPlayer ? 'player' : 'enemy') && hoveredCard?.index === index;
            const positionHints = getCardPositionHint(index, isPlayer);

            return (
              <div 
                key={card.id} 
                className="relative group"
                onMouseEnter={() => setHoveredCard({ type: isPlayer ? 'player' : 'enemy', index })}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Position Hints Tooltip */}
                {positionHints && positionHints.length > 0 && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20">
                    <Card className="p-2 bg-background/95 backdrop-blur-sm border-primary/30 text-xs whitespace-nowrap">
                      {positionHints.map((hint, i) => (
                        <div key={i} className="text-primary">{hint}</div>
                      ))}
                    </Card>
                  </div>
                )}

                {/* Card Container */}
                <div 
                  className={cn(
                    'relative cursor-pointer transition-all duration-300 touch-target',
                    card.currentHP <= 0 ? 'opacity-50 grayscale' : '',
                    isSelected && 'ring-2 ring-primary scale-105 z-10',
                    isHovered && !isSelected && 'scale-102 ring-1 ring-primary/50',
                    currentTurn === (isPlayer ? 'player' : 'enemy') && card.currentHP > 0 && 'hover:scale-105'
                  )}
                  onClick={() => {
                    if (card.currentHP <= 0) return;
                    if (isPlayer) {
                      onSelectPlayerCard(index);
                    } else {
                      onSelectEnemyCard(index);
                    }
                  }}
                >
                  <HeroCard hero={card} size="small" />
                  
                  {/* Enhanced Stats Overlay */}
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    <Badge className="bg-game-health text-white text-xs shadow-lg">
                      <Heart className="w-3 h-3 mr-1" />
                      {card.currentHP}
                    </Badge>
                    <Badge className="bg-game-attack text-white text-xs shadow-lg">
                      <Sword className="w-3 h-3 mr-1" />
                      {card.baseAttack + (card.level * 10)}
                    </Badge>
                  </div>

                  {/* Status Effects */}
                  {card.currentHP <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                      <span className="text-white font-bold text-shadow">DEFEATED</span>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse">
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
                    </div>
                  )}

                  {/* Target Indicator */}
                  {currentTurn === 'player' && selectedPlayerCard !== null && !isPlayer && card.currentHP > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Target className="w-6 h-6 text-destructive animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <ParticleSystem type="magic" intensity="low" className="opacity-20" />
        {battlePhase === 'resolution' && (
          <ParticleSystem type="combat" intensity="high" className="opacity-40" />
        )}
      </div>

      {/* Battle Effects */}
      {battleEffects.map(effect => (
        <div
          key={effect.id}
          className="absolute pointer-events-none z-30"
          style={{
            left: `${effect.position.x}%`,
            top: `${effect.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-4xl animate-bounce">
            {effect.type === 'attack' && '⚔️'}
            {effect.type === 'ability' && '✨'}
            {effect.type === 'effect' && '💥'}
          </div>
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Enhanced Battle Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <AnimatedButton
              variant="secondary"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retreat
            </AnimatedButton>
            <div>
              <h1 className="text-2xl font-bold">⚔️ Battle Arena</h1>
              <p className="text-sm text-muted-foreground">
                Phase: {battlePhase.charAt(0).toUpperCase() + battlePhase.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant={currentTurn === 'player' ? 'default' : 'secondary'}
              className="text-sm px-3 py-1"
            >
              {currentTurn === 'player' ? '🛡️ Your Turn' : '⚔️ Enemy Turn'}
            </Badge>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg font-bold">{turnTimer}s</span>
            </div>
          </div>
        </div>

        {/* Enhanced Turn Timer */}
        <div className="mb-6">
          <Progress 
            value={(turnTimer / 30) * 100} 
            className="h-3 bg-muted/50"
          />
          {turnTimer <= 10 && (
            <div className="flex items-center justify-center mt-2">
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Time Running Out!
              </Badge>
            </div>
          )}
        </div>

        {/* Action Stack Display */}
        {actionStack.length > 0 && (
          <Card className="mb-6 p-4 bg-card/80 backdrop-blur-sm border-accent/30">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-accent">Action Stack</h3>
              <Badge variant="outline">{actionStack.length} Actions</Badge>
            </div>
            <div className="space-y-2">
              {actionStack.map((action, index) => (
                <div
                  key={action.id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-md transition-all duration-300',
                    action.resolved 
                      ? 'bg-muted/30 opacity-60' 
                      : 'bg-primary/10 border border-primary/30',
                    index === 0 && !action.resolved && 'ring-2 ring-primary/50 animate-pulse'
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    action.resolved ? 'bg-muted' : 'bg-primary animate-pulse'
                  )} />
                  <span className="text-sm flex-1">{action.description}</span>
                  {action.resolved && (
                    <Badge variant="outline" className="text-xs">Resolved</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Enhanced Battlefield */}
        <div ref={battlefieldRef} className="space-y-6">
          {/* Enemy Lane */}
          {renderLane(enemyCards, false)}

          {/* Battle Center */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <Badge 
                variant="outline" 
                className="bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold"
              >
                ⚔️ BATTLEFIELD ⚔️
              </Badge>
            </div>
          </div>

          {/* Player Lane */}
          {renderLane(playerCards, true)}
        </div>

        {/* Enhanced Instructions */}
        <Card className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
          <div className="text-center">
            {currentTurn === 'player' ? (
              selectedPlayerCard === null ? (
                <p className="font-medium text-primary">
                  🎯 Select one of your heroes to begin your attack
                </p>
              ) : (
                <p className="font-medium text-primary">
                  ⚔️ Choose an enemy target to strike
                </p>
              )
            ) : (
              <p className="font-medium text-destructive">
                🛡️ Enemy is planning their move...
              </p>
            )}
          </div>
        </Card>

        {/* Battle Controls */}
        <div className="mt-6 flex justify-center gap-4">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => {/* Auto-play logic */}}
            disabled={currentTurn !== 'player'}
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto Battle
          </AnimatedButton>
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => {/* Skip turn logic */}}
            disabled={currentTurn !== 'player'}
          >
            <Timer className="w-4 h-4 mr-2" />
            End Turn
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}