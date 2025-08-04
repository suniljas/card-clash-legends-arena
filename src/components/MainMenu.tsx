import { Button } from '@/components/ui-design-system/foundation/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-design-system/foundation/Card';
import { ThemeToggle } from '@/components/ui-design-system/utility/ThemeProvider';
import { QuickFeedback, useFeedback } from '@/components/ui-design-system/utility/QuickFeedback';
import { useUISound } from '@/components/ui-design-system/utility/AudioProvider';
import { DynamicBackground } from './DynamicBackground';
import { 
  Swords, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  Settings,
  Trophy,
  Package,
  Zap,
  Gem,
  LogOut,
  User,
  Crown,
  Star,
  Target,
  Map,
  Beaker,
  Scroll,
  Sword,
  Volume2,
  Moon,
  Sun
} from 'lucide-react';
import premiumLogo from '@/assets/game-logo-premium.png';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MainMenuProps {
  onNavigate: (page: string) => void;
  user?: { email: string; name: string; provider: string } | null;
  onLogout?: () => void;
}

export function MainMenu({ onNavigate, user, onLogout }: MainMenuProps) {
  const { clickSound, hoverSound } = useUISound();
  const { handleFeedback } = useFeedback();
  
  const menuItems = [
    {
      id: 'path-of-legends',
      title: 'Path of Legends',
      description: 'Roguelike adventures with your Champions',
      icon: Map,
      variant: 'epic' as const,
      rarity: 'epic' as const
    },
    {
      id: 'legends-lab',
      title: 'Legends\' Lab',
      description: 'Experimental modes with unique rules',
      icon: Beaker,
      variant: 'rare' as const,
      rarity: 'rare' as const
    },
    {
      id: 'challenges',
      title: 'Challenges',
      description: 'Master game mechanics through focused training',
      icon: Target,
      variant: 'uncommon' as const,
      rarity: 'uncommon' as const
    },
    {
      id: 'pvp',
      title: 'PvP Arena',
      description: 'Battle other players',
      icon: Swords,
      variant: 'rare' as const,
      rarity: 'rare' as const
    },
    {
      id: 'collection',
      title: 'Collection',
      description: 'View your heroes',
      icon: Users,
      variant: 'uncommon' as const,
      rarity: 'uncommon' as const
    },
    {
      id: 'deck',
      title: 'Deck Builder',
      description: 'Build your battle deck',
      icon: Package,
      variant: 'epic' as const,
      rarity: 'epic' as const
    },
    {
      id: 'shop',
      title: 'Card Packs',
      description: 'Open new card packs',
      icon: ShoppingBag,
      variant: 'legend' as const,
      rarity: 'legend' as const
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Buy and sell cards with other players',
      icon: ShoppingBag,
      variant: 'epic' as const,
      rarity: 'epic' as const
    },
    {
      id: 'gem-store',
      title: 'Gem Store',
      description: 'Purchase gems with real money',
      icon: Gem,
      variant: 'legendary' as const,
      rarity: 'legend' as const
    },
    {
      id: 'lore-codex',
      title: 'Lore Codex',
      description: 'Discover the rich lore and stories',
      icon: Scroll,
      variant: 'epic' as const,
      rarity: 'epic' as const
    },
    {
      id: 'champion-mastery',
      title: 'Champion Mastery',
      description: 'Master your champions and unlock rewards',
      icon: Crown,
      variant: 'legendary' as const,
      rarity: 'legend' as const
    },
    {
      id: 'wildcards',
      title: 'Wildcard System',
      description: 'Ethical card crafting system',
      icon: Star,
      variant: 'rare' as const,
      rarity: 'rare' as const
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Limited-time challenges',
      icon: Zap,
      variant: 'rare' as const,
      rarity: 'rare' as const
    },
    {
      id: 'tournament',
      title: 'Tournaments',
      description: 'Compete for prizes',
      icon: Trophy,
      variant: 'legendary' as const,
      rarity: 'legend' as const
    }
  ];

  const handleMenuClick = (itemId: string) => {
    clickSound();
    onNavigate(itemId);
  };

  const handleMenuHover = () => {
    hoverSound();
  };

  return (
    <DynamicBackground variant="menu" intensity="medium">
      <div className="min-h-screen relative">
        {/* Enhanced Header with Theme Toggle */}
        <motion.div 
          className="absolute top-4 right-4 z-10 flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ThemeToggle />
          {user && (
            <Button
              variant="outline"
              size="sm"
              icon={<LogOut className="h-4 w-4" />}
              onClick={() => {
                clickSound();
                onLogout?.();
              }}
              className="backdrop-blur-sm"
            >
              Logout
            </Button>
          )}
        </motion.div>

        <div className="container mx-auto px-4 py-8">
        {/* Enhanced Premium Logo and Welcome Section with Animations */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              <motion.img 
                src={premiumLogo} 
                alt="Card Clash: Legends Arena" 
                className="h-24 w-auto object-contain filter drop-shadow-2xl"
                animate={{ 
                  filter: [
                    'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))',
                    'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))',
                    'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Enhanced Logo glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl" 
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold mb-4 text-gradient-hero drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Card Clash: Legends Arena
          </motion.h1>
          
          <motion.h2 
            className="text-2xl font-semibold mb-3 text-foreground/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Welcome, Champion!
          </motion.h2>
          
          <motion.p 
            className="text-foreground/70 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Choose your path to glory in the ultimate card battle arena. 
            Collect legendary heroes, build powerful decks, and dominate the battlefield.
          </motion.p>
          
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Card className="mt-6 p-4 max-w-md mx-auto bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/90 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.provider}</div>
                    </div>
                  </div>
                  {onLogout && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onLogout}
                      className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Menu Grid with Staggered Animations */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6 + (index * 0.1),
                  ease: "easeOut"
                }}
              >
                <Card
                  variant={item.variant}
                  rarity={item.rarity}
                  interactive={true}
                  tilt={true}
                  className="h-full cursor-pointer group modern-card-interactive !bg-gradient-to-br !from-card !to-secondary/20 hover:!from-card hover:!to-primary/10"
                  onCardClick={() => handleMenuClick(item.id)}
                  onCardHover={handleMenuHover}
                  haptic={true}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <motion.div
                        className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-300 shadow-lg"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="h-7 w-7 text-primary drop-shadow-sm" />
                      </motion.div>
                      
                      {/* Enhanced rarity indicator */}
                      <div className="flex items-center gap-1">
                        {item.rarity === 'legend' && (
                          <div className="p-1 rounded-full bg-yellow-400/20">
                            <Crown className="h-4 w-4 text-yellow-400 drop-shadow-sm" />
                          </div>
                        )}
                        {item.rarity === 'epic' && (
                          <div className="p-1 rounded-full bg-purple-400/20">
                            <Gem className="h-4 w-4 text-purple-400 drop-shadow-sm" />
                          </div>
                        )}
                        {item.rarity === 'rare' && (
                          <div className="p-1 rounded-full bg-blue-400/20">
                            <Star className="h-4 w-4 text-blue-400 drop-shadow-sm" />
                          </div>
                        )}
                        {item.rarity === 'uncommon' && (
                          <div className="p-1 rounded-full bg-green-400/20">
                            <Star className="h-3 w-3 text-green-400 drop-shadow-sm" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 text-shadow">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-foreground/70 group-hover:text-foreground/90 transition-colors duration-300 text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Quick Actions Bar */}
        <motion.div
          className="mt-12 flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            variant="outline"
            size="lg"
            icon={<Settings className="h-5 w-5" />}
            onClick={() => handleMenuClick('settings')}
            className="btn-modern-secondary backdrop-blur-sm"
          >
            Settings
          </Button>
          
          <Button
            variant="magical"
            size="lg"
            icon={<Star className="h-5 w-5" />}
            onClick={() => handleMenuClick('tutorial')}
            className="btn-modern-primary"
            glow={true}
          >
            Tutorial
          </Button>
        </motion.div>
        
        {/* User Welcome Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 flex justify-center"
          >
            <Card variant="glass" size="lg" className="max-w-md mx-auto">
              <CardContent className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="w-6 h-6 text-primary-foreground" />
                </motion.div>
                <div className="flex-1">
                  <div className="font-semibold text-card-foreground text-lg">{user.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">{user.provider} account</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Enhanced Footer with Fade-in Animation */}
        <motion.div 
          className="mt-16 text-center text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <p>© 2024 Card Clash: Legends Arena. All rights reserved.</p>
          <p className="mt-2">Experience the ultimate card battle adventure</p>
        </motion.div>
        </div>
      </div>
    </DynamicBackground>
  );
}