import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Sword
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
  const menuItems = [
    {
      id: 'path-of-legends',
      title: 'Path of Legends',
      description: 'Roguelike adventures with your Champions',
      icon: Map,
      gradient: 'from-purple-500 to-purple-700',
      borderColor: 'border-purple-400/30',
      glowColor: 'shadow-purple-500/20',
      rarity: 'epic'
    },
    {
      id: 'legends-lab',
      title: 'Legends\' Lab',
      description: 'Experimental modes with unique rules',
      icon: Beaker,
      gradient: 'from-green-500 to-green-700',
      borderColor: 'border-green-400/30',
      glowColor: 'shadow-green-500/20',
      rarity: 'rare'
    },
    {
      id: 'challenges',
      title: 'Challenges',
      description: 'Master game mechanics through focused training',
      icon: Target,
      gradient: 'from-orange-500 to-orange-700',
      borderColor: 'border-orange-400/30',
      glowColor: 'shadow-orange-500/20',
      rarity: 'uncommon'
    },
    {
      id: 'pvp',
      title: 'PvP Arena',
      description: 'Battle other players',
      icon: Swords,
      gradient: 'from-red-500 to-red-700',
      borderColor: 'border-red-400/30',
      glowColor: 'shadow-red-500/20',
      rarity: 'rare'
    },
    {
      id: 'collection',
      title: 'Collection',
      description: 'View your heroes',
      icon: Users,
      gradient: 'from-green-500 to-green-700',
      borderColor: 'border-green-400/30',
      glowColor: 'shadow-green-500/20',
      rarity: 'uncommon'
    },
    {
      id: 'deck',
      title: 'Deck Builder',
      description: 'Build your battle deck',
      icon: Package,
      gradient: 'from-purple-500 to-purple-700',
      borderColor: 'border-purple-400/30',
      glowColor: 'shadow-purple-500/20',
      rarity: 'epic'
    },
    {
      id: 'shop',
      title: 'Card Packs',
      description: 'Open new card packs',
      icon: ShoppingBag,
      gradient: 'from-amber-500 to-amber-700',
      borderColor: 'border-amber-400/30',
      glowColor: 'shadow-amber-500/20',
      rarity: 'legend'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Buy and sell cards with other players',
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-blue-700',
      borderColor: 'border-blue-400/30',
      glowColor: 'shadow-blue-500/20',
      rarity: 'epic'
    },
    {
      id: 'gem-store',
      title: 'Gem Store',
      description: 'Purchase gems with real money',
      icon: Gem,
      gradient: 'from-purple-500 to-purple-700',
      borderColor: 'border-purple-400/30',
      glowColor: 'shadow-purple-500/20',
      rarity: 'legend'
    },
    {
      id: 'lore-codex',
      title: 'Lore Codex',
      description: 'Discover the rich lore and stories',
      icon: Scroll,
      gradient: 'from-violet-500 to-violet-700',
      borderColor: 'border-violet-400/30',
      glowColor: 'shadow-violet-500/20',
      rarity: 'epic'
    },
    {
      id: 'champion-mastery',
      title: 'Champion Mastery',
      description: 'Master your champions and unlock rewards',
      icon: Crown,
      gradient: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-400/30',
      glowColor: 'shadow-orange-500/20',
      rarity: 'legend'
    },
    {
      id: 'wildcards',
      title: 'Wildcard System',
      description: 'Ethical card crafting system',
      icon: Star,
      gradient: 'from-emerald-500 to-emerald-700',
      borderColor: 'border-emerald-400/30',
      glowColor: 'shadow-emerald-500/20',
      rarity: 'rare'
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Limited-time challenges',
      icon: Zap,
      gradient: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-400/30',
      glowColor: 'shadow-orange-500/20',
      rarity: 'rare'
    },
    {
      id: 'tournament',
      title: 'Tournaments',
      description: 'Compete for prizes',
      icon: Trophy,
      gradient: 'from-yellow-500 to-yellow-700',
      borderColor: 'border-yellow-400/30',
      glowColor: 'shadow-yellow-500/20',
      rarity: 'legend'
    }
  ];

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-3 h-3" />;
      case 'uncommon': return <Star className="w-3 h-3" />;
      case 'rare': return <Gem className="w-3 h-3" />;
      case 'epic': return <Crown className="w-3 h-3" />;
      case 'legend': return <Crown className="w-4 h-4" />;
      case 'ultra-legend': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  return (
    <DynamicBackground variant="menu" intensity="medium">
      <div className="min-h-screen relative">
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
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Card Clash: Legends Arena
          </motion.h1>
          
          <motion.h2 
            className="text-2xl font-semibold mb-3 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Welcome, Champion!
          </motion.h2>
          
          <motion.p 
            className="text-slate-300 text-lg max-w-2xl mx-auto"
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
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={cn(
                    'menu-item-lor relative group overflow-hidden cursor-pointer',
                    'bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm',
                    'border-2 border-slate-600/50 hover:border-slate-500/70',
                    'shadow-lg hover:shadow-2xl',
                    'focus-lor transition-all duration-300',
                    item.borderColor,
                    item.glowColor
                  )}
                  onClick={() => onNavigate(item.id)}
                >
                  {/* Enhanced Background Gradient with Animation */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                
                  {/* Enhanced Rarity indicator with Animation */}
                  <motion.div 
                    className="absolute top-3 right-3"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.rarity === 'legend' && <Crown className="w-4 h-4 text-yellow-400" />}
                    {item.rarity === 'ultra-legend' && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Star className="w-4 h-4 text-pink-400" />
                      </motion.div>
                    )}
                    {item.rarity === 'epic' && <Target className="w-4 h-4 text-purple-400" />}
                    {item.rarity === 'rare' && <Gem className="w-4 h-4 text-blue-400" />}
                  </motion.div>
                  
                  {/* Enhanced Content with Micro-animations */}
                  <div className="relative z-10 p-6 text-center">
                    <motion.div 
                      className="mb-4 flex justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`p-4 rounded-full bg-gradient-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-xl font-bold mb-3 text-white group-hover:text-slate-100 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.title}
                    </motion.h3>
                    
                    <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                      {item.description}
                    </p>
                  </div>

                  {/* Enhanced Hover Effects */}
                  <div className={`absolute inset-0 border-2 border-transparent group-hover:border-current/30 rounded-lg transition-colors duration-300 ${item.borderColor}`} />
                  
                  {/* Enhanced Glow effect on hover */}
                  <motion.div 
                    className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 ${item.glowColor} blur-xl`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Quick Actions with Animations */}
        <motion.div 
          className="mt-12 flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.button
            className="btn-lor-primary focus-lor"
            onClick={() => onNavigate('tutorial')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-5 h-5 mr-2 inline" />
            Tutorial
          </motion.button>
          <motion.button
            className="btn-lor-secondary focus-lor"
            onClick={() => onNavigate('settings')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 mr-2 inline" />
            Settings
          </motion.button>
        </motion.div>
        
        {/* Enhanced Footer with Fade-in Animation */}
        <motion.div 
          className="mt-16 text-center text-slate-500 text-sm"
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