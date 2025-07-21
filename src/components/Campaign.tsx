import { useState } from 'react';
import { PlayerDeck, GameStats, BattleResult, CampaignLevel } from '@/types/game';
// Campaign data integrated directly into component
import { HeroCard } from './HeroCard';
import { HeroCard as HeroCardType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Sword, Trophy, Coins, Users, Clock } from 'lucide-react';
import { HERO_DATABASE } from '@/data/heroes';
import { CampaignSystem } from '@/services/campaignSystem';
import { useToast } from '@/hooks/use-toast';

interface CampaignProps {
  playerDeck: PlayerDeck;
  gameStats: GameStats;
  onBack: () => void;
  onBattleComplete: (result: BattleResult) => void;
  onStartBattle?: (playerDeck: HeroCardType[], enemyDeck: HeroCardType[]) => void;
}

export function Campaign({ playerDeck, gameStats, onBack, onBattleComplete, onStartBattle }: CampaignProps) {
  const [selectedLevel, setSelectedLevel] = useState<CampaignLevel | null>(null);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const campaignSystem = new CampaignSystem();
  const { toast } = useToast();

  // Campaign data - integrated into component after cleanup
  const CAMPAIGN_DATA: CampaignLevel[] = [
    {
      id: 1,
      name: "Forest Outpost",
      difficulty: 1,
      enemyDeck: [],
      rewards: { coins: 100, experience: 50 },
      unlocked: true,
      completed: false,
    },
    {
      id: 2,
      name: "Mountain Pass", 
      difficulty: 2,
      enemyDeck: [],
      rewards: { coins: 150, experience: 75 },
      unlocked: false,
      completed: false,
    },
    {
      id: 3,
      name: "Dark Caverns",
      difficulty: 3,
      enemyDeck: [],
      rewards: { coins: 200, experience: 100 },
      unlocked: false,
      completed: false,
    },
    {
      id: 4,
      name: "Ancient Ruins",
      difficulty: 4,
      enemyDeck: [],
      rewards: { coins: 300, experience: 150 },
      unlocked: false,
      completed: false,
    },
    {
      id: 5,
      name: "Dragon's Lair",
      difficulty: 5,
      enemyDeck: [],
      rewards: { coins: 500, experience: 250 },
      unlocked: false,
      completed: false,
    }
  ];

  // Generate endless campaign function
  function generateEndlessCampaign(level: number): CampaignLevel {
    const difficulty = Math.min(level, 10);
    
    return {
      id: level,
      name: `Endless Battle ${level}`,
      difficulty,
      enemyDeck: [],
      rewards: {
        coins: 50 + (level * 25),
        experience: 25 + (level * 15),
      },
      unlocked: true,
      completed: false,
    };
  }

  const baseCampaignLevels = CAMPAIGN_DATA.map(level => ({
    ...level,
    unlocked: level.id <= gameStats.campaignProgress,
    completed: level.id < gameStats.campaignProgress,
  }));

  // Generate endless campaign levels
  const endlessLevels = [];
  const maxEndlessLevels = 20;
  for (let i = CAMPAIGN_DATA.length + 1; i <= CAMPAIGN_DATA.length + maxEndlessLevels; i++) {
    if (i <= gameStats.campaignProgress + 3) { // Show up to 3 levels ahead
      endlessLevels.push(generateEndlessCampaign(i));
    }
  }

  const campaignLevels = [...baseCampaignLevels, ...endlessLevels];

  function getLevelName(level: number): string {
    const names = [
      'Forest Glade', 'Mountain Pass', 'Dark Cave', 'Crystal Lake', 'Ancient Ruins',
      'Fire Temple', 'Ice Palace', 'Shadow Realm', 'Sky Fortress', 'Dragon\'s Lair',
      'Mystic Forest', 'Volcano Core', 'Underwater City', 'Cloud Kingdom', 'Demon Castle',
      'Angel Sanctuary', 'Time Vortex', 'Space Station', 'Parallel Dimension', 'Final Boss'
    ];
    return names[level - 1] || `Challenge ${level}`;
  }

  function generateEnemyDeck(difficulty: number) {
    const enemyCards = HERO_DATABASE
      .slice(0, 8)
      .map(hero => ({
        ...hero,
        id: `enemy-${hero.id}`,
        level: difficulty,
        baseAttack: hero.baseAttack + (difficulty * 20),
        baseHP: hero.baseHP + (difficulty * 30)
      }));
    
    return enemyCards;
  }

  const handleBattle = async (level: CampaignLevel) => {
    if (playerDeck.cards.length === 0) {
      toast({
        title: "No Deck",
        description: "You need to build a deck first!",
        variant: "destructive"
      });
      return;
    }

    // Join campaign instance (100-player logic)
    const campaignInstance = CampaignSystem.joinCampaignLevel(
      level.id, 
      `player-${Date.now()}`, 
      'Player'
    );

    if (onStartBattle) {
      // Use new battle system
      onStartBattle(playerDeck.cards, level.enemyDeck);
      return;
    }

    // Fallback to old system with campaign rewards
    setBattling(true);
    setSelectedLevel(level);

    setTimeout(() => {
      const playerPower = playerDeck.cards.reduce((sum, card) => 
        sum + card.baseAttack + (card.level * 10), 0);
      const enemyPower = level.enemyDeck.reduce((sum, card) => 
        sum + card.baseAttack + (card.level * 10), 0);
      
      const victory = playerPower > enemyPower * 0.8;
      
      if (victory) {
        // Complete campaign level and get distributed rewards
        const campaignResult = CampaignSystem.completeCampaignLevel(
          campaignInstance.id,
          `player-${Date.now()}`,
          'Player',
          level.id
        );

        setBattleResult({
          ...campaignResult,
          survivingCards: playerDeck.cards
        });

        toast({
          title: "Campaign Victory!",
          description: `${campaignResult.cardsEarned.length > 0 ? 'Card rewards earned!' : 'Coins earned!'}`,
        });
      } else {
        setBattleResult({
          victory: false,
          experienceGained: Math.floor(level.rewards.experience * 0.3),
          coinsEarned: Math.floor(level.rewards.coins * 0.3),
          cardsEarned: [],
          survivingCards: playerDeck.cards
        });
      }

      setBattling(false);
      onBattleComplete(battleResult!);
    }, 3000);
  };

  // Get campaign statistics
  const getCampaignStats = (levelId: number) => {
    return CampaignSystem.getCampaignStats(levelId);
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
              ? 'Excellent work, champion! Campaign rewards distributed!'
              : 'Better luck next time. Train harder!'}
          </p>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Campaign Rewards</h3>
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
            
            {battleResult.cardsEarned.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Campaign Card Drops:</h4>
                <div className="flex justify-center gap-2">
                  {battleResult.cardsEarned.map(card => (
                    <div key={card.id} className="text-center">
                      <HeroCard hero={card} size="small" />
                      <Badge className="mt-1 text-xs">{card.edition}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {battleResult.victory && (
              <div className="mt-4 p-3 bg-primary/10 rounded">
                <p className="text-sm text-primary font-medium">
                  🎯 100-Player Campaign System: Rewards distributed based on completion order!
                </p>
              </div>
            )}
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
          <div className="text-6xl mb-4 animate-pulse">⚔️</div>
          <h2 className="text-2xl font-bold mb-2">Campaign Battle in Progress...</h2>
          <p className="text-muted-foreground mb-4">Your heroes are fighting for campaign rewards!</p>
          <Progress value={66} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Campaign Arena</h1>
          <p className="text-muted-foreground">
            Join 100-player campaign instances • Progress: {gameStats.campaignProgress}/20 levels
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Campaign Progress</span>
          <Progress value={(gameStats.campaignProgress / 20) * 100} className="flex-1" />
          <span className="text-sm font-medium">{gameStats.campaignProgress}/20</span>
        </div>
      </Card>

      {/* Campaign System Info */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <h3 className="font-semibold mb-2">🏟️ 100-Player Campaign System</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Guaranteed:</strong> Gold for completion
          </div>
          <div>
            <strong>5% (5 players):</strong> Common Card
          </div>
          <div>
            <strong>3% (3 players):</strong> Uncommon Card
          </div>
          <div>
            <strong>2% (2 players):</strong> Rare Card + 1% Legendary
          </div>
        </div>
      </Card>

      {/* Level Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaignLevels.map((level) => {
          const stats = getCampaignStats(level.id);
          
          return (
            <Card
              key={level.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                level.unlocked 
                  ? 'hover:scale-105 hover:shadow-lg' 
                  : 'opacity-50 cursor-not-allowed'
              } ${level.completed ? 'bg-accent/10' : ''}`}
              onClick={() => level.unlocked && !level.completed && handleBattle(level)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{level.name}</h3>
                <div className="flex gap-1">
                  {level.completed && <Badge variant="outline">✓</Badge>}
                  {!level.unlocked && <Badge variant="outline">🔒</Badge>}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                Difficulty: {Array.from({ length: level.difficulty }).map((_, i) => '⭐').join('')}
              </div>

              {/* Campaign Instance Stats */}
              <div className="text-xs mb-3 p-2 bg-muted/30 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3 h-3" />
                  <span>{stats.totalParticipants} players joined</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{stats.completedInstances} instances completed</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <Coins className="w-3 h-3 text-accent" />
                  <span>{level.rewards.coins} coins (guaranteed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-secondary" />
                  <span>{level.rewards.experience} XP</span>
                </div>
                <div className="text-xs text-primary">
                  🎁 Card drops: 5% Common, 3% Uncommon, 2% Rare, 1% Legendary
                </div>
              </div>

              {level.unlocked && !level.completed && (
                <Button size="sm" className="w-full mt-3">
                  <Sword className="w-3 h-3 mr-1" />
                  Join Campaign Battle
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Deck Status */}
      <Card className="mt-6 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Your Battle Deck</h3>
            <p className="text-sm text-muted-foreground">
              {playerDeck.cards.length}/{playerDeck.maxSize} cards
            </p>
          </div>
          {playerDeck.cards.length === 0 && (
            <Badge variant="destructive">Build a deck first!</Badge>
          )}
        </div>
      </Card>
    </div>
  );
}