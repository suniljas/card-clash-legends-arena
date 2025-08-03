import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  Search, 
  Star,
  Gift,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

interface EmptyStateProps {
  variant?: 'collection' | 'search' | 'deck' | 'shop' | 'achievements' | 'general';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'secondary';
  };
  className?: string;
  animated?: boolean;
}

export function EmptyState({
  variant = 'general',
  title,
  description,
  action,
  className,
  animated = true
}: EmptyStateProps) {
  const getVariantConfig = (variant: EmptyStateProps['variant']) => {
    const configs = {
      collection: {
        icon: Users,
        defaultTitle: 'No Heroes in Collection',
        defaultDescription: 'Start your journey by opening card packs or visiting the shop to collect powerful heroes.',
        iconColor: 'text-blue-400',
        bgGradient: 'from-blue-500/10 to-purple-500/10',
        particles: ['⭐', '✨', '💎'],
        illustration: (
          <div className="relative">
            <div className="w-24 h-32 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs">+</span>
            </div>
          </div>
        )
      },
      search: {
        icon: Search,
        defaultTitle: 'No Results Found',
        defaultDescription: 'Try adjusting your search terms or filters to discover more content.',
        iconColor: 'text-amber-400',
        bgGradient: 'from-amber-500/10 to-orange-500/10',
        particles: ['🔍', '📝', '✨'],
        illustration: (
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-600 border-dashed rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-slate-500" />
            </div>
          </div>
        )
      },
      deck: {
        icon: Package,
        defaultTitle: 'Empty Deck',
        defaultDescription: 'Build your deck by adding heroes from your collection to create powerful combinations.',
        iconColor: 'text-green-400',
        bgGradient: 'from-green-500/10 to-emerald-500/10',
        particles: ['🃏', '⚔️', '🛡️'],
        illustration: (
          <div className="relative">
            <div className="w-20 h-28 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-slate-500" />
            </div>
          </div>
        )
      },
      shop: {
        icon: ShoppingBag,
        defaultTitle: 'Shop Coming Soon',
        defaultDescription: 'Amazing items and card packs will be available here soon. Stay tuned!',
        iconColor: 'text-purple-400',
        bgGradient: 'from-purple-500/10 to-pink-500/10',
        particles: ['💰', '🛒', '💎'],
        illustration: (
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
        )
      },
      achievements: {
        icon: Trophy,
        defaultTitle: 'No Achievements Yet',
        defaultDescription: 'Complete challenges and battles to unlock amazing achievements and rewards.',
        iconColor: 'text-yellow-400',
        bgGradient: 'from-yellow-500/10 to-amber-500/10',
        particles: ['🏆', '🌟', '🎖️'],
        illustration: (
          <div className="relative">
            <div className="w-16 h-20 bg-gradient-to-b from-yellow-600 to-amber-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
        )
      },
      general: {
        icon: Sparkles,
        defaultTitle: 'Nothing Here Yet',
        defaultDescription: 'This section is waiting for content. Check back soon for updates!',
        iconColor: 'text-slate-400',
        bgGradient: 'from-slate-500/10 to-slate-600/10',
        particles: ['✨', '💫', '⭐'],
        illustration: (
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        )
      }
    };
    
    return configs[variant || 'general'];
  };

  const config = getVariantConfig(variant);
  const Icon = config.icon;

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center relative overflow-hidden",
        `bg-gradient-to-br ${config.bgGradient}`,
        "rounded-xl border border-slate-700/50",
        className
      )}
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background Particles */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none">
          {config.particles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${20 + index * 25}%`,
                top: `${10 + index * 15}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              {particle}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Illustration */}
      <motion.div
        className="mb-6"
        initial={animated ? { scale: 0.8, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {config.illustration}
      </motion.div>

      {/* Icon with Floating Animation */}
      <motion.div
        className={cn("mb-4 p-4 rounded-full bg-slate-800/50 backdrop-blur-sm", config.iconColor)}
        animate={animated ? { y: [-5, 5, -5] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className="w-8 h-8" />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-xl font-bold text-white mb-2"
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {title || config.defaultTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-slate-400 max-w-md mb-6 leading-relaxed"
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {description || config.defaultDescription}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Button
            onClick={action.onClick}
            variant={action.variant === 'primary' ? 'default' : action.variant}
            className={cn(
              "gap-2 px-6 py-3",
              action.variant === 'primary' && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "transform hover:scale-105 active:scale-95"
            )}
          >
            {action.variant === 'primary' && <Zap className="w-4 h-4" />}
            {action.label}
          </Button>
        </motion.div>
      )}

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 rounded-xl border border-slate-600/30 pointer-events-none" />
      <motion.div
        className="absolute inset-0 rounded-xl border border-blue-500/20 pointer-events-none opacity-0"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// Preset components for common use cases
export const EmptyCollection = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="collection" {...props} />
);

export const EmptySearch = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="search" {...props} />
);

export const EmptyDeck = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="deck" {...props} />
);

export const EmptyShop = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="shop" {...props} />
);

export const EmptyAchievements = (props: Omit<EmptyStateProps, 'variant'>) => (
  <EmptyState variant="achievements" {...props} />
);