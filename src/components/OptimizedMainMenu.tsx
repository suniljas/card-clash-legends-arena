import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { OptimizedBackground } from '@/components/OptimizedBackground';
import { OptimizedCard, OptimizedCardContent, OptimizedCardHeader, OptimizedCardTitle } from '@/components/OptimizedCard';
import { useOptimizedGameStore, useGameSettings } from '@/store/optimizedGameStore';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Swords, 
  BookOpen, 
  Trophy, 
  Store, 
  Users, 
  Target,
  Settings,
  Hammer,
  ShoppingBag,
  Gem,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: string) => void;
  playerData?: any;
  user?: { email: string; name: string; provider: string; uid: string } | null;
  onLogout?: () => void;
}

// Premium memoized menu item component with enhanced visual effects
const MenuGridItem = memo<{
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
  index: number;
}>(({ icon: Icon, title, description, badge, onClick, index }) => {
  // Define premium gradients and effects based on content
  const premiumStyles = useMemo(() => {
    const styleMap: Record<string, any> = {
      Campaign: {
        gradient: 'from-orange-600/20 via-red-600/20 to-pink-600/20',
        iconGradient: 'from-orange-500 to-red-600',
        glow: 'shadow-orange-500/25',
        border: 'border-orange-500/30'
      },
      Collection: {
        gradient: 'from-emerald-600/20 via-green-600/20 to-teal-600/20',
        iconGradient: 'from-emerald-500 to-green-600',
        glow: 'shadow-emerald-500/25',
        border: 'border-emerald-500/30'
      },
      'PvP Arena': {
        gradient: 'from-red-600/20 via-crimson-600/20 to-rose-600/20',
        iconGradient: 'from-red-500 to-rose-600',
        glow: 'shadow-red-500/25',
        border: 'border-red-500/30'
      },
      Shop: {
        gradient: 'from-yellow-600/20 via-amber-600/20 to-orange-600/20',
        iconGradient: 'from-yellow-500 to-amber-600',
        glow: 'shadow-yellow-500/25',
        border: 'border-yellow-500/30'
      },
      Achievements: {
        gradient: 'from-purple-600/20 via-violet-600/20 to-indigo-600/20',
        iconGradient: 'from-purple-500 to-violet-600',
        glow: 'shadow-purple-500/25',
        border: 'border-purple-500/30'
      },
      Leaderboards: {
        gradient: 'from-blue-600/20 via-cyan-600/20 to-sky-600/20',
        iconGradient: 'from-blue-500 to-cyan-600',
        glow: 'shadow-blue-500/25',
        border: 'border-blue-500/30'
      },
      'Deck Builder': {
        gradient: 'from-indigo-600/20 via-blue-600/20 to-purple-600/20',
        iconGradient: 'from-indigo-500 to-blue-600',
        glow: 'shadow-indigo-500/25',
        border: 'border-indigo-500/30'
      },
      Marketplace: {
        gradient: 'from-teal-600/20 via-cyan-600/20 to-blue-600/20',
        iconGradient: 'from-teal-500 to-cyan-600',
        glow: 'shadow-teal-500/25',
        border: 'border-teal-500/30'
      },
      'Gem Store': {
        gradient: 'from-pink-600/20 via-rose-600/20 to-red-600/20',
        iconGradient: 'from-pink-500 to-rose-600',
        glow: 'shadow-pink-500/25',
        border: 'border-pink-500/30'
      },
      Settings: {
        gradient: 'from-gray-600/20 via-slate-600/20 to-zinc-600/20',
        iconGradient: 'from-gray-500 to-slate-600',
        glow: 'shadow-gray-500/25',
        border: 'border-gray-500/30'
      }
    };
    return styleMap[title] || styleMap.Settings;
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.08, 
        y: -8,
        transition: { duration: 0.3, type: "spring", stiffness: 400 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <OptimizedCard
        className={cn(
          "group cursor-pointer relative overflow-hidden h-48",
          "bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95",
          "border-2 border-slate-700/50 backdrop-blur-xl",
          "hover:border-slate-500/70 transition-all duration-500",
          "shadow-2xl hover:shadow-3xl",
          premiumStyles.glow,
          "hover:" + premiumStyles.glow.replace('/25', '/40')
        )}
        onClick={onClick}
      >
        {/* Premium animated background gradient */}
        <motion.div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100",
            premiumStyles.gradient
          )}
          initial={false}
          transition={{ duration: 0.5 }}
        />
        
        {/* Animated border glow */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100",
            premiumStyles.border
          )}
          initial={false}
          animate={{ 
            boxShadow: [
              `0 0 0px ${premiumStyles.border.split('/')[0].split('-')[1]}`,
              `0 0 20px ${premiumStyles.border.split('/')[0].split('-')[1]}`,
              `0 0 0px ${premiumStyles.border.split('/')[0].split('-')[1]}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Premium content with enhanced spacing */}
        <OptimizedCardHeader className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Enhanced icon with premium styling */}
            <motion.div 
              className={cn(
                "p-4 rounded-2xl bg-gradient-to-br shadow-lg",
                premiumStyles.iconGradient,
                "group-hover:shadow-xl"
              )}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <Icon className="h-8 w-8 text-white drop-shadow-lg" />
            </motion.div>
            
            {/* Enhanced badge with premium styling */}
            {badge && (
              <motion.div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  "bg-gradient-to-r from-white/10 to-white/5",
                  "border border-white/20 backdrop-blur-sm",
                  "text-white shadow-lg"
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {badge}
              </motion.div>
            )}
          </div>
          
          {/* Enhanced title with premium typography */}
          <motion.h3 
            className="text-2xl font-bold text-white mb-3 leading-tight"
            whileHover={{ scale: 1.02 }}
          >
            <span className={cn(
              "bg-gradient-to-r bg-clip-text text-transparent",
              premiumStyles.iconGradient.replace('from-', 'from-').replace('to-', 'to-')
            )}>
              {title}
            </span>
          </motion.h3>
        </OptimizedCardHeader>
        
        <OptimizedCardContent className="relative z-10 px-6 pb-6">
          <p className="text-slate-300 leading-relaxed text-sm group-hover:text-slate-200 transition-colors duration-300">
            {description}
          </p>
        </OptimizedCardContent>

        {/* Premium floating elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Subtle shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </OptimizedCard>
    </motion.div>
  );
});

MenuGridItem.displayName = "MenuGridItem";

export const MainMenu = memo<MainMenuProps>(({ onNavigate, playerData, user, onLogout }) => {
  const settings = useGameSettings();
  
  // Performance monitoring
  usePerformanceMonitor({
    enableAutoOptimization: true,
    memoryThreshold: 150, // 150MB threshold
    fpsThreshold: 30
  });

  const handleNavigation = useCallback((page: string) => {
    onNavigate(page);
  }, [onNavigate]);

  const menuItems = [
    {
      icon: Swords,
      title: "Campaign",
      description: "Embark on epic quests through mystical realms",
      badge: "Adventure",
      page: "campaign"
    },
    {
      icon: BookOpen,
      title: "Collection",
      description: "Browse and manage your legendary card collection",
      badge: "Cards",
      page: "collection"
    },
    {
      icon: Users,
      title: "PvP Arena",
      description: "Challenge players worldwide in ranked battles",
      badge: "Competitive",
      page: "pvp-arena"
    },
    {
      icon: Store,
      title: "Shop",
      description: "Discover new cards and premium content",
      badge: "New Packs",
      page: "shop"
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Track your progress and unlock rewards",
      badge: "Rewards",
      page: "achievements"
    },
    {
      icon: Target,
      title: "Leaderboards",
      description: "Compete for glory on global rankings",
      badge: "Rankings",
      page: "leaderboards"
    },
    {
      icon: Hammer,
      title: "Deck Builder",
      description: "Craft the perfect deck for battle",
      badge: "Strategy",
      page: "deck-builder"
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Buy and sell cards with other players",
      badge: "Trade",
      page: "marketplace"
    },
    {
      icon: Gem,
      title: "Gem Store",
      description: "Purchase gems with real money",
      badge: "Premium",
      page: "gem-store"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Customize your game experience",
      badge: "",
      page: "settings"
    }
  ];

  return (
    <OptimizedBackground 
      variant="mystical" 
      intensity={settings.lowMemoryMode ? "low" : "high"}
    >
      <div className="min-h-screen flex flex-col relative">
        {/* Premium overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(244,114,182,0.1),transparent_50%)] pointer-events-none" />
        {/* Premium Enhanced Header */}
        <motion.header 
          className="text-center py-12 px-4 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-8 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-16 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          {/* Enhanced Title with Premium Effects */}
          <motion.div
            className="relative z-10 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1 
              className="text-6xl lg:text-7xl font-black mb-4 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                Card Clash 
              </span>
              <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Legends
              </span>
              
              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Crown className="w-8 h-8 text-yellow-400 opacity-80" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-6"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Sparkles className="w-6 h-6 text-blue-400" />
              </motion.div>
            </motion.h1>
            
            {/* Premium Subtitle */}
            <motion.p 
              className="text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Master the art of 
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold"> strategic card combat </span>
              and become a 
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold"> legendary champion</span>
            </motion.p>
          </motion.div>

          {/* Premium Achievement Badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 backdrop-blur-sm">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Welcome, Champion!</span>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
          </motion.div>
        </motion.header>

        {/* Premium Main Content */}
        <main className="flex-1 container mx-auto px-6 pb-12">
          {/* Enhanced Menu Grid with Premium Layout */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {menuItems.map((item, index) => (
              <MenuGridItem
                key={item.page}
                icon={item.icon}
                title={item.title}
                description={item.description}
                badge={item.badge}
                onClick={() => handleNavigation(item.page)}
                index={index}
              />
            ))}
          </motion.div>

          {/* Premium Footer Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 text-sm">Ready to begin your legendary journey?</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </motion.div>
        </main>
      </div>
    </OptimizedBackground>
  );
});

MainMenu.displayName = "MainMenu";