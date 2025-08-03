import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Star, 
  Crown, 
  Flame, 
  Shield, 
  Zap, 
  Gem, 
  Sword,
  Heart,
  Target,
  Award,
  Medal
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof achievementIcons;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'combat' | 'collection' | 'progression' | 'special';
}

const achievementIcons = {
  trophy: Trophy,
  star: Star,
  crown: Crown,
  flame: Flame,
  shield: Shield,
  zap: Zap,
  gem: Gem,
  sword: Sword,
  heart: Heart,
  target: Target,
  award: Award,
  medal: Medal
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = true,
  onClick,
  className
}: AchievementBadgeProps) {
  const Icon = achievementIcons[achievement.icon];
  
  const sizeClasses = {
    sm: 'w-16 h-16 p-2',
    md: 'w-20 h-20 p-3',
    lg: 'w-24 h-24 p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const rarityConfig = {
    common: {
      gradient: 'from-gray-400 to-gray-600',
      glow: 'shadow-gray-400/20',
      border: 'border-gray-400/30',
      particle: '✨'
    },
    rare: {
      gradient: 'from-blue-400 to-blue-600',
      glow: 'shadow-blue-400/40',
      border: 'border-blue-400/50',
      particle: '💎'
    },
    epic: {
      gradient: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-400/60',
      border: 'border-purple-400/70',
      particle: '👑'
    },
    legendary: {
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-400/80',
      border: 'border-amber-400/90',
      particle: '🌟'
    }
  };

  const config = rarityConfig[achievement.rarity];
  const progress = Math.min(achievement.progress / achievement.maxProgress, 1);

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer group",
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Main badge circle */}
      <div className={cn(
        "relative w-full h-full rounded-full",
        "bg-gradient-to-br from-slate-800 to-slate-900",
        "border-2",
        config.border,
        config.glow,
        "flex items-center justify-center",
        "transition-all duration-300",
        achievement.unlocked && "hover:shadow-lg"
      )}>
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-1 rounded-full opacity-20",
          `bg-gradient-to-br ${config.gradient}`
        )} />

        {/* Icon */}
        <div className={cn(
          "relative z-10",
          achievement.unlocked ? "text-white" : "text-slate-500",
          "transition-colors duration-300"
        )}>
          <Icon className={iconSizes[size]} />
        </div>

        {/* Glow effect for unlocked achievements */}
        {achievement.unlocked && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100",
              `bg-gradient-to-br ${config.gradient}`,
              "transition-opacity duration-300"
            )}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Progress ring */}
        {showProgress && !achievement.unlocked && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={`url(#gradient-${achievement.id})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id={`gradient-${achievement.id}`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Particles for legendary achievements */}
        {achievement.unlocked && achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xs"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 15}%`,
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {config.particle}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Unlock notification */}
      {achievement.unlocked && (
        <motion.div
          className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
}

interface ProgressTrackerProps {
  label: string;
  current: number;
  max: number;
  variant?: 'default' | 'experience' | 'health' | 'mana';
  size?: 'sm' | 'md' | 'lg';
  showNumbers?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressTracker({
  label,
  current,
  max,
  variant = 'default',
  size = 'md',
  showNumbers = true,
  animated = true,
  className
}: ProgressTrackerProps) {
  const progress = Math.min(current / max, 1);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantConfig = {
    default: {
      gradient: 'from-blue-500 to-purple-500',
      glow: 'shadow-blue-500/30'
    },
    experience: {
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-500/40'
    },
    health: {
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/40'
    },
    mana: {
      gradient: 'from-blue-400 to-cyan-500',
      glow: 'shadow-blue-500/40'
    }
  };

  const config = variantConfig[variant];

  return (
    <div className={cn("w-full", className)}>
      {/* Label and numbers */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        {showNumbers && (
          <span className="text-sm text-slate-400">
            {current.toLocaleString()} / {max.toLocaleString()}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className={cn(
        "relative w-full rounded-full bg-slate-700/50 overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            "h-full rounded-full",
            `bg-gradient-to-r ${config.gradient}`,
            config.glow,
            "relative overflow-hidden"
          )}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ transform: "translateX(-100%)" }}
            animate={{ transform: "translateX(100%)" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Glow overlay */}
        <div className={cn(
          "absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity",
          `bg-gradient-to-r ${config.gradient}`,
          "blur-sm"
        )} />
      </div>
    </div>
  );
}

interface GameStatsDisplayProps {
  stats: {
    level: number;
    experience: number;
    experienceToNext: number;
    coins: number;
    gems: number;
    cardsCollected: number;
    battlesWon: number;
  };
  className?: string;
}

export function GameStatsDisplay({ stats, className }: GameStatsDisplayProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      <motion.div
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-600/30"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium text-slate-300">Level</span>
        </div>
        <div className="text-2xl font-bold text-white">{stats.level}</div>
        <ProgressTracker
          label="Experience"
          current={stats.experience}
          max={stats.experienceToNext}
          variant="experience"
          size="sm"
          showNumbers={false}
          className="mt-2"
        />
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-600/30"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-slate-300">Battles Won</span>
        </div>
        <div className="text-2xl font-bold text-white">{stats.battlesWon}</div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-600/30"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Gem className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">Cards</span>
        </div>
        <div className="text-2xl font-bold text-white">{stats.cardsCollected}</div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-600/30"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-slate-300">Coins</span>
        </div>
        <div className="text-2xl font-bold text-white">{stats.coins.toLocaleString()}</div>
      </motion.div>
    </div>
  );
}