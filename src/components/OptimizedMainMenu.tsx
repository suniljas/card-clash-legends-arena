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

// Memoized menu item component for better performance
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
  >
    <OptimizedCard
      className="group cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl relative overflow-hidden"
      onClick={onClick}
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      <OptimizedCardHeader className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <OptimizedCardTitle className="text-lg font-bold">
          {title}
        </OptimizedCardTitle>
      </OptimizedCardHeader>
      
      <OptimizedCardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
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
        {/* Header */}
        <motion.header 
          className="text-center py-8 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Card Clash Legends
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master the art of strategic card combat
          </p>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 pb-8">
          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
        </main>
      </div>
    </OptimizedBackground>
  );
});

MainMenu.displayName = "MainMenu";