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
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      delay: index * 0.1, 
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 15
    }}
    whileHover={{ 
      y: -12, 
      scale: 1.03,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
    whileTap={{ scale: 0.96 }}
    className="perspective-1000"
  >
    <OptimizedCard
      className="group cursor-pointer relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 border border-slate-700/60 hover:border-amber-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-400/20 h-full"
      onClick={onClick}
    >
      {/* Enhanced gradient overlay with mystical colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-slate-900/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Premium glow border with pulsing animation */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/30 via-blue-500/20 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-sm animate-pulse-glow" />
      
      {/* Enhanced shimmer effect with mystical colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-4 left-4 w-1 h-1 bg-amber-400 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-6 left-8 w-0.5 h-0.5 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <OptimizedCardHeader className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-amber-500/20 via-blue-500/15 to-purple-500/20 backdrop-blur-sm group-hover:from-amber-400/30 group-hover:via-blue-400/25 group-hover:to-purple-400/30 transition-all duration-500 shadow-lg group-hover:shadow-amber-400/30">
            <Icon className="h-7 w-7 text-amber-300 group-hover:text-amber-200 group-hover:scale-125 transition-all duration-500 drop-shadow-lg" />
          </div>
          {badge && (
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-100 text-xs border border-amber-400/40 backdrop-blur-sm font-medium px-3 py-1 shadow-lg"
            >
              {badge}
            </Badge>
          )}
        </div>
        <OptimizedCardTitle className="text-xl font-bold bg-gradient-to-r from-slate-100 via-amber-100 to-slate-100 bg-clip-text text-transparent group-hover:from-white group-hover:via-amber-200 group-hover:to-white transition-all duration-500 font-fantasy">
          {title}
        </OptimizedCardTitle>
      </OptimizedCardHeader>
      
      <OptimizedCardContent className="px-6 pb-6">
        <p className="text-sm text-slate-300 group-hover:text-slate-200 leading-relaxed transition-colors duration-500 font-premium">
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
          className="text-center py-16 px-4 relative overflow-hidden"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced mystical background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-blue-500/5 to-purple-500/5 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-400/5 to-transparent opacity-40" />
          
          {/* Floating mystical particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-float" style={{ animationDelay: '4s' }} />
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-300 rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10">
            {/* Enhanced title with improved gradients and glow */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold mb-8 relative font-fantasy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <span className="text-gradient-gold font-fantasy tracking-wide drop-shadow-2xl relative">
                Card Clash Legends
              </span>
              {/* Enhanced glow effect with multiple layers */}
              <span className="absolute inset-0 text-gradient-gold opacity-30 blur-md -z-10 font-fantasy tracking-wide">
                Card Clash Legends
              </span>
              <span className="absolute inset-0 text-gradient-gold opacity-50 blur-sm -z-10 font-fantasy tracking-wide">
                Card Clash Legends
              </span>
            </motion.h1>
            
            {/* Enhanced subtitle with mystical styling */}
            <motion.p 
              className="text-xl lg:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="bg-gradient-to-r from-slate-200 via-amber-200 to-slate-200 bg-clip-text text-transparent font-premium">
                Master the art of strategic card combat
              </span>
            </motion.p>
            
            {/* Enhanced decorative elements with mystical flair */}
            <motion.div 
              className="flex justify-center items-center space-x-6 opacity-70"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <div className="relative">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse-glow"></div>
                <div className="absolute inset-0 w-3 h-3 bg-amber-400 rounded-full opacity-30 animate-ping"></div>
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <div className="relative">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="relative">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse-glow"></div>
                <div className="absolute inset-0 w-3 h-3 bg-amber-400 rounded-full opacity-30 animate-ping"></div>
              </div>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </motion.div>
          </div>
        </motion.header>

        {/* Enhanced Main Content */}
        <main className="flex-1 container mx-auto px-6 pb-12">
          {/* Enhanced Menu Grid with improved spacing and responsiveness */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
          
          {/* Enhanced premium footer decoration with mystical elements */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="flex justify-center items-center space-x-8 opacity-50 mb-6">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <div className="relative">
                <div className="text-lg text-amber-300 font-bold font-fantasy tracking-wider">LEGENDS ARENA</div>
                <div className="absolute inset-0 text-amber-300 opacity-30 blur-sm font-fantasy tracking-wider">LEGENDS ARENA</div>
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </div>
            
            {/* Additional mystical decorative elements */}
            <div className="flex justify-center items-center space-x-4 opacity-40">
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </motion.div>
        </main>
      </div>
    </OptimizedBackground>
  );
});

MainMenu.displayName = "MainMenu";