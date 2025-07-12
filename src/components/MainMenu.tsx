import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Star
  User,
  Crown,
  Star,
  Target
} from 'lucide-react';
import premiumLogo from '@/assets/game-logo-premium.png';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  onNavigate: (page: string) => void;
  user?: { email: string; name: string; provider: string } | null;
  onLogout?: () => void;
}

export function MainMenu({ onNavigate, user, onLogout }: MainMenuProps) {
  const menuItems = [
    {
      id: 'campaign',
      title: 'Campaign',
      description: 'Fight through epic adventures',
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-700',
      rarity: 'common'
      gradient: 'from-blue-500 to-blue-700',
      borderColor: 'border-blue-400/30',
      glowColor: 'shadow-blue-500/20',
      rarity: 'common'
    },
    {
      id: 'pvp',
      title: 'PvP Arena',
      description: 'Battle other players',
      icon: Swords,
      gradient: 'from-red-500 to-red-700',
      rarity: 'rare'
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
      gradient: 'from-purple-500 to-purple-700',
      rarity: 'uncommon'
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
      gradient: 'from-green-500 to-green-700',
      rarity: 'epic'
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
      gradient: 'from-yellow-500 to-yellow-700',
      rarity: 'legend'
      gradient: 'from-amber-500 to-amber-700',
      borderColor: 'border-amber-400/30',
      glowColor: 'shadow-amber-500/20',
      rarity: 'legend'
    },
    {
      id: 'gem-purchase',
      title: 'Buy Gems',
      description: 'Purchase premium currency',
      icon: Gem,
      gradient: 'from-emerald-500 to-emerald-700',
      rarity: 'ultra-legend'
      gradient: 'from-emerald-500 to-emerald-700',
      borderColor: 'border-emerald-400/30',
      glowColor: 'shadow-emerald-500/20',
      rarity: 'ultra-legend'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Trade with other players',
      icon: ShoppingBag,
      gradient: 'from-indigo-500 to-indigo-700',
      rarity: 'rare'
      gradient: 'from-violet-500 to-violet-700',
      borderColor: 'border-violet-400/30',
      glowColor: 'shadow-violet-500/20',
      rarity: 'epic'
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Limited-time challenges',
      icon: Zap,
      gradient: 'from-orange-500 to-orange-700',
      rarity: 'epic'
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
      gradient: 'from-pink-500 to-pink-700',
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
      gradient: 'from-yellow-500 to-yellow-700',
      borderColor: 'border-yellow-400/30',
      glowColor: 'shadow-yellow-500/20',
      rarity: 'legend'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Premium Logo and Welcome Section */}
      <div className="text-center mb-8">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <img 
              src={premiumLogo} 
              alt="Card Clash: Legends Arena" 
              className="h-24 w-auto object-contain filter drop-shadow-2xl animate-pulse-glow"
            />
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-20 blur-xl animate-pulse" />
          </div>
        </div>
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse-glow">
          Welcome, Champion!
        </h2>
        <p className="text-muted-foreground text-lg mb-4">
          Choose your path to glory in the ultimate card battle arena
        </p>
        
        {user && (
          <Card className="mt-4 p-4 max-w-sm mx-auto bg-gradient-to-br from-card to-muted border-primary/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-foreground">{user.name}</span>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </div>
              {onLogout && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Premium Logo and Welcome Section */}
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src={premiumLogo} 
                alt="Card Clash: Legends Arena" 
                className="h-24 w-auto object-contain filter drop-shadow-2xl animate-pulse-glow"
              />
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
            Card Clash: Legends Arena
          </h1>
          
          <h2 className="text-2xl font-semibold mb-3 text-white">
            Welcome, Champion!
          </h2>
          
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Choose your path to glory in the ultimate card battle arena. 
            Collect legendary heroes, build powerful decks, and dominate the battlefield.
          </p>
          
          {user && (
            <Card className="mt-6 p-4 max-w-md mx-auto bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
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
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

      {/* Enhanced Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.id}
              className={`
                relative group cursor-pointer overflow-hidden 
                bg-gradient-to-br from-card to-muted 
                transition-all duration-300 ease-out transform-gpu
                hover:scale-105 hover:-translate-y-2 hover:shadow-2xl
                border border-border/50 touch-target
                active:scale-95
                card-premium
                ${item.rarity === 'legend' || item.rarity === 'ultra-legend' ? 'animate-pulse-glow' : ''}
              `}
              onClick={() => onNavigate(item.id)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Enhanced Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Rarity indicator */}
              <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 transition-opacity">
                {getRarityIcon(item.rarity)}
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className={`
                    p-4 rounded-full bg-gradient-to-br ${item.gradient} 
                    shadow-lg group-hover:shadow-xl transition-shadow duration-300
                    ${item.rarity === 'legend' || item.rarity === 'ultra-legend' ? 'animate-pulse' : ''}
                  `}>
                    <IconComponent className="w-8 h-8 text-white" />
        {/* Enhanced Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={item.id}
                className={cn(
                  'relative group cursor-pointer overflow-hidden transition-all duration-500',
                  'bg-gradient-to-br from-slate-800/90 to-slate-700/90',
                  'hover:scale-105 hover:-translate-y-2',
                  'border-2 border-slate-600/50 hover:border-slate-500/70',
                  'shadow-lg hover:shadow-2xl',
                  'touch-target active:scale-95',
                  item.borderColor,
                  item.glowColor
                )}
                onClick={() => onNavigate(item.id)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Rarity indicator */}
                <div className="absolute top-3 right-3">
                  {item.rarity === 'legend' && <Crown className="w-4 h-4 text-yellow-400" />}
                  {item.rarity === 'ultra-legend' && <Star className="w-4 h-4 text-pink-400 animate-pulse" />}
                  {item.rarity === 'epic' && <Target className="w-4 h-4 text-purple-400" />}
                  {item.rarity === 'rare' && <Gem className="w-4 h-4 text-blue-400" />}
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className={`p-4 rounded-full bg-gradient-to-br ${item.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-slate-100 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    {item.description}
                  </p>
                </div>

                {/* Enhanced Hover Effect */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-current/30 rounded-lg transition-colors duration-300 ${item.borderColor}`} />
                
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.glowColor} blur-xl`} />
              </Card>
            );
          })}
        </div>

      {/* Enhanced Quick Actions */}
      <div className="mt-12 flex justify-center gap-4 flex-wrap">
        <Button
          variant="outline"
          size="lg"
          className="touch-target transition-all duration-300 hover:scale-105 hover:bg-primary/10 hover:border-primary/50"
          onClick={() => onNavigate('tutorial')}
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Tutorial
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="touch-target transition-all duration-300 hover:scale-105 hover:bg-secondary/10 hover:border-secondary/50"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="touch-target transition-all duration-300 hover:scale-105 hover:bg-accent/10 hover:border-accent/50"
          onClick={() => onNavigate('achievements')}
        >
          <Trophy className="w-5 h-5 mr-2" />
          Achievements
        </Button>
      </div>

      {/* Version and status info */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </span>
        </div>
        <p>Ready for epic card battles!</p>
        {/* Enhanced Quick Actions */}
        <div className="mt-12 flex justify-center gap-6">
          <Button
            variant="outline"
            size="lg"
            className="touch-target transition-all duration-300 hover:scale-105 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400"
            onClick={() => onNavigate('tutorial')}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Tutorial
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="touch-target transition-all duration-300 hover:scale-105 border-purple-400/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400"
            onClick={() => onNavigate('settings')}
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>© 2024 Card Clash: Legends Arena. All rights reserved.</p>
          <p className="mt-2">Experience the ultimate card battle adventure</p>
        </div>
      </div>
    </div>
  );
}