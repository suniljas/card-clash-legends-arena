import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Lock, Star, Award, Target, Swords, Map, Users, Sparkles } from 'lucide-react';
import { Achievement, AchievementCategory } from '@/types/achievements';
import { achievementsService } from '@/services/achievements';
import { useGameState } from '@/hooks/useGameState';

const categoryIcons = {
  [AchievementCategory.COLLECTION]: Target,
  [AchievementCategory.BATTLE]: Swords,
  [AchievementCategory.CAMPAIGN]: Map,
  [AchievementCategory.PVP]: Users,
  [AchievementCategory.SOCIAL]: Users,
  [AchievementCategory.SPECIAL]: Sparkles
};

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-orange-500'
};

interface AchievementsProps {
  onNavigate: (page: string) => void;
}

export function Achievements({ onNavigate }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const gameState = useGameState();

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const userAchievements = await achievementsService.getUserAchievements();
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const renderAchievementCard = (achievement: Achievement) => {
    const IconComponent = categoryIcons[achievement.category] || Trophy;
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <Card 
        key={achievement.id} 
        className={`relative overflow-hidden transition-all hover:scale-105 ${
          achievement.unlocked 
            ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5' 
            : 'border-muted bg-muted/20'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-primary/20' : 'bg-muted'}`}>
                {achievement.unlocked ? (
                  <Trophy className="h-5 w-5 text-primary" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {achievement.title}
                  <span className="text-2xl">{achievement.icon}</span>
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`${rarityColors[achievement.rarity]} text-white text-xs`}
                >
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
            </div>
            <IconComponent className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="text-sm mb-4">
            {achievement.description}
          </CardDescription>
          
          {!achievement.unlocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
          
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Star className="h-4 w-4" />
              <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
            </div>
          )}
          
          {achievement.reward && (
            <div className="mt-3 p-2 bg-secondary/20 rounded-lg">
              <p className="text-xs font-medium text-secondary-foreground mb-1">Rewards:</p>
              <div className="flex gap-2 text-xs">
                {achievement.reward.coins && (
                  <span className="flex items-center gap-1">
                    🪙 {achievement.reward.coins}
                  </span>
                )}
                {achievement.reward.gems && (
                  <span className="flex items-center gap-1">
                    💎 {achievement.reward.gems}
                  </span>
                )}
                {achievement.reward.cardPacks && (
                  <span className="flex items-center gap-1">
                    📦 {achievement.reward.cardPacks}
                  </span>
                )}
                {achievement.reward.title && (
                  <span className="flex items-center gap-1">
                    👑 {achievement.reward.title}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p>Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Achievements
        </h1>
        <p className="text-lg text-muted-foreground">
          {unlockedCount}/{totalCount} achievements unlocked
        </p>
        <div className="mt-4 max-w-md mx-auto">
          <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={AchievementCategory.COLLECTION}>Collection</TabsTrigger>
          <TabsTrigger value={AchievementCategory.BATTLE}>Battle</TabsTrigger>
          <TabsTrigger value={AchievementCategory.CAMPAIGN}>Campaign</TabsTrigger>
          <TabsTrigger value={AchievementCategory.PVP}>PvP</TabsTrigger>
          <TabsTrigger value={AchievementCategory.SOCIAL}>Social</TabsTrigger>
          <TabsTrigger value={AchievementCategory.SPECIAL}>Special</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(renderAchievementCard)}
          </div>
        </TabsContent>

        {Object.values(AchievementCategory).map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements
                .filter(a => a.category === category)
                .map(renderAchievementCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}