import { GameStats } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Coins, Gem, Trophy, Zap } from 'lucide-react';

interface GameHeaderProps {
  stats: GameStats;
}

export function GameHeader({ stats }: GameHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Game Title */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Card Clash Legends
            </h1>
            <p className="text-sm text-muted-foreground">
              Campaign Level {stats.campaignProgress}
            </p>
          </div>

          {/* Resources */}
          <div className="flex gap-4">
            <Card className="px-3 py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-accent" />
                <span className="font-medium text-accent">{stats.coins.toLocaleString()}</span>
              </div>
            </Card>

            <Card className="px-3 py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">{stats.gems}</span>
              </div>
            </Card>

            <Card className="px-3 py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-secondary" />
                <span className="font-medium text-secondary">{stats.pvpWins}</span>
              </div>
            </Card>

            <Card className="px-3 py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-foreground" />
                <span className="font-medium">{stats.totalCards}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}