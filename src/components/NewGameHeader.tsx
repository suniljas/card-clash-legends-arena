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
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import premiumLogo from '@/assets/game-logo-premium.png';

// Enhanced animated counter component
const AnimatedCounter = ({ value, className = "" }: { value: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <motion.span 
      className={`font-bold ${className} ${isAnimating ? 'text-amber-300' : ''}`}
      animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
};

// Enhanced resource card component
const ResourceCard = ({ 
  icon: Icon, 
  value, 
  title, 
  color = "text-accent", 
  bgGradient = "from-amber-500/20 to-yellow-500/20",
  iconColor = "text-amber-400",
  glowColor = "amber"
}: {
  icon: React.ElementType;
  value: number;
  title: string;
  color?: string;
  bgGradient?: string;
  iconColor?: string;
  glowColor?: string;
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.05, 
      y: -2,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
  >
    <Card className={`px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br ${bgGradient} backdrop-blur-md border border-slate-600/50 hover:border-${glowColor}-400/60 transition-all duration-300 shadow-lg hover:shadow-${glowColor}-400/20 mystical-shimmer`}>
      <div className="flex items-center gap-2 sm:gap-3" title={title}>
        <div className={`p-1.5 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-700/50 shadow-inner`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} drop-shadow-lg`} />
        </div>
        <AnimatedCounter 
          value={value} 
          className={`${color} text-sm sm:text-base drop-shadow-sm`} 
        />
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${glowColor}-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none`} />
    </Card>
  </motion.div>
);

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
    <motion.div 
      className="w-full bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Premium Game Logo Section */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <img 
                src={premiumLogo} 
                alt={t('game.title')}
                className="h-14 w-auto object-contain filter drop-shadow-xl"
              />
              {/* Enhanced glow effect for logo */}
              <div className="absolute inset-0 bg-amber-400/20 blur-lg rounded-full opacity-50" />
            </div>
            <div className="flex flex-col gap-1">
              <motion.p 
                className="text-sm font-medium bg-gradient-to-r from-amber-200 to-amber-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('game.campaign')} Level {gameStats.campaignProgress}
              </motion.p>
              <CloudSaveIndicator 
                isAuthenticated={isAuthenticated} 
                isSyncing={isSyncing}
                className="text-xs"
              />
            </div>
          </motion.div>

          {/* Enhanced Resources and Controls */}
          <motion.div 
            className="flex items-center gap-3 md:gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Enhanced Resources Grid */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <ResourceCard
                icon={Coins}
                value={gameStats.coins}
                title={t('shop.coins')}
                color="text-amber-300"
                bgGradient="from-amber-500/20 to-yellow-500/20"
                iconColor="text-amber-400"
                glowColor="amber"
              />

              <ResourceCard
                icon={Gem}
                value={gameStats.gems}
                title={t('shop.gems')}
                color="text-blue-300"
                bgGradient="from-blue-500/20 to-cyan-500/20"
                iconColor="text-blue-400"
                glowColor="blue"
              />

              <ResourceCard
                icon={Trophy}
                value={gameStats.pvpWins}
                title={t('leaderboards.battles_won')}
                color="text-purple-300"
                bgGradient="from-purple-500/20 to-pink-500/20"
                iconColor="text-purple-400"
                glowColor="purple"
              />

              <ResourceCard
                icon={Zap}
                value={gameStats.totalCards}
                title={t('leaderboards.cards_collected')}
                color="text-emerald-300"
                bgGradient="from-emerald-500/20 to-green-500/20"
                iconColor="text-emerald-400"
                glowColor="emerald"
              />
            </div>

            {/* Enhanced Controls */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LanguageSelector />
              
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/60 hover:to-slate-500/60 border border-slate-600/50 hover:border-slate-500/60 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('common.logout', 'Logout')}</span>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}