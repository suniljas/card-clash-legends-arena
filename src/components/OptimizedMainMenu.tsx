import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { OptimizedBackground } from '@/components/OptimizedBackground';
import { OptimizedCard, OptimizedCardContent, OptimizedCardHeader, OptimizedCardTitle } from '@/components/OptimizedCard';
import { useOptimizedGameStore, useGameSettings } from '@/store/optimizedGameStore';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Badge } from '@/components/ui/badge';
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
  Gem
} from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: string) => void;
  playerData?: any;
  user?: { email: string; name: string; provider: string; uid: string } | null;
  onLogout?: () => void;
}

// Enhanced memoized menu item component with premium LoR-inspired styling
const MenuGridItem = memo<{
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
  index: number;
}>(({ icon: Icon, title, description, badge, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <OptimizedCard
      className="group cursor-pointer relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 border-slate-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
      onClick={onClick}
    >
      {/* Premium frosted glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Subtle glow border animation */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
      
      {/* Premium shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      
      <OptimizedCardHeader className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 shadow-lg">
            <Icon className="h-6 w-6 text-primary group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
          </div>
          {badge && (
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 text-xs border border-amber-500/30 backdrop-blur-sm font-medium"
            >
              {badge}
            </Badge>
          )}
        </div>
        <OptimizedCardTitle className="text-lg font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-100 transition-all duration-300">
          {title}
        </OptimizedCardTitle>
      </OptimizedCardHeader>
      
      <OptimizedCardContent>
        <p className="text-sm text-slate-300 group-hover:text-slate-200 leading-relaxed transition-colors duration-300">
          {description}
        </p>
      </OptimizedCardContent>
    </OptimizedCard>
  </motion.div>
));

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
      variant="menu" 
      intensity={settings.lowMemoryMode ? "low" : "medium"}
    >
      <div className="min-h-screen flex flex-col">
        {/* Enhanced Premium Header with LoR inspiration */}
        <motion.header 
          className="text-center py-12 px-4 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Premium background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50" />
          
          <div className="relative">
            {/* Enhanced title with LoR-style gradients */}
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 relative font-fantasy">
              <span className="text-gradient-gold font-fantasy tracking-wide drop-shadow-2xl">
                Card Clash Legends
              </span>
              {/* Subtle glow effect behind text */}
              <span className="absolute inset-0 text-gradient-gold opacity-50 blur-sm -z-10 font-fantasy tracking-wide">
                Card Clash Legends
              </span>
            </h1>
            
            {/* Premium subtitle with enhanced styling */}
            <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              <span className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Master the art of strategic card combat
              </span>
            </p>
            
            {/* Decorative elements inspired by LoR */}
            <div className="flex justify-center items-center space-x-4 opacity-60">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>
          </div>
        </motion.header>

        {/* Enhanced Main Content */}
        <main className="flex-1 container mx-auto px-4 pb-8">
          {/* Menu Grid with improved spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
          </div>
          
          {/* Premium footer decoration */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex justify-center items-center space-x-6 opacity-40">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <div className="text-sm text-slate-400 font-medium tracking-wider">LEGENDS ARENA</div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
          </motion.div>
        </main>
      </div>
    </OptimizedBackground>
  );
});

MainMenu.displayName = "MainMenu";