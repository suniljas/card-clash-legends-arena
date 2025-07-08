import { useState } from 'react';
import { PlayerDeck, GameStats, BattleResult, CampaignLevel } from '@/types/game';
import { HeroCard } from './HeroCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Sword, Trophy, Coins } from 'lucide-react';
import { HERO_DATABASE } from '@/data/heroes';

interface CampaignProps {
  playerDeck: PlayerDeck;
  gameStats: GameStats;
  onBack: () => void;
  onBattleComplete: (result: BattleResult) => void;
}

export function Campaign({ playerDeck, gameStats, onBack, onBattleComplete }: CampaignProps) {
  const [selectedLevel, setSelectedLevel] = useState<CampaignLevel | null>(null);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  // Generate campaign levels
  const campaignLevels: CampaignLevel[] = Array.from({ length: 20 }, (_, i) => {
    const levelNum = i + 1;
    const difficulty = Math.floor(levelNum / 3) + 1;
    
    return {
      id: levelNum,
      name: `Level ${levelNum}: ${getLevelName(levelNum)}`,
      difficulty,
      enemyDeck: generateEnemyDeck(difficulty),
      rewards: {
        coins: 100 + (levelNum * 50),
        experience: 50 + (levelNum * 25),
        cards: levelNum % 5 === 0 ? [HERO_DATABASE[Math.floor(Math.random() * HERO_DATABASE.length)]] : undefined
      },
      unlocked: levelNum <= gameStats.campaignProgress,
      completed: levelNum < gameStats.campaignProgress
    };
  });

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
      alert('You need to build a deck first!');
      return;
    }

    setBattling(true);
    setSelectedLevel(level);

    // Simulate battle
    setTimeout(() => {
      const playerPower = playerDeck.cards.reduce((sum, card) => 
        sum + card.baseAttack + (card.level * 10), 0);
      const enemyPower = level.enemyDeck.reduce((sum, card) => 
        sum + card.baseAttack + (card.level * 10), 0);
      
      const victory = playerPower > enemyPower * 0.8; // Give player slight advantage
      
      const result: BattleResult = {
        victory,
        experienceGained: victory ? level.rewards.experience : Math.floor(level.rewards.experience * 0.3),
        coinsEarned: victory ? level.rewards.coins : Math.floor(level.rewards.coins * 0.3),
        cardsEarned: victory && level.rewards.cards ? level.rewards.cards : [],
        survivingCards: playerDeck.cards
      };

      setBattleResult(result);
      setBattling(false);
      onBattleComplete(result);
    }, 3000);
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
              ? 'Excellent work, champion!'
              : 'Better luck next time. Train harder!'}
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
            
            {battleResult.cardsEarned.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">New Cards Earned:</h4>
                <div className="flex justify-center gap-2">
                  {battleResult.cardsEarned.map(card => (
                    <HeroCard key={card.id} hero={card} size="small" />
                  ))}
                </div>
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
          <h2 className="text-2xl font-bold mb-2">Battle in Progress...</h2>
          <p className="text-muted-foreground mb-4">Your heroes are fighting!</p>
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
          <h1 className="text-2xl font-bold">Campaign</h1>
          <p className="text-muted-foreground">
            Progress: {gameStats.campaignProgress}/20 levels
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

      {/* Level Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaignLevels.map((level) => (
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

            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Coins className="w-3 h-3 text-accent" />
                <span>{level.rewards.coins} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-3 h-3 text-secondary" />
                <span>{level.rewards.experience} XP</span>
              </div>
              {level.rewards.cards && (
                <div className="flex items-center gap-2">
                  <span className="text-xs">🎁 Bonus card!</span>
                </div>
              )}
            </div>

            {level.unlocked && !level.completed && (
              <Button size="sm" className="w-full mt-3">
                <Sword className="w-3 h-3 mr-1" />
                Battle
              </Button>
            )}
          </Card>
        ))}
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