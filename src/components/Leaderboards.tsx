import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Target, Swords, Map, Users, Gem, Crown, Star } from 'lucide-react';
import { LeaderboardEntry, LeaderboardCategory } from '@/types/achievements';
import { achievementsService } from '@/services/achievements';
import { useGameState } from '@/hooks/useGameState';

const leaderboardConfigs = {
  [LeaderboardCategory.PVP_WINS]: {
    title: 'PvP Champions',
    description: 'Top players by PvP victories',
    icon: Swords,
    color: 'text-red-500'
  },
  [LeaderboardCategory.CAMPAIGN_PROGRESS]: {
    title: 'Campaign Masters',
    description: 'Furthest campaign progression',
    icon: Map,
    color: 'text-blue-500'
  },
  [LeaderboardCategory.COLLECTION_SIZE]: {
    title: 'Card Collectors',
    description: 'Largest card collections',
    icon: Target,
    color: 'text-purple-500'
  },
  [LeaderboardCategory.TOTAL_BATTLES]: {
    title: 'Battle Veterans',
    description: 'Most battles completed',
    icon: Medal,
    color: 'text-orange-500'
  },
  [LeaderboardCategory.GEMS_EARNED]: {
    title: 'Gem Masters',
    description: 'Most gems earned',
    icon: Gem,
    color: 'text-green-500'
  }
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2: return <Medal className="h-6 w-6 text-gray-400" />;
    case 3: return <Award className="h-6 w-6 text-amber-600" />;
    default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
  if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-black';
  if (rank <= 10) return 'bg-gradient-to-r from-primary to-secondary text-white';
  return 'bg-muted text-muted-foreground';
};

interface LeaderboardsProps {
  onNavigate: (page: string) => void;
}

export function Leaderboards({ onNavigate }: LeaderboardsProps) {
  const [leaderboards, setLeaderboards] = useState<Record<LeaderboardCategory, LeaderboardEntry[]>>({
    [LeaderboardCategory.PVP_WINS]: [],
    [LeaderboardCategory.CAMPAIGN_PROGRESS]: [],
    [LeaderboardCategory.COLLECTION_SIZE]: [],
    [LeaderboardCategory.TOTAL_BATTLES]: [],
    [LeaderboardCategory.WIN_STREAK]: [],
    [LeaderboardCategory.GEMS_EARNED]: []
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>(LeaderboardCategory.PVP_WINS);
  const gameState = useGameState();

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      setLoading(true);
      const categories = Object.values(LeaderboardCategory).filter(cat => cat !== LeaderboardCategory.WIN_STREAK);
      
      for (const category of categories) {
        try {
          const entries = await achievementsService.getLeaderboard(category, 50);
          setLeaderboards(prev => ({
            ...prev,
            [category]: entries
          }));
        } catch (error) {
          console.error(`Error loading leaderboard for ${category}:`, error);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
    const isCurrentUser = gameState.isAuthenticated && entry.userId === entry.userId; // In a real app, you'd compare with actual user ID
    
    return (
      <Card 
        key={entry.userId} 
        className={`transition-all hover:scale-[1.02] ${
          isCurrentUser ? 'border-primary bg-primary/5' : ''
        } ${index < 3 ? 'border-2 border-yellow-500/30' : ''}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                {getRankIcon(entry.rank)}
                <Badge className={`text-xs px-2 py-1 ${getRankBadgeColor(entry.rank)}`}>
                  #{entry.rank}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {entry.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {entry.username}
                    {isCurrentUser && <Star className="h-4 w-4 text-primary fill-primary" />}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {entry.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {entry.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedCategory.replace('_', ' ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLeaderboardTab = (category: LeaderboardCategory) => {
    const config = leaderboardConfigs[category];
    if (!config) return null;
    
    const entries = leaderboards[category] || [];
    const IconComponent = config.icon;

    return (
      <TabsContent key={category} value={category} className="mt-6">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <IconComponent className={`h-8 w-8 ${config.color}`} />
            <h2 className="text-2xl font-bold">{config.title}</h2>
          </div>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        <div className="space-y-3">
          {entries.length > 0 ? (
            entries.map((entry, index) => renderLeaderboardEntry(entry, index))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No entries yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to claim the top spot!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p>Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Leaderboards
        </h1>
        <p className="text-lg text-muted-foreground">
          Compete with players worldwide
        </p>
      </div>

      <Tabs defaultValue={LeaderboardCategory.PVP_WINS} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          {Object.entries(leaderboardConfigs).map(([category, config]) => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-2">
              <config.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{config.title.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(leaderboardConfigs).map((category) =>
          renderLeaderboardTab(category as LeaderboardCategory)
        )}
      </Tabs>
    </div>
  );
}