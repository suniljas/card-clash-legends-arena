import { useGameState } from '@/hooks/useGameState';
import { CloudSaveIndicator } from './CloudSaveIndicator';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Coins, Gem, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import premiumLogo from '@/assets/game-logo-premium.png';
import { memo, useState, useEffect } from 'react';

// Enhanced Resource Counter Component with Premium Animations
const ResourceCounter = memo<{
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
  glowColor: string;
}>(({ icon: Icon, value, label, color, glowColor }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <motion.div
      className="resource-counter group relative"
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      {/* Magical glow effect */}
      <div 
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-sm`}
        style={{ backgroundColor: glowColor }}
      />
      
      {/* Resource icon with mystical effects */}
      <motion.div 
        className="resource-counter-icon relative"
        animate={isAnimating ? { 
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <Icon 
          className={`w-4 h-4 relative z-10 transition-all duration-300 group-hover:scale-110`}
          style={{ color }}
        />
        {/* Icon shadow/glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-40 blur-sm group-hover:opacity-70 transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />
      </motion.div>

      {/* Animated value display */}
      <AnimatePresence mode="wait">
        <motion.span
          key={displayValue}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 1.2 }}
          transition={{ duration: 0.3, type: "spring" }}
          className={`font-bold text-sm relative z-10 transition-all duration-300 group-hover:text-white`}
          style={{ color }}
        >
          {displayValue.toLocaleString()}
        </motion.span>
      </AnimatePresence>

      {/* Premium sparkle effects */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          className="absolute top-1 right-1 w-1 h-1 bg-amber-300 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-blue-300 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
        />
      </div>
    </motion.div>
  );
});

ResourceCounter.displayName = "ResourceCounter";

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
      className="w-full bg-gradient-to-r from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Premium Game Logo */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.img 
              src={premiumLogo} 
              alt={t('game.title')}
              className="h-14 w-auto object-contain filter drop-shadow-2xl"
              whileHover={{ 
                scale: 1.05, 
                rotate: 2,
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))"
              }}
              transition={{ duration: 0.3 }}
            />
            <div className="flex flex-col gap-1">
              <motion.p 
                className="text-sm font-medium bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
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
          <div className="flex items-center gap-3 md:gap-6">
            {/* Premium Resources Display */}
            <motion.div 
              className="flex gap-3 sm:gap-4 flex-wrap"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ResourceCounter
                icon={Coins}
                value={gameStats.coins}
                label={t('shop.coins')}
                color="#f59e0b"
                glowColor="#f59e0b33"
              />
              
              <ResourceCounter
                icon={Gem}
                value={gameStats.gems}
                label={t('shop.gems')}
                color="#3b82f6"
                glowColor="#3b82f633"
              />
              
              <ResourceCounter
                icon={Trophy}
                value={gameStats.pvpWins}
                label={t('leaderboards.battles_won')}
                color="#10b981"
                glowColor="#10b98133"
              />
              
              <ResourceCounter
                icon={Zap}
                value={gameStats.totalCards}
                label={t('leaderboards.cards_collected')}
                color="#8b5cf6"
                glowColor="#8b5cf633"
              />
            </motion.div>

            {/* Enhanced Controls */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LanguageSelector />
              
              {isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('common.logout', 'Logout')}</span>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mystical energy border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
    </motion.div>
  );
}