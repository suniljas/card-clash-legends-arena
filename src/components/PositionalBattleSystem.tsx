import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Target, Shield, Sword, Star, Zap, Users } from 'lucide-react';
import { PositionalCombatSystem, PositionalCard, LaneType } from '@/engine/PositionalCombatSystem';
import { useToast } from '@/hooks/use-toast';

interface PositionalBattleProps {
  playerDeck: PositionalCard[];
  enemyDeck: PositionalCard[];
  onBattleComplete: (result: any) => void;
  onBack: () => void;
}

export function PositionalBattleSystem({ playerDeck, enemyDeck, onBattleComplete, onBack }: PositionalBattleProps) {
  const [combatSystem] = useState(new PositionalCombatSystem());
  const [selectedCard, setSelectedCard] = useState<PositionalCard | null>(null);
  const [selectedLane, setSelectedLane] = useState<LaneType | null>(null);
  const [playerHand, setPlayerHand] = useState<PositionalCard[]>(playerDeck.slice(0, 5));
  const [playerMana, setPlayerMana] = useState(3);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [battlefield, setBattlefield] = useState(combatSystem.getBattlefield());
  
  const { toast } = useToast();

  const handleCardPlay = (card: PositionalCard, lane: LaneType, position: number) => {
    if (card.manaCost > playerMana) {
      toast({
        title: "Not Enough Mana",
        description: `This card costs ${card.manaCost} mana, but you only have ${playerMana}.`,
        variant: "destructive"
      });
      return;
    }

    if (combatSystem.canPlayCard(card, lane, position)) {
      combatSystem.playCard(card, lane, position);
      setPlayerMana(prev => prev - card.manaCost);
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
      setBattlefield(combatSystem.getBattlefield());
      setSelectedCard(null);
      setSelectedLane(null);
      
      toast({
        title: "Card Played",
        description: `${card.name} deployed to ${lane} lane!`,
      });
    }
  };

  const getLaneClassName = (lane: LaneType, isPlayer: boolean) => {
    const baseClass = "min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg p-4";
    const laneColor = lane === 'melee' ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50';
    const selectedClass = selectedLane === lane ? 'border-primary bg-primary/10' : '';
    
    return `${baseClass} ${laneColor} ${selectedClass}`;
  };

  const getKeywordBadges = (card: PositionalCard) => {
    const badges = [];
    if (card.keywords.guard) badges.push(<Badge key="guard" variant="outline" className="text-blue-600"><Shield className="h-3 w-3 mr-1" />Guard</Badge>);
    if (card.keywords.flank) badges.push(<Badge key="flank" variant="outline" className="text-green-600"><Sword className="h-3 w-3 mr-1" />Flank</Badge>);
    if (card.keywords.artillery) badges.push(<Badge key="artillery" variant="outline" className="text-red-600"><Target className="h-3 w-3 mr-1" />Artillery</Badge>);
    if (card.keywords.formation) badges.push(<Badge key="formation" variant="outline" className="text-purple-600"><Users className="h-3 w-3 mr-1" />Formation</Badge>);
    return badges;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Turn</p>
              <Badge variant={currentTurn === 'player' ? 'default' : 'secondary'}>
                {currentTurn === 'player' ? 'Your Turn' : 'Enemy Turn'}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Mana</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: playerMana }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-blue-500 rounded-full" />
                ))}
                {Array.from({ length: Math.max(0, 10 - playerMana) }).map((_, i) => (
                  <div key={i + playerMana} className="w-3 h-3 bg-gray-300 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Battlefield */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Positional Battlefield
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enemy Lanes */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Enemy Forces</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Sword className="h-3 w-3 mr-1" />
                    Melee Lane
                  </Badge>
                  <div className={getLaneClassName('melee', false)}>
                    <div className="flex gap-2 flex-wrap">
                      {battlefield.enemyLanes.melee.enemyCards.map((card, index) => (
                        <div key={`enemy-melee-${index}`} className="w-16 h-20 bg-red-100 border border-red-300 rounded text-xs p-1">
                          <div className="font-semibold truncate">{card.name}</div>
                          <div className="text-xs">{card.baseAttack}/{card.baseHP}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Zap className="h-3 w-3 mr-1" />
                    Ranged Lane
                  </Badge>
                  <div className={getLaneClassName('ranged', false)}>
                    <div className="flex gap-2 flex-wrap">
                      {battlefield.enemyLanes.ranged.enemyCards.map((card, index) => (
                        <div key={`enemy-ranged-${index}`} className="w-16 h-20 bg-blue-100 border border-blue-300 rounded text-xs p-1">
                          <div className="font-semibold truncate">{card.name}</div>
                          <div className="text-xs">{card.baseAttack}/{card.baseHP}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Lanes */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Your Forces</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Sword className="h-3 w-3 mr-1" />
                    Melee Lane
                  </Badge>
                  <div 
                    className={getLaneClassName('melee', true)}
                    onClick={() => selectedCard && setSelectedLane('melee')}
                  >
                    <div className="flex gap-2 flex-wrap">
                      {battlefield.playerLanes.melee.playerCards.map((card, index) => (
                        <div key={`player-melee-${index}`} className="w-16 h-20 bg-green-100 border border-green-300 rounded text-xs p-1">
                          <div className="font-semibold truncate">{card.name}</div>
                          <div className="text-xs">{card.baseAttack}/{card.baseHP}</div>
                          <div className="flex gap-1 mt-1">
                            {getKeywordBadges(card).slice(0, 2)}
                          </div>
                        </div>
                      ))}
                      {selectedCard && selectedLane === 'melee' && (
                        <Button 
                          size="sm" 
                          className="w-16 h-20 text-xs"
                          onClick={() => handleCardPlay(selectedCard, 'melee', battlefield.playerLanes.melee.playerCards.length)}
                        >
                          Deploy Here
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit">
                    <Zap className="h-3 w-3 mr-1" />
                    Ranged Lane
                  </Badge>
                  <div 
                    className={getLaneClassName('ranged', true)}
                    onClick={() => selectedCard && setSelectedLane('ranged')}
                  >
                    <div className="flex gap-2 flex-wrap">
                      {battlefield.playerLanes.ranged.playerCards.map((card, index) => (
                        <div key={`player-ranged-${index}`} className="w-16 h-20 bg-green-100 border border-green-300 rounded text-xs p-1">
                          <div className="font-semibold truncate">{card.name}</div>
                          <div className="text-xs">{card.baseAttack}/{card.baseHP}</div>
                          <div className="flex gap-1 mt-1">
                            {getKeywordBadges(card).slice(0, 2)}
                          </div>
                        </div>
                      ))}
                      {selectedCard && selectedLane === 'ranged' && (
                        <Button 
                          size="sm" 
                          className="w-16 h-20 text-xs"
                          onClick={() => handleCardPlay(selectedCard, 'ranged', battlefield.playerLanes.ranged.playerCards.length)}
                        >
                          Deploy Here
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Hand */}
        <Card>
          <CardHeader>
            <CardTitle>Your Hand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto">
              {playerHand.map((card) => (
                <div 
                  key={card.id}
                  className={`min-w-[160px] cursor-pointer transition-all ${
                    selectedCard?.id === card.id ? 'ring-2 ring-primary' : ''
                  } ${card.manaCost > playerMana ? 'opacity-50' : 'hover:scale-105'}`}
                  onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
                >
                  <Card className="h-full">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm truncate">{card.name}</h4>
                          <Badge variant="outline">{card.manaCost}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {card.baseAttack} / {card.baseHP}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {getKeywordBadges(card)}
                        </div>
                        {card.preferredLane && (
                          <Badge variant="secondary" className="text-xs">
                            Prefers {card.preferredLane}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {selectedCard && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Selected: {selectedCard.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Click on a lane to deploy this unit. Position matters!
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Lane Strategy:</strong>
                    <ul className="text-xs text-muted-foreground mt-1">
                      <li>• Melee: Can attack enemies directly</li>
                      <li>• Ranged: Supports melee, protected position</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Keywords:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getKeywordBadges(selectedCard)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}