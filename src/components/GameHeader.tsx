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
    <div className="w-full bg-card/90 backdrop-blur-md border-b border-border/50 shadow-lg relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Premium Game Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={premiumLogo} 
                alt="Legends Card Clash Arena" 
                className="h-14 w-auto object-contain filter drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl -z-10" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground/90">
                Campaign Level {stats.campaignProgress}
              </p>
              <CloudSaveIndicator 
                isAuthenticated={isAuthenticated} 
                isSyncing={isSyncing}
                className="text-xs"
              />
            </div>
          </div>

          {/* Enhanced Resources */}
          <div className="flex gap-3 flex-wrap">
            <div className="modern-card !p-3 !bg-gradient-to-r !from-accent/10 !to-accent/20 !border-accent/30">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-accent drop-shadow-sm" />
                <span className="font-semibold text-accent text-sm tracking-wide">
                  {stats.coins.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="modern-card !p-3 !bg-gradient-to-r !from-primary/10 !to-primary/20 !border-primary/30">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-primary drop-shadow-sm" />
                <span className="font-semibold text-primary text-sm tracking-wide">
                  {stats.gems}
                </span>
              </div>
            </div>

            <div className="modern-card !p-3 !bg-gradient-to-r !from-green-500/10 !to-green-500/20 !border-green-500/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-400 drop-shadow-sm" />
                <span className="font-semibold text-green-400 text-sm tracking-wide">
                  {stats.pvpWins}
                </span>
              </div>
            </div>

            <div className="modern-card !p-3 !bg-gradient-to-r !from-blue-500/10 !to-blue-500/20 !border-blue-500/30">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400 drop-shadow-sm" />
                <span className="font-semibold text-blue-400 text-sm tracking-wide">
                  {stats.totalCards}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}