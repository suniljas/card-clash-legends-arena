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

// Enhanced memoized menu item component with premium LoR-inspired styling and magical effects
const MenuGridItem = memo<{
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
  index: number;
}>(({ icon: Icon, title, description, badge, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateY: -15 }}
    animate={{ opacity: 1, y: 0, rotateY: 0 }}
    transition={{ 
      delay: index * 0.08, 
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      y: -12, 
      scale: 1.03,
      rotateY: 2,
      transition: { duration: 0.3, type: "spring", stiffness: 200 }
    }}
    whileTap={{ scale: 0.96 }}
    className="perspective-1000"
  >
    <OptimizedCard
      className="group cursor-pointer relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 border-slate-700/50 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/25 transform-3d"
      onClick={onClick}
    >
      {/* Enhanced mystical particles */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="mystical-particle text-primary/60" style={{ top: '20%', left: '15%' }} />
        <div className="mystical-particle text-accent/50" style={{ top: '60%', right: '20%' }} />
        <div className="mystical-particle text-blue-400/40" style={{ bottom: '30%', left: '70%' }} />
      </div>

      {/* Premium frosted glass effect with enhanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-blue-400/5 to-purple-400/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Enhanced glow border animation with mystical energy */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/25 via-accent/15 to-primary/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md animate-pulse-slow" />
      
      {/* Premium shimmer effect with legendary colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out" />
      
      {/* Magical border glow */}
      <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-gradient-to-r group-hover:from-primary/40 group-hover:via-accent/40 group-hover:to-primary/40 transition-all duration-500" />
      
      <OptimizedCardHeader className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <motion.div 
            className="p-3 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 backdrop-blur-sm group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-500 shadow-lg relative"
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)"
            }}
          >
            {/* Icon glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Icon className="h-6 w-6 text-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10 drop-shadow-lg" />
          </motion.div>
          {badge && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-100 text-xs border border-amber-500/40 backdrop-blur-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {badge}
              </Badge>
            </motion.div>
          )}
        </div>
        <OptimizedCardTitle className="text-lg font-bold text-gradient-premium group-hover:text-gradient-legendary transition-all duration-500 mb-1">
          {title}
        </OptimizedCardTitle>
      </OptimizedCardHeader>
      
      <OptimizedCardContent className="relative z-10">
        <p className="text-sm text-slate-300 group-hover:text-slate-100 leading-relaxed transition-colors duration-500 font-medium">
          {description}
        </p>
      </OptimizedCardContent>

      {/* Mystical energy field effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse-slow" />
      </div>
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
          className="text-center py-16 px-4 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Premium background glow with mystical energy */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent opacity-70" />
          
          {/* Mystical particle effects around title */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full"
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent/50 rounded-full"
              animate={{
                y: [5, -15, 5],
                x: [5, -5, 5],
                opacity: [0.2, 0.7, 0.2]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-400/40 rounded-full"
              animate={{
                y: [-8, 8, -8],
                x: [8, -8, 8],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>
          
          <div className="relative">
            {/* Enhanced title with premium gradients and magical glow */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold mb-8 relative font-fantasy"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 120 }}
            >
              <span className="text-gradient-premium font-fantasy tracking-wide drop-shadow-2xl relative z-10">
                Card Clash Legends
              </span>
              {/* Enhanced magical glow effect */}
              <span className="absolute inset-0 text-gradient-legendary opacity-30 blur-lg -z-10 font-fantasy tracking-wide animate-pulse-slow">
                Card Clash Legends
              </span>
              {/* Mystical energy border */}
              <span className="absolute inset-0 text-gradient-premium opacity-20 blur-2xl -z-20 font-fantasy tracking-wide scale-110">
                Card Clash Legends
              </span>
            </motion.h1>
            
            {/* Premium subtitle with enhanced styling and typewriter effect */}
            <motion.p 
              className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="bg-gradient-to-r from-slate-200 via-blue-200 to-purple-200 bg-clip-text text-transparent font-medium">
                Master the art of strategic card combat in mystical realms
              </span>
            </motion.p>
            
            {/* Enhanced decorative elements with magical energy */}
            <motion.div 
              className="flex justify-center items-center space-x-6 opacity-70"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
            >
              <motion.div 
                className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-3 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg"
                animate={{ 
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    "0 0 10px rgba(245, 158, 11, 0.5)",
                    "0 0 20px rgba(245, 158, 11, 0.8)",
                    "0 0 10px rgba(245, 158, 11, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
            </motion.div>
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