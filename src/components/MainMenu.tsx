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
} from 'lucide-react';
import premiumLogo from '@/assets/game-logo-premium.png';

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
    },
    {
      id: 'pvp',
      title: 'PvP Arena',
      description: 'Battle other players',
      icon: Swords,
      gradient: 'from-red-500 to-red-700',
      rarity: 'rare'
    },
    {
      id: 'collection',
      title: 'Collection',
      description: 'View your heroes',
      icon: Users,
      gradient: 'from-purple-500 to-purple-700',
      rarity: 'uncommon'
    },
    {
      id: 'deck',
      title: 'Deck Builder',
      description: 'Build your battle deck',
      icon: Package,
      gradient: 'from-green-500 to-green-700',
      rarity: 'epic'
    },
    {
      id: 'shop',
      title: 'Card Packs',
      description: 'Open new card packs',
      icon: ShoppingBag,
      gradient: 'from-yellow-500 to-yellow-700',
      rarity: 'legend'
    },
    {
      id: 'gem-purchase',
      title: 'Buy Gems',
      description: 'Purchase premium currency',
      icon: Gem,
      gradient: 'from-emerald-500 to-emerald-700',
      rarity: 'ultra-legend'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Trade with other players',
      icon: ShoppingBag,
      gradient: 'from-indigo-500 to-indigo-700',
      rarity: 'rare'
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Limited-time challenges',
      icon: Zap,
      gradient: 'from-orange-500 to-orange-700',
      rarity: 'epic'
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
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Enhanced Hover Effect */}
              <div className={`
                absolute inset-0 border-2 border-transparent 
                group-hover:border-primary/30 rounded-lg 
                transition-colors duration-300
                ${item.rarity === 'legend' || item.rarity === 'ultra-legend' ? 'group-hover:border-accent/50' : ''}
              `} />

              {/* Special effects for high rarity items */}
              {(item.rarity === 'legend' || item.rarity === 'ultra-legend') && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
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
      </div>
    </div>
  );
}