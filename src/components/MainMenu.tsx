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
  Zap
} from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: string) => void;
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  const menuItems = [
    {
      id: 'campaign',
      title: 'Campaign',
      description: 'Fight through epic adventures',
      icon: BookOpen,
      gradient: 'from-primary to-primary/70'
    },
    {
      id: 'pvp',
      title: 'PvP Arena',
      description: 'Battle other players',
      icon: Swords,
      gradient: 'from-destructive to-destructive/70'
    },
    {
      id: 'collection',
      title: 'Collection',
      description: 'View your heroes',
      icon: Users,
      gradient: 'from-secondary to-secondary/70'
    },
    {
      id: 'deck',
      title: 'Deck Builder',
      description: 'Build your battle deck',
      icon: Package,
      gradient: 'from-accent to-accent/70'
    },
    {
      id: 'shop',
      title: 'Card Packs',
      description: 'Open new card packs',
      icon: ShoppingBag,
      gradient: 'from-muted-foreground to-muted-foreground/70'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Trade with other players',
      icon: ShoppingBag,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Limited-time challenges',
      icon: Zap,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'tournament',
      title: 'Tournaments',
      description: 'Compete for prizes',
      icon: Trophy,
      gradient: 'from-rarity-legend to-rarity-legend/70'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome, Champion!</h2>
        <p className="text-muted-foreground">
          Choose your path to glory
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.id}
              className="relative group cursor-pointer overflow-hidden bg-gradient-to-br from-card to-muted transition-smooth hover:scale-105 hover:shadow-lg border-border/50 touch-target active:scale-95"
              onClick={() => onNavigate(item.id)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              {/* Content */}
              <div className="relative z-10 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${item.gradient}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-lg transition-colors" />
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="touch-target transition-smooth hover:scale-105"
          onClick={() => onNavigate('tutorial')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Tutorial
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="touch-target transition-smooth hover:scale-105"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}