import { useState, useEffect } from 'react';
import { PlayerDeck, GameStats, BattleResult, Opponent } from '@/types/game';
import { HERO_DATABASE } from '@/data/heroes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Zap, Trophy, Coins } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NetworkStatusIndicator } from './NetworkStatusIndicator';
import { EnhancedLoadingSpinner } from './EnhancedLoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface PvPArenaProps {
  playerDeck: PlayerDeck;
  gameStats: GameStats;
  onBack: () => void;
  onBattleComplete: (result: BattleResult) => void;
}

export function PvPArena({ playerDeck, gameStats, onBack, onBattleComplete }: PvPArenaProps) {
  const [searching, setSearching] = useState(false);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [currentOpponent, setCurrentOpponent] = useState<(Opponent & { rank: string; power: number }) | null>(null);
  const [matchmakingProgress, setMatchmakingProgress] = useState(0);
  const { toast } = useToast();

  // WebSocket for real multiplayer (fallback to mock for now)
  const { isConnected, isConnecting, latency, sendMessage } = useWebSocket({
    url: 'wss://demo-multiplayer-server.com', // Would be real server
    onMessage: (message) => {
      if (message.type === 'match_found') {
        setCurrentOpponent(message.data.opponent);
        setSearching(false);
        startBattle(message.data.opponent);
      }
    },
    onConnect: () => {
      toast({
        title: "Multiplayer Ready",
        description: "Connected to PvP servers",
      });
    }
  });

  const opponents: (Opponent & { rank: string; power: number })[] = [
    { 
      name: 'DragonSlayer99', 
      rank: 'Silver', 
      power: 1200,
      deck: HERO_DATABASE.slice(0, 3).map(hero => ({ ...hero, id: `opp1-${hero.id}` })),
      difficulty: 2
    },
    { 
      name: 'MysticMage', 
      rank: 'Gold', 
      power: 1500,
      deck: HERO_DATABASE.slice(1, 4).map(hero => ({ ...hero, id: `opp2-${hero.id}` })),
      difficulty: 3
    },
    { 
      name: 'ShadowHunter', 
      rank: 'Bronze', 
      power: 800,
      deck: HERO_DATABASE.slice(2, 5).map(hero => ({ ...hero, id: `opp3-${hero.id}` })),
      difficulty: 1
    },
    { 
      name: 'FrostKnight', 
      rank: 'Platinum', 
      power: 1800,
      deck: HERO_DATABASE.slice(3, 6).map(hero => ({ ...hero, id: `opp4-${hero.id}` })),
      difficulty: 4
    },
    { 
      name: 'PhoenixRider', 
      rank: 'Gold', 
      power: 1400,
      deck: HERO_DATABASE.slice(0, 4).map(hero => ({ ...hero, id: `opp5-${hero.id}` })),
      difficulty: 3
    }
  ];

  const handleFindMatch = () => {
    if (playerDeck.cards.length === 0) {
      toast({
        title: "No Deck Found",
        description: "You need to build a deck first!",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    setMatchmakingProgress(0);
    
    // Try real multiplayer first, fallback to AI
    if (isConnected) {
      sendMessage('find_match', { 
        deck: playerDeck, 
        playerStats: gameStats 
      });
    } else {
      // Simulate matchmaking with progress
      const interval = setInterval(() => {
        setMatchmakingProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
            setCurrentOpponent(randomOpponent);
            setSearching(false);
            startBattle(randomOpponent);
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }
  };

  const startBattle = (opponent: Opponent) => {
    setBattling(true);

    setTimeout(() => {
      const playerPower = playerDeck.cards.reduce((sum, card) => 
        sum + card.baseAttack + (card.level * 10), 0);
      
      const victory = Math.random() > 0.4; // 60% win rate for demo
      
      const result: BattleResult = {
        victory,
        experienceGained: victory ? 100 : 30,
        coinsEarned: victory ? 200 : 50,
        cardsEarned: [],
        survivingCards: playerDeck.cards
      };

      setBattleResult(result);
      setBattling(false);
      onBattleComplete(result);
    }, 4000);
  };

  if (battleResult) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">
            {battleResult.victory ? '🏆' : '💀'}
          </div>
          
          <h2 className="text-3xl font-bold mb-2">
            {battleResult.victory ? 'Victory!' : 'Defeat'}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {battleResult.victory 
              ? `You defeated ${currentOpponent?.name}!`
              : `${currentOpponent?.name} was too strong this time.`}
          </p>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Battle Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                <span>+{battleResult.coinsEarned} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <span>+{battleResult.experienceGained} XP</span>
              </div>
            </div>
          </Card>

          <Button onClick={() => setBattleResult(null)}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (battling) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚔️</div>
          <h2 className="text-2xl font-bold mb-2">PvP Battle!</h2>
          <p className="text-muted-foreground mb-4">
            Fighting against {currentOpponent?.name}
          </p>
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <div className="text-sm text-muted-foreground">You</div>
              <div className="font-bold">Champion</div>
            </div>
            <div className="text-2xl">VS</div>
            <div>
              <div className="text-sm text-muted-foreground">Opponent</div>
              <div className="font-bold">{currentOpponent?.name}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (searching) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <EnhancedLoadingSpinner 
            size="xl"
            text="Finding worthy opponent..."
            progress={matchmakingProgress}
            variant="card"
          />
          
          <div className="flex justify-center">
            <NetworkStatusIndicator latency={latency} />
          </div>
          
          <p className="text-xs text-muted-foreground">
            {isConnected 
              ? "Searching online players..." 
              : "Searching AI opponents..."
            }
          </p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSearching(false);
              setMatchmakingProgress(0);
            }}
          >
            Cancel Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="touch-target">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-mobile-2xl font-bold">PvP Arena</h1>
            <NetworkStatusIndicator latency={latency} />
          </div>
          <p className="text-muted-foreground text-mobile-sm">
            Battle other players for glory and rewards
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-secondary" />
            <div>
              <div className="text-2xl font-bold text-secondary">{gameStats.pvpWins}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-destructive" />
            <div>
              <div className="text-2xl font-bold text-destructive">{gameStats.pvpLosses}</div>
              <div className="text-sm text-muted-foreground">Losses</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            <div>
              <div className="text-2xl font-bold text-primary">
                {gameStats.pvpWins > gameStats.pvpLosses ? 
                  Math.floor((gameStats.pvpWins / (gameStats.pvpWins + gameStats.pvpLosses)) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Battle Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-3">⚔️ Quick Match</h3>
          <p className="text-muted-foreground mb-4">
            Get matched with a player of similar skill level
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Rewards:</span>
              <span>200 coins, 100 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Entry Fee:</span>
              <span className="text-green-500">Free</span>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleFindMatch}
            disabled={playerDeck.cards.length === 0}
          >
            <Users className="w-4 h-4 mr-2" />
            Find Match
          </Button>
        </Card>

        <Card className="p-6 opacity-50">
          <h3 className="text-xl font-bold mb-3">🏆 Ranked Battle</h3>
          <p className="text-muted-foreground mb-4">
            Climb the ladder in competitive ranked matches
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Rewards:</span>
              <span>500 coins, 200 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Entry Fee:</span>
              <span>100 coins</span>
            </div>
          </div>
          <Button className="w-full" disabled>
            Coming Soon
          </Button>
        </Card>
      </div>

      {/* Leaderboard Preview */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">🏅 Top Players</h3>
        <div className="space-y-3">
          {opponents.slice(0, 5).map((player, index) => (
            <div key={player.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline">#{index + 1}</Badge>
                <span className="font-medium">{player.name}</span>
                <Badge 
                  variant="outline"
                  className={
                    player.rank === 'Bronze' ? 'border-orange-500 text-orange-500' :
                    player.rank === 'Silver' ? 'border-gray-400 text-gray-400' :
                    player.rank === 'Gold' ? 'border-yellow-500 text-yellow-500' :
                    'border-purple-500 text-purple-500'
                  }
                >
                  {player.rank}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {player.power} power
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deck Status */}
      {playerDeck.cards.length === 0 && (
        <Card className="mt-6 p-4 border-destructive/50">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-destructive">No Battle Deck</h4>
              <p className="text-sm text-muted-foreground">
                You need to build a deck before entering PvP battles
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}