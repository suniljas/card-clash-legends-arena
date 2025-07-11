import { GameStats } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Coins, Gem, Trophy, Zap } from 'lucide-react';
import premiumLogo from '@/assets/game-logo-premium.png';
import { CloudSaveIndicator } from '@/components/CloudSaveIndicator';

interface GameHeaderProps {
  stats: GameStats;
  isAuthenticated?: boolean;
  isSyncing?: boolean;
}

export function GameHeader({ stats, isAuthenticated = false, isSyncing = false }: GameHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Premium Game Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={premiumLogo} 
              alt="Legends Card Clash Arena" 
              className="h-12 w-auto object-contain filter drop-shadow-lg"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Campaign Level {stats.campaignProgress}
              </p>
              <CloudSaveIndicator 
                isAuthenticated={isAuthenticated} 
                isSyncing={isSyncing}
                className="text-xs"
              />
            </div>
          </div>

          {/* Resources */}
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span className="font-medium text-accent text-xs sm:text-sm">{stats.coins.toLocaleString()}</span>
              </div>
            </Card>

            <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="font-medium text-primary text-xs sm:text-sm">{stats.gems}</span>
              </div>
            </Card>

            <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                <span className="font-medium text-secondary text-xs sm:text-sm">{stats.pvpWins}</span>
              </div>
            </Card>

            <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
                <span className="font-medium text-xs sm:text-sm">{stats.totalCards}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}