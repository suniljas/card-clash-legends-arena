import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Play
} from 'lucide-react';
import { ParticleSystem, AnimatedButton, FloatingElement } from './PremiumAnimations';
import { NetworkStatusIndicator } from './NetworkStatusIndicator';
import premiumLogo from '@/assets/game-logo-premium.png';
import { cn } from '@/lib/utils';

interface EnhancedMainMenuProps {
  onNavigate: (page: string) => void;
  user?: { email: string; name: string; provider: string } | null;
  onLogout?: () => void;
  gameStats?: {
    coins: number;
    gems: number;
    campaignProgress: number;
    pvpWins: number;
    totalCards: number;
  };
}

export function EnhancedMainMenu({ onNavigate, user, onLogout, gameStats }: EnhancedMainMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [backgroundAnimation, setBackgroundAnimation] = useState(0);

  // Animated background effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundAnimation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      id: 'campaign',
      title: 'Campaign',
      description: 'Epic single-player adventures',
      icon: BookOpen,
      gradient: 'from-primary via-primary/80 to-primary/60',
      particles: 'magic' as const,
      badge: gameStats?.campaignProgress ? `Level ${gameStats.campaignProgress}` : undefined
    },
    {
      id: 'pvp',
      title: 'PvP Arena',
      description: 'Battle other champions',
      icon: Swords,
      gradient: 'from-destructive via-red-500 to-orange-500',
      particles: 'combat' as const,
      badge: gameStats?.pvpWins ? `${gameStats.pvpWins} Wins` : undefined
    },
    {
      id: 'collection',
      title: 'Collection',
      description: 'Manage your heroes',
      icon: Users,
      gradient: 'from-secondary via-purple-500 to-indigo-500',
      particles: 'sparkles' as const,
      badge: gameStats?.totalCards ? `${gameStats.totalCards} Cards` : undefined
    },
    {
      id: 'deck',
      title: 'Deck Builder',
      description: 'Craft winning strategies',
      icon: Package,
      gradient: 'from-accent via-yellow-500 to-amber-500',
      particles: 'energy' as const
    },
    {
      id: 'shop',
      title: 'Card Packs',
      description: 'Discover new heroes',
      icon: ShoppingBag,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      particles: 'sparkles' as const
    },
    {
      id: 'gem-purchase',
      title: 'Premium Store',
      description: 'Unlock exclusive content',
      icon: Gem,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      particles: 'magic' as const,
      premium: true
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Limited-time challenges',
      icon: Zap,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      particles: 'energy' as const,
      badge: 'Live'
    },
    {
      id: 'tournament',
      title: 'Tournaments',
      description: 'Compete for glory',
      icon: Trophy,
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      particles: 'sparkles' as const,
      badge: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsl(var(--accent) / 0.05) 0%, transparent 50%),
            linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted) / 0.3))
          `,
          transform: `rotate(${backgroundAnimation * 0.1}deg)`
        }}
      />

      {/* Ambient Particles */}
      <ParticleSystem type="magic" intensity="low" className="opacity-30" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <FloatingElement intensity="subtle">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img 
                  src={premiumLogo} 
                  alt="Legends Card Clash Arena" 
                  className="h-24 w-auto object-contain filter drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>
          </FloatingElement>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse-glow">
              Welcome, Champion!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter the ultimate card battle arena where strategy meets legend
            </p>
          </div>

          {/* User Info Card */}
          {user && (
            <Card className="mt-6 p-4 max-w-md mx-auto bg-card/80 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <NetworkStatusIndicator />
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                {onLogout && (
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        {gameStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <Card className="p-4 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm border-primary/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{gameStats.coins.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Coins</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-card/80 to-secondary/5 backdrop-blur-sm border-secondary/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{gameStats.gems}</div>
                <div className="text-sm text-muted-foreground">Gems</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-card/80 to-accent/5 backdrop-blur-sm border-accent/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{gameStats.pvpWins}</div>
                <div className="text-sm text-muted-foreground">Victories</div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-card/80 to-muted/5 backdrop-blur-sm border-muted/20">
              <div className="text-center">
                <div className="text-2xl font-bold">{gameStats.totalCards}</div>
                <div className="text-sm text-muted-foreground">Heroes</div>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isHovered = hoveredItem === item.id;
            
            return (
              <Card
                key={item.id}
                className={cn(
                  'relative group cursor-pointer overflow-hidden',
                  'bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm',
                  'border-2 transition-all duration-300 ease-out',
                  'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl',
                  isHovered ? 'border-primary/50 shadow-lg shadow-primary/25' : 'border-border/50',
                  item.premium && 'ring-2 ring-accent/30'
                )}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onNavigate(item.id)}
              >
                {/* Particle Effects */}
                {isHovered && (
                  <ParticleSystem 
                    type={item.particles} 
                    intensity="medium" 
                    className="opacity-60" 
                  />
                )}

                {/* Background Gradient */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300',
                  item.gradient,
                  isHovered ? 'opacity-20' : 'opacity-10'
                )} />

                {/* Content */}
                <div className="relative z-10 p-6 text-center h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className={cn(
                      'p-4 rounded-full bg-gradient-to-br transition-all duration-300',
                      item.gradient,
                      isHovered ? 'scale-110 shadow-lg' : 'scale-100'
                    )}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title and Badge */}
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs',
                            item.badge === 'Live' && 'border-green-500 text-green-500 animate-pulse',
                            item.badge === 'Coming Soon' && 'border-yellow-500 text-yellow-500'
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <AnimatedButton
                      variant={item.premium ? 'premium' : 'primary'}
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(item.id);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Enter
                    </AnimatedButton>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={cn(
                  'absolute inset-0 border-2 border-transparent rounded-lg transition-colors duration-300',
                  isHovered && 'border-primary/30'
                )} />

                {/* Premium Shine Effect */}
                {item.premium && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex justify-center gap-4">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('tutorial')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Tutorial
          </AnimatedButton>
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </AnimatedButton>
        </div>

        {/* Daily Rewards Notification */}
        <Card className="mt-8 p-4 max-w-md mx-auto bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
          <div className="text-center">
            <div className="text-sm font-medium text-accent mb-2">🎁 Daily Reward Available!</div>
            <p className="text-xs text-muted-foreground">
              Claim your daily bonus and continue your legendary journey
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}