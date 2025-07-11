import { useGameState } from '@/hooks/useGameState';
import { CloudSaveIndicator } from './CloudSaveIndicator';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Card } from './ui/card';
import { Coins, Gem, Trophy, Zap } from 'lucide-react';
import premiumLogo from '@/assets/game-logo-premium.png';

export function NewGameHeader() {
  const { t } = useTranslation();
  const { 
    gameStats,
    isAuthenticated, 
    isSyncing
  } = useGameState();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Premium Game Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={premiumLogo} 
              alt={t('game.title')}
              className="h-12 w-auto object-contain filter drop-shadow-lg"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {t('game.campaign')} Level {gameStats.campaignProgress}
              </p>
              <CloudSaveIndicator 
                isAuthenticated={isAuthenticated} 
                isSyncing={isSyncing}
                className="text-xs"
              />
            </div>
          </div>

          {/* Resources and Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Resources */}
            <div className="flex gap-2 sm:gap-4 flex-wrap">
              <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-1 sm:gap-2" title={t('shop.coins')}>
                  <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                  <span className="font-medium text-accent text-xs sm:text-sm">{gameStats.coins.toLocaleString()}</span>
                </div>
              </Card>

              <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-1 sm:gap-2" title={t('shop.gems')}>
                  <Gem className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="font-medium text-primary text-xs sm:text-sm">{gameStats.gems}</span>
                </div>
              </Card>

              <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-1 sm:gap-2" title={t('leaderboards.battles_won')}>
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                  <span className="font-medium text-secondary text-xs sm:text-sm">{gameStats.pvpWins}</span>
                </div>
              </Card>

              <Card className="px-2 sm:px-3 py-1 sm:py-2 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-1 sm:gap-2" title={t('leaderboards.cards_collected')}>
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
                  <span className="font-medium text-xs sm:text-sm">{gameStats.totalCards}</span>
                </div>
              </Card>
            </div>

            {/* Controls */}
            <LanguageSelector />
            
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.logout', 'Logout')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}